from __future__ import annotations

import hashlib
import hmac
import json
import mimetypes
import os
import secrets
import sqlite3
import re
import time
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import unquote, urlparse


ROOT = Path(__file__).resolve().parents[1]
FRONTEND_DIR = ROOT / "frontend"
DATA_DIR = ROOT / "data"
DB_PATH = DATA_DIR / "app.db"
TOKEN_SECRET_PATH = DATA_DIR / ".token_secret"
ENV_PATH = ROOT / ".env"


def load_env_file(path: Path = ENV_PATH) -> None:
    if not path.exists():
        return
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key:
            os.environ.setdefault(key, value)


load_env_file()

ID_PATTERN = re.compile(r"^[A-Za-z0-9]{1,10}$")
PASSWORD_PATTERN = re.compile(r"^(?=.*[A-Za-z])(?=.*\d).{8,}$")
CAPTCHA_TTL_SECONDS = 300
CAPTCHA_MAX_ENTRIES = int(os.environ.get("FAMILY_LEDGER_CAPTCHA_MAX_ENTRIES", "200"))
CAPTCHA_STORE: dict[str, dict[str, Any]] = {}
SYSTEM_ADMIN_ID = os.environ.get("FAMILY_LEDGER_ADMIN_ID", "ADMIN_")
SYSTEM_ADMIN_PASSWORD = os.environ.get("FAMILY_LEDGER_ADMIN_PASSWORD", "ADMIN_PASSWORD")
SYSTEM_ADMIN_SUBJECT_PREFIX = "system-admin:"
TOKEN_TTL_SECONDS = int(os.environ.get("FAMILY_LEDGER_TOKEN_TTL_SECONDS", str(8 * 60 * 60)))
MAX_JSON_BODY_BYTES = int(os.environ.get("FAMILY_LEDGER_MAX_JSON_BODY_BYTES", str(256 * 1024)))
LOGIN_WINDOW_SECONDS = 10 * 60
LOGIN_MAX_FAILURES = 8
LOGIN_ATTEMPTS: dict[str, list[float]] = {}
ALLOWED_ORIGINS = {
    origin.strip().rstrip("/")
    for origin in os.environ.get(
        "FAMILY_LEDGER_ALLOWED_ORIGINS",
        "http://127.0.0.1:8001,http://localhost:8001,http://127.0.0.1:5173,http://localhost:5173",
    ).split(",")
    if origin.strip()
}


def load_token_secret() -> str:
    env_secret = os.environ.get("FAMILY_LEDGER_TOKEN_SECRET")
    if env_secret:
        return env_secret

    DATA_DIR.mkdir(exist_ok=True)
    if TOKEN_SECRET_PATH.exists():
        saved_secret = TOKEN_SECRET_PATH.read_text(encoding="utf-8").strip()
        if saved_secret:
            return saved_secret

    generated_secret = secrets.token_hex(32)
    TOKEN_SECRET_PATH.write_text(generated_secret, encoding="utf-8")
    return generated_secret


TOKEN_SECRET = load_token_secret()


def readable_id(prefix: str) -> str:
    return f"{prefix}-{secrets.token_hex(4).upper()}"


def readable_account_id(prefix: str) -> str:
    return f"{prefix[:1].upper()}{secrets.token_hex(4).upper()}"


def cleanup_captchas(now: float | None = None) -> None:
    now = now or time.time()
    expired = [captcha_id for captcha_id, item in CAPTCHA_STORE.items() if item["expires_at"] < now]
    for captcha_id in expired:
        CAPTCHA_STORE.pop(captcha_id, None)
    if len(CAPTCHA_STORE) > CAPTCHA_MAX_ENTRIES:
        oldest = sorted(CAPTCHA_STORE.items(), key=lambda item: item[1]["expires_at"])
        for captcha_id, _item in oldest[: len(CAPTCHA_STORE) - CAPTCHA_MAX_ENTRIES]:
            CAPTCHA_STORE.pop(captcha_id, None)


def create_captcha() -> dict[str, str]:
    cleanup_captchas()
    left = secrets.randbelow(8) + 2
    right = secrets.randbelow(8) + 2
    captcha_id = readable_id("CAPTCHA")
    CAPTCHA_STORE[captcha_id] = {
        "answer": str(left + right),
        "expires_at": time.time() + CAPTCHA_TTL_SECONDS,
    }
    cleanup_captchas()
    return {"captchaId": captcha_id, "question": f"{left} + {right} = ?"}


def verify_captcha(payload: dict[str, Any]) -> None:
    cleanup_captchas()
    captcha_id = str(payload.get("captchaId", "")).strip()
    answer = str(payload.get("captchaAnswer", "")).strip()
    if not captcha_id or not answer:
        raise ApiError(HTTPStatus.BAD_REQUEST, "请先完成验证码?")
    item = CAPTCHA_STORE.pop(captcha_id, None)
    if not item:
        raise ApiError(HTTPStatus.BAD_REQUEST, "验证码已失效，请刷新后重试?")
    if not hmac.compare_digest(item["answer"], answer):
        raise ApiError(HTTPStatus.BAD_REQUEST, "验证码不正确，请重新输入?")


def normalize_custom_id(value: str, prefix: str) -> str:
    cleaned = value.strip()
    if not cleaned:
        return ""
    if not ID_PATTERN.match(cleaned):
        raise ApiError(HTTPStatus.BAD_REQUEST, "ID 只能包含字母和数字，长度不能超过 10 位，并且区分大小写?")
    return cleaned


def validate_password_strength(password: str) -> None:
    if not PASSWORD_PATTERN.match(password):
        raise ApiError(HTTPStatus.BAD_REQUEST, "密码至少 8 位，并且霢要同时包含字母和数字?")


def hash_password(password: str, salt: str | None = None) -> tuple[str, str]:
    salt = salt or secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 120_000)
    return salt, digest.hex()


def verify_password(password: str, salt: str, digest: str) -> bool:
    _, candidate = hash_password(password, salt)
    return hmac.compare_digest(candidate, digest)


def temporary_password() -> str:
    return f"Tmp{secrets.token_urlsafe(9)}1"


def sign_token(subject: str, token_version: int = 0) -> str:
    expires_at = int(time.time()) + TOKEN_TTL_SECONDS
    body = f"{subject}.{expires_at}.{token_version}"
    signature = hmac.new(TOKEN_SECRET.encode("utf-8"), body.encode("utf-8"), hashlib.sha256).hexdigest()
    return f"{body}.{signature}"


def sign_user_token(row: sqlite3.Row) -> str:
    return sign_token(row["id"], int(row["token_version"]))


def system_admin_subject() -> str:
    return f"{SYSTEM_ADMIN_SUBJECT_PREFIX}{SYSTEM_ADMIN_ID}"


def sign_system_admin_token() -> str:
    return sign_token(system_admin_subject())


def token_claims(token: str) -> tuple[str, int] | None:
    parts = token.rsplit(".", 3)
    if len(parts) != 4:
        return None
    subject, expires_at_text, token_version_text, signature = parts
    try:
        expires_at = int(expires_at_text)
        token_version = int(token_version_text)
    except ValueError:
        return None
    if expires_at < int(time.time()):
        return None
    body = f"{subject}.{expires_at}.{token_version}"
    expected = hmac.new(TOKEN_SECRET.encode("utf-8"), body.encode("utf-8"), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(signature, expected):
        return None
    return subject, token_version


def connect() -> sqlite3.Connection:
    DATA_DIR.mkdir(exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db() -> None:
    with connect() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS families (
              id TEXT PRIMARY KEY,
              name TEXT NOT NULL,
              creator_user_id TEXT NOT NULL,
              created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS users (
              id TEXT PRIMARY KEY,
              family_id TEXT NOT NULL REFERENCES families(id) ON DELETE CASCADE,
              family_name TEXT NOT NULL,
              name TEXT NOT NULL,
              password_salt TEXT NOT NULL,
              password_hash TEXT NOT NULL,
              role TEXT NOT NULL CHECK (role IN ('creator', 'admin', 'member', 'child')),
              family_role TEXT NOT NULL,
              adult_type TEXT NOT NULL CHECK (adult_type IN ('adult', 'child')),
              status TEXT NOT NULL CHECK (status IN ('active', 'pending', 'rejected')),
              token_version INTEGER NOT NULL DEFAULT 0,
              created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS password_reset_requests (
              id TEXT PRIMARY KEY,
              family_id TEXT NOT NULL REFERENCES families(id) ON DELETE CASCADE,
              user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
              requester_name TEXT NOT NULL,
              message TEXT NOT NULL,
              status TEXT NOT NULL CHECK (status IN ('pending', 'resolved', 'rejected')),
              created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS transactions (
              id TEXT PRIMARY KEY,
              family_id TEXT NOT NULL REFERENCES families(id) ON DELETE CASCADE,
              payload TEXT NOT NULL,
              updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS budgets (
              id TEXT PRIMARY KEY,
              family_id TEXT NOT NULL REFERENCES families(id) ON DELETE CASCADE,
              payload TEXT NOT NULL,
              updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS child_requests (
              id TEXT PRIMARY KEY,
              family_id TEXT NOT NULL REFERENCES families(id) ON DELETE CASCADE,
              payload TEXT NOT NULL,
              updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS child_tasks (
              id TEXT PRIMARY KEY,
              family_id TEXT NOT NULL REFERENCES families(id) ON DELETE CASCADE,
              payload TEXT NOT NULL,
              updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS saving_goals (
              id TEXT PRIMARY KEY,
              family_id TEXT NOT NULL REFERENCES families(id) ON DELETE CASCADE,
              payload TEXT NOT NULL,
              updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS recurring_bills (
              id TEXT PRIMARY KEY,
              family_id TEXT NOT NULL REFERENCES families(id) ON DELETE CASCADE,
              payload TEXT NOT NULL,
              updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            """
        )
        columns = {row["name"] for row in conn.execute("PRAGMA table_info(users)")}
        if "token_version" not in columns:
            conn.execute("ALTER TABLE users ADD COLUMN token_version INTEGER NOT NULL DEFAULT 0")


def user_to_api(row: sqlite3.Row) -> dict[str, Any]:
    return {
        "id": row["id"],
        "familyId": row["family_id"],
        "familyName": row["family_name"],
        "name": row["name"],
        "role": row["role"],
        "familyRole": row["family_role"],
        "adultType": row["adult_type"],
        "status": row["status"],
    }


def family_to_api(row: sqlite3.Row) -> dict[str, Any]:
    return {
        "id": row["id"],
        "name": row["name"],
        "creatorUserId": row["creator_user_id"],
    }


def password_reset_to_api(row: sqlite3.Row) -> dict[str, Any]:
    return {
        "id": row["id"],
        "familyId": row["family_id"],
        "userId": row["user_id"],
        "requesterName": row["requester_name"],
        "message": row["message"],
        "status": row["status"],
        "createdAt": row["created_at"],
    }


LEDGER_TABLES = {
    "transactions": "transactions",
    "budgets": "budgets",
    "childRequests": "child_requests",
    "childTasks": "child_tasks",
    "savingGoals": "saving_goals",
    "recurringBills": "recurring_bills",
}


def decode_payload(row: sqlite3.Row) -> dict[str, Any]:
    try:
        item = json.loads(row["payload"])
    except json.JSONDecodeError:
        item = {}
    if not isinstance(item, dict):
        item = {}
    item.setdefault("id", row["id"])
    return item


def ledger_items(conn: sqlite3.Connection, family_id: str, table: str) -> list[dict[str, Any]]:
    return [
        decode_payload(row)
        for row in conn.execute(
            f"SELECT id, payload FROM {table} WHERE family_id = ? ORDER BY updated_at DESC",
            (family_id,),
        )
    ]


def ledger_payload(conn: sqlite3.Connection, family_id: str) -> dict[str, Any]:
    return {key: ledger_items(conn, family_id, table) for key, table in LEDGER_TABLES.items()}


def system_admin_to_api() -> dict[str, Any]:
    return {
        "id": SYSTEM_ADMIN_ID,
        "name": "系统管理?",
        "role": "systemAdmin",
    }


def state_payload(conn: sqlite3.Connection, family_id: str) -> dict[str, Any]:
    families = [family_to_api(row) for row in conn.execute("SELECT * FROM families WHERE id = ?", (family_id,))]
    users = [
        user_to_api(row)
        for row in conn.execute("SELECT * FROM users WHERE family_id = ? ORDER BY created_at", (family_id,))
    ]
    password_resets = [
        password_reset_to_api(row)
        for row in conn.execute(
            "SELECT * FROM password_reset_requests WHERE family_id = ? ORDER BY created_at DESC",
            (family_id,),
        )
    ]
    return {
        "families": families,
        "users": users,
        "passwordResetRequests": password_resets,
        **ledger_payload(conn, family_id),
    }


def admin_state_payload(conn: sqlite3.Connection) -> dict[str, Any]:
    families = [family_to_api(row) for row in conn.execute("SELECT * FROM families ORDER BY created_at DESC")]
    users = [
        user_to_api(row)
        for row in conn.execute("SELECT * FROM users ORDER BY family_id, created_at")
    ]
    password_resets = [
        password_reset_to_api(row)
        for row in conn.execute("SELECT * FROM password_reset_requests ORDER BY created_at DESC")
    ]
    return {"families": families, "users": users, "passwordResetRequests": password_resets}


def require_string(payload: dict[str, Any], name: str) -> str:
    value = str(payload.get(name, "")).strip()
    if not value:
        raise ApiError(HTTPStatus.BAD_REQUEST, f"Missing required field: {name}")
    return value


def id_exists(conn: sqlite3.Connection, entity_id: str) -> bool:
    family = conn.execute("SELECT 1 FROM families WHERE id = ?", (entity_id,)).fetchone()
    user = conn.execute("SELECT 1 FROM users WHERE id = ?", (entity_id,)).fetchone()
    return bool(family or user)


def unique_id(conn: sqlite3.Connection, requested: str, prefix: str) -> str:
    entity_id = normalize_custom_id(requested, prefix)
    if entity_id:
        if id_exists(conn, entity_id):
            raise ApiError(HTTPStatus.CONFLICT, "?ID 已被家庭或用户使用，请换丢个?")
        return entity_id

    for _ in range(10):
        candidate = readable_account_id(prefix)
        if not id_exists(conn, candidate):
            return candidate
    raise ApiError(HTTPStatus.CONFLICT, "自动生成 ID 失败，请重试?")


class ApiError(Exception):
    def __init__(self, status: HTTPStatus, message: str):
        self.status = status
        self.message = message
        super().__init__(message)


def allowed_origin(origin: str | None) -> str | None:
    if not origin:
        return None
    normalized = origin.rstrip("/")
    return normalized if normalized in ALLOWED_ORIGINS else None


def require_allowed_origin(headers: Any | None) -> None:
    origin = headers.get("Origin", "") if headers else ""
    if origin and not allowed_origin(origin):
        raise ApiError(HTTPStatus.FORBIDDEN, "Origin is not allowed.")


def login_rate_key(kind: str, account_id: str, client_ip: str = "") -> str:
    return f"{kind}:{client_ip}:{account_id}"


def assert_login_allowed(key: str) -> None:
    now = time.time()
    recent = [item for item in LOGIN_ATTEMPTS.get(key, []) if now - item < LOGIN_WINDOW_SECONDS]
    LOGIN_ATTEMPTS[key] = recent
    if len(recent) >= LOGIN_MAX_FAILURES:
        raise ApiError(HTTPStatus.TOO_MANY_REQUESTS, "Too many failed login attempts. Please try again later.")


def record_login_failure(key: str) -> None:
    now = time.time()
    LOGIN_ATTEMPTS[key] = [item for item in LOGIN_ATTEMPTS.get(key, []) if now - item < LOGIN_WINDOW_SECONDS] + [now]


def clear_login_failures(key: str) -> None:
    LOGIN_ATTEMPTS.pop(key, None)


def require_secure_admin_password() -> None:
    if SYSTEM_ADMIN_ID == "ADMIN_" and SYSTEM_ADMIN_PASSWORD == "ADMIN_PASSWORD":
        return
    if not PASSWORD_PATTERN.match(SYSTEM_ADMIN_PASSWORD):
        raise ApiError(HTTPStatus.FORBIDDEN, "System admin password is too weak.")


class Handler(SimpleHTTPRequestHandler):
    server_version = "FamilyLedgerBackend/0.1"

    def end_headers(self) -> None:
        origin = allowed_origin(self.headers.get("Origin", ""))
        if origin:
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Vary", "Origin")
            self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
            self.send_header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
        super().end_headers()

    def do_OPTIONS(self) -> None:
        if self.headers.get("Origin") and not allowed_origin(self.headers.get("Origin", "")):
            self.send_response(HTTPStatus.FORBIDDEN)
            self.end_headers()
            return
        self.send_response(HTTPStatus.NO_CONTENT)
        self.end_headers()

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path.startswith("/api/"):
            self.handle_api("GET", parsed.path)
            return
        self.serve_frontend(parsed.path)

    def do_POST(self) -> None:
        self.handle_api("POST", urlparse(self.path).path)

    def do_PATCH(self) -> None:
        self.handle_api("PATCH", urlparse(self.path).path)

    def do_DELETE(self) -> None:
        self.handle_api("DELETE", urlparse(self.path).path)

    def handle_api(self, method: str, path: str) -> None:
        try:
            require_allowed_origin(self.headers)
            payload = self.read_json() if method in {"POST", "PATCH"} else {}
            client_ip = self.client_address[0] if self.client_address else ""
            result = route_api(method, path, payload, self.headers, client_ip)
            self.send_json(result)
        except ApiError as exc:
            self.send_json({"message": exc.message}, exc.status)
        except Exception:
            self.send_json({"message": "Server error."}, HTTPStatus.INTERNAL_SERVER_ERROR)

    def read_json(self) -> dict[str, Any]:
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError as exc:
            raise ApiError(HTTPStatus.BAD_REQUEST, "Invalid Content-Length.") from exc
        if not length:
            return {}
        if length > MAX_JSON_BODY_BYTES:
            raise ApiError(HTTPStatus.REQUEST_ENTITY_TOO_LARGE, "Request body is too large.")
        try:
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
        except json.JSONDecodeError as exc:
            raise ApiError(HTTPStatus.BAD_REQUEST, f"Invalid JSON: {exc}") from exc
        if not isinstance(payload, dict):
            raise ApiError(HTTPStatus.BAD_REQUEST, "JSON body must be an object.")
        return payload

    def send_json(self, payload: dict[str, Any], status: HTTPStatus = HTTPStatus.OK) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def serve_frontend(self, path: str) -> None:
        relative = unquote(path.lstrip("/")) or "index.html"
        frontend_root = FRONTEND_DIR.resolve()
        target = (FRONTEND_DIR / relative).resolve()
        try:
            target.relative_to(frontend_root)
        except ValueError:
            target = FRONTEND_DIR / "index.html"
        if not target.is_file():
            target = FRONTEND_DIR / "index.html"

        content_type = mimetypes.guess_type(target.name)[0] or "application/octet-stream"
        data = target.read_bytes()
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)


def route_api(
    method: str,
    path: str,
    payload: dict[str, Any],
    headers: Any | None = None,
    client_ip: str = "",
) -> dict[str, Any]:
    if method == "GET" and path == "/api/health":
        return {"ok": True}
    if method == "GET" and path == "/api/captcha":
        return create_captcha()

    with connect() as conn:
        if method == "POST" and path == "/api/admin/login":
            return login_system_admin(conn, payload, client_ip)
        if method == "GET" and path == "/api/admin/state":
            require_system_admin(headers)
            return admin_state_payload(conn)
        if method == "DELETE" and path.startswith("/api/admin/families/"):
            family_id = path.removeprefix("/api/admin/families/")
            require_system_admin(headers)
            return admin_delete_family(conn, family_id)
        if method == "PATCH" and path.startswith("/api/admin/families/") and path.endswith("/creator"):
            family_id = path.removeprefix("/api/admin/families/").removesuffix("/creator")
            require_system_admin(headers)
            return admin_transfer_creator(conn, family_id, payload)
        if method == "PATCH" and path.startswith("/api/admin/families/"):
            family_id = path.removeprefix("/api/admin/families/")
            require_system_admin(headers)
            return admin_update_family(conn, family_id, payload)
        if method == "PATCH" and path.startswith("/api/admin/users/") and path.endswith("/password"):
            user_id = path.removeprefix("/api/admin/users/").removesuffix("/password")
            require_system_admin(headers)
            return admin_reset_user_password(conn, user_id, payload)
        if method == "PATCH" and path.startswith("/api/admin/users/"):
            user_id = path.removeprefix("/api/admin/users/")
            require_system_admin(headers)
            return admin_update_user(conn, user_id, payload)
        if method == "PATCH" and path.startswith("/api/admin/password-resets/"):
            request_id = path.removeprefix("/api/admin/password-resets/")
            require_system_admin(headers)
            return admin_update_password_reset_request(conn, request_id, payload)
        if method == "GET" and path == "/api/state":
            user = require_auth(conn, headers)
            return state_payload(conn, user["family_id"])
        if method == "POST" and path == "/api/ledger/state":
            user = require_auth(conn, headers)
            return update_ledger_state(conn, payload, user)
        if method == "POST" and path == "/api/auth/login":
            return login(conn, payload, client_ip)
        if method == "POST" and path == "/api/families":
            return create_family(conn, payload)
        if method == "POST" and path == "/api/families/join":
            return join_family(conn, payload)
        if method == "DELETE" and path.startswith("/api/families/"):
            family_id = path.removeprefix("/api/families/")
            auth_user = require_auth(conn, headers)
            return delete_family(conn, family_id, auth_user)
        if method == "POST" and path == "/api/password-resets":
            return create_password_reset_request(conn, payload)
        if method == "POST" and path == "/api/members":
            auth_user = require_manager(conn, headers)
            return create_member(conn, payload, auth_user)
        if method == "PATCH" and path.startswith("/api/password-resets/"):
            request_id = path.removeprefix("/api/password-resets/")
            auth_user = require_manager(conn, headers)
            return update_password_reset_request(conn, request_id, payload, auth_user)
        if method == "PATCH" and path.startswith("/api/members/") and path.endswith("/status"):
            user_id = path.removeprefix("/api/members/").removesuffix("/status")
            auth_user = require_manager(conn, headers)
            return update_member_status(conn, user_id, payload, auth_user)
        if method == "PATCH" and path.startswith("/api/members/") and path.endswith("/role"):
            user_id = path.removeprefix("/api/members/").removesuffix("/role")
            auth_user = require_manager(conn, headers)
            return update_member_role(conn, user_id, payload, auth_user)
        if method == "PATCH" and path.startswith("/api/members/") and path.endswith("/transfer-creator"):
            user_id = path.removeprefix("/api/members/").removesuffix("/transfer-creator")
            auth_user = require_manager(conn, headers)
            return transfer_creator(conn, user_id, auth_user)
        if method == "DELETE" and path.startswith("/api/members/"):
            user_id = path.removeprefix("/api/members/")
            auth_user = require_manager(conn, headers)
            return delete_member(conn, user_id, auth_user)

    raise ApiError(HTTPStatus.NOT_FOUND, "API route not found")


def bearer_token_claims(headers: Any | None) -> tuple[str, int]:
    auth_header = headers.get("Authorization", "") if headers else ""
    prefix = "Bearer "
    if not auth_header.startswith(prefix):
        raise ApiError(HTTPStatus.UNAUTHORIZED, "请先登录?")
    claims = token_claims(auth_header.removeprefix(prefix).strip())
    if not claims:
        raise ApiError(HTTPStatus.UNAUTHORIZED, "登录状无效，请重新登录?")
    return claims


def require_auth(conn: sqlite3.Connection, headers: Any | None) -> sqlite3.Row:
    user_id, token_version = bearer_token_claims(headers)
    row = conn.execute("SELECT * FROM users WHERE id = ? AND status = 'active'", (user_id,)).fetchone()
    if not row:
        raise ApiError(HTTPStatus.UNAUTHORIZED, "用户不存在或未启用?")
    if int(row["token_version"]) != token_version:
        raise ApiError(HTTPStatus.UNAUTHORIZED, "Invalid login session. Please log in again.")
    return row


def require_manager(conn: sqlite3.Connection, headers: Any | None) -> sqlite3.Row:
    row = require_auth(conn, headers)
    if row["role"] not in {"creator", "admin"}:
        raise ApiError(HTTPStatus.FORBIDDEN, "只有家庭创建者或管理员可以执行该操作?")
    return row


def require_system_admin(headers: Any | None) -> None:
    subject, _token_version = bearer_token_claims(headers)
    if not hmac.compare_digest(subject, system_admin_subject()):
        raise ApiError(HTTPStatus.FORBIDDEN, "只有系统管理员可以访问后台数据?")


def login(conn: sqlite3.Connection, payload: dict[str, Any], client_ip: str = "") -> dict[str, Any]:
    user_id = require_string(payload, "userId")
    password = require_string(payload, "password")
    rate_key = login_rate_key("user", user_id, client_ip)
    assert_login_allowed(rate_key)
    row = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    if not row or not verify_password(password, row["password_salt"], row["password_hash"]):
        record_login_failure(rate_key)
        raise ApiError(HTTPStatus.UNAUTHORIZED, "用户 ID 或密码不正确?")
    if row["status"] == "pending":
        raise ApiError(HTTPStatus.FORBIDDEN, "该账号仍在等待家庭创建或管理员审批，暂时无法登录?")
    if row["status"] == "rejected":
        raise ApiError(HTTPStatus.FORBIDDEN, "该加入申请已被拒绝，无法登录?")
    clear_login_failures(rate_key)
    return {"user": user_to_api(row), "token": sign_user_token(row), "state": state_payload(conn, row["family_id"])}


def login_system_admin(conn: sqlite3.Connection, payload: dict[str, Any], client_ip: str = "") -> dict[str, Any]:
    require_secure_admin_password()
    admin_id = require_string(payload, "userId")
    password = require_string(payload, "password")
    rate_key = login_rate_key("admin", admin_id, client_ip)
    assert_login_allowed(rate_key)
    if not (
        hmac.compare_digest(admin_id, SYSTEM_ADMIN_ID)
        and hmac.compare_digest(password, SYSTEM_ADMIN_PASSWORD)
    ):
        record_login_failure(rate_key)
        raise ApiError(HTTPStatus.UNAUTHORIZED, "系统管理员账号或密码不正确?")
    clear_login_failures(rate_key)
    return {
        "admin": system_admin_to_api(),
        "token": sign_system_admin_token(),
        "state": admin_state_payload(conn),
    }


def admin_update_family(conn: sqlite3.Connection, family_id: str, payload: dict[str, Any]) -> dict[str, Any]:
    family = conn.execute("SELECT * FROM families WHERE id = ?", (family_id,)).fetchone()
    if not family:
        raise ApiError(HTTPStatus.NOT_FOUND, "Family not found")
    name = require_string(payload, "name")
    conn.execute("UPDATE families SET name = ? WHERE id = ?", (name, family_id))
    conn.execute("UPDATE users SET family_name = ? WHERE family_id = ?", (name, family_id))
    return {"state": admin_state_payload(conn)}


def admin_delete_family(conn: sqlite3.Connection, family_id: str) -> dict[str, Any]:
    family = conn.execute("SELECT * FROM families WHERE id = ?", (family_id,)).fetchone()
    if not family:
        raise ApiError(HTTPStatus.NOT_FOUND, "Family not found")
    conn.execute("DELETE FROM families WHERE id = ?", (family_id,))
    return {"deletedFamilyId": family_id, "state": admin_state_payload(conn)}


def admin_update_user(conn: sqlite3.Connection, user_id: str, payload: dict[str, Any]) -> dict[str, Any]:
    target = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    if not target:
        raise ApiError(HTTPStatus.NOT_FOUND, "User not found")

    name = str(payload.get("name", target["name"])).strip()
    family_role = str(payload.get("familyRole", target["family_role"])).strip()
    role = str(payload.get("role", target["role"])).strip()
    adult_type = str(payload.get("adultType", target["adult_type"])).strip()
    status = str(payload.get("status", target["status"])).strip()

    if not name:
        raise ApiError(HTTPStatus.BAD_REQUEST, "Name is required")
    if not family_role:
        raise ApiError(HTTPStatus.BAD_REQUEST, "Family role is required")
    if status not in {"active", "pending", "rejected"}:
        raise ApiError(HTTPStatus.BAD_REQUEST, "Status must be active, pending, or rejected")
    if adult_type not in {"adult", "child"}:
        raise ApiError(HTTPStatus.BAD_REQUEST, "Adult type must be adult or child")
    if role not in {"creator", "admin", "member", "child"}:
        raise ApiError(HTTPStatus.BAD_REQUEST, "Role must be creator, admin, member, or child")
    if role == "creator" and target["role"] != "creator":
        raise ApiError(HTTPStatus.BAD_REQUEST, "请使用创建转移接口设置新的家庭创建?")
    if target["role"] == "creator" and role != "creator":
        raise ApiError(HTTPStatus.BAD_REQUEST, "请先通过创建者转移接口转让该家庭?")
    if role == "creator" and status != "active":
        raise ApiError(HTTPStatus.BAD_REQUEST, "家庭创建者必须保持启用状态?")
    if role == "creator" and adult_type != "adult":
        raise ApiError(HTTPStatus.BAD_REQUEST, "家庭创建者必须是成人账号?")
    if role == "admin" and adult_type == "child":
        raise ApiError(HTTPStatus.BAD_REQUEST, "孩子账号不能设置为管理员?")
    if role == "child" and adult_type != "child":
        raise ApiError(HTTPStatus.BAD_REQUEST, "孩子身份必须匹配孩子账号类型?")
    if adult_type == "child" and role != "child":
        raise ApiError(HTTPStatus.BAD_REQUEST, "孩子账号的系统身份必须为孩子?")
    if adult_type == "adult" and role == "child":
        raise ApiError(HTTPStatus.BAD_REQUEST, "成人账号不能设置为孩子身份?")

    conn.execute(
        """
        UPDATE users
        SET name = ?, family_role = ?, adult_type = ?, role = ?, status = ?
        WHERE id = ?
        """,
        (name, family_role, adult_type, role, status, user_id),
    )
    return {"state": admin_state_payload(conn)}


def admin_transfer_creator(conn: sqlite3.Connection, family_id: str, payload: dict[str, Any]) -> dict[str, Any]:
    creator_user_id = require_string(payload, "creatorUserId")
    family = conn.execute("SELECT * FROM families WHERE id = ?", (family_id,)).fetchone()
    if not family:
        raise ApiError(HTTPStatus.NOT_FOUND, "Family not found")
    target = conn.execute(
        "SELECT * FROM users WHERE id = ? AND family_id = ? AND status = 'active'",
        (creator_user_id, family_id),
    ).fetchone()
    if not target:
        raise ApiError(HTTPStatus.NOT_FOUND, "User not found or inactive")
    if target["adult_type"] == "child":
        raise ApiError(HTTPStatus.BAD_REQUEST, "孩子账号不能成为家庭创建者?")

    conn.execute("UPDATE users SET role = 'admin' WHERE family_id = ? AND role = 'creator'", (family_id,))
    conn.execute("UPDATE users SET role = 'creator', adult_type = 'adult', status = 'active' WHERE id = ?", (creator_user_id,))
    conn.execute("UPDATE families SET creator_user_id = ? WHERE id = ?", (creator_user_id, family_id))
    return {"state": admin_state_payload(conn)}


def admin_reset_user_password(conn: sqlite3.Connection, user_id: str, payload: dict[str, Any]) -> dict[str, Any]:
    user = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    if not user:
        raise ApiError(HTTPStatus.NOT_FOUND, "User not found")
    new_password = temporary_password()
    validate_password_strength(new_password)
    salt, digest = hash_password(new_password)
    conn.execute(
        "UPDATE users SET password_salt = ?, password_hash = ?, token_version = token_version + 1 WHERE id = ?",
        (salt, digest, user_id),
    )
    return {"newPassword": new_password, "state": admin_state_payload(conn)}


def admin_update_password_reset_request(conn: sqlite3.Connection, request_id: str, payload: dict[str, Any]) -> dict[str, Any]:
    action = payload.get("action")
    row = conn.execute("SELECT * FROM password_reset_requests WHERE id = ?", (request_id,)).fetchone()
    if not row:
        raise ApiError(HTTPStatus.NOT_FOUND, "Password reset request not found")
    if action == "reject":
        conn.execute("UPDATE password_reset_requests SET status = 'rejected' WHERE id = ?", (request_id,))
        return {"state": admin_state_payload(conn)}
    if action != "reset":
        raise ApiError(HTTPStatus.BAD_REQUEST, "Action must be reset or reject")

    new_password = temporary_password()
    validate_password_strength(new_password)
    salt, digest = hash_password(new_password)
    conn.execute(
        "UPDATE users SET password_salt = ?, password_hash = ?, token_version = token_version + 1 WHERE id = ?",
        (salt, digest, row["user_id"]),
    )
    conn.execute("UPDATE password_reset_requests SET status = 'resolved' WHERE id = ?", (request_id,))
    return {"newPassword": new_password, "state": admin_state_payload(conn)}


def create_family(conn: sqlite3.Connection, payload: dict[str, Any]) -> dict[str, Any]:
    verify_captcha(payload)
    family_name = require_string(payload, "familyName")
    name = require_string(payload, "name")
    password = require_string(payload, "password")
    validate_password_strength(password)
    family_role = require_string(payload, "familyRole")
    adult_type = "adult"

    family_id = unique_id(conn, str(payload.get("familyId", "")), "FAM")
    user_id = unique_id(conn, str(payload.get("userId", "")), "USR")
    if family_id == user_id:
        raise ApiError(HTTPStatus.CONFLICT, "家庭 ID 和用?ID 不能相同?")
    salt, digest = hash_password(password)
    conn.execute(
        "INSERT INTO families (id, name, creator_user_id) VALUES (?, ?, ?)",
        (family_id, family_name, user_id),
    )
    conn.execute(
        """
        INSERT INTO users
          (id, family_id, family_name, name, password_salt, password_hash, role, family_role, adult_type, status)
        VALUES (?, ?, ?, ?, ?, ?, 'creator', ?, ?, 'active')
        """,
        (user_id, family_id, family_name, name, salt, digest, family_role, adult_type),
    )
    user = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    return {
        "familyId": family_id,
        "userId": user_id,
        "user": user_to_api(user),
        "token": sign_user_token(user),
        "state": state_payload(conn, family_id),
    }


def payload_item_id(item: Any) -> str:
    if not isinstance(item, dict):
        raise ApiError(HTTPStatus.BAD_REQUEST, "Ledger items must be objects.")
    item_id = str(item.get("id", "")).strip()
    if not item_id or len(item_id) > 64:
        raise ApiError(HTTPStatus.BAD_REQUEST, "Ledger item id is invalid.")
    return item_id


def replace_ledger_table(conn: sqlite3.Connection, family_id: str, table: str, items: Any) -> None:
    if not isinstance(items, list):
        raise ApiError(HTTPStatus.BAD_REQUEST, "Ledger collections must be arrays.")
    if len(items) > 1000:
        raise ApiError(HTTPStatus.BAD_REQUEST, "Ledger collection is too large.")
    conn.execute(f"DELETE FROM {table} WHERE family_id = ?", (family_id,))
    for item in items:
        item_id = payload_item_id(item)
        payload_text = json.dumps(item, ensure_ascii=False, separators=(",", ":"))
        conn.execute(
            f"INSERT INTO {table} (id, family_id, payload, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)",
            (item_id, family_id, payload_text),
        )


def update_ledger_state(conn: sqlite3.Connection, payload: dict[str, Any], auth_user: sqlite3.Row) -> dict[str, Any]:
    family_id = auth_user["family_id"]
    for key, table in LEDGER_TABLES.items():
        replace_ledger_table(conn, family_id, table, payload.get(key, []))
    return {"state": state_payload(conn, family_id)}


def join_family(conn: sqlite3.Connection, payload: dict[str, Any]) -> dict[str, Any]:
    verify_captcha(payload)
    family_id = require_string(payload, "familyId")
    name = require_string(payload, "name")
    password = require_string(payload, "password")
    validate_password_strength(password)
    family_role = require_string(payload, "familyRole")
    adult_type = payload.get("adultType") if payload.get("adultType") in {"adult", "child"} else "adult"

    family = conn.execute("SELECT * FROM families WHERE id = ?", (family_id,)).fetchone()
    if not family:
        raise ApiError(HTTPStatus.NOT_FOUND, "未找到该家庭 ID。请确认创建者提供的 ID 是否正确?")

    user_id = unique_id(conn, str(payload.get("userId", "")), "USR")
    role = "child" if adult_type == "child" else "member"
    salt, digest = hash_password(password)
    conn.execute(
        """
        INSERT INTO users
          (id, family_id, family_name, name, password_salt, password_hash, role, family_role, adult_type, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
        """,
        (user_id, family["id"], family["name"], name, salt, digest, role, family_role, adult_type),
    )
    return {"familyId": family["id"], "userId": user_id}


def create_member(conn: sqlite3.Connection, payload: dict[str, Any], auth_user: sqlite3.Row) -> dict[str, Any]:
    family_id = require_string(payload, "familyId")
    name = require_string(payload, "name")
    family_role = require_string(payload, "familyRole")
    adult_type = payload.get("adultType") if payload.get("adultType") in {"adult", "child"} else "adult"
    role = "child" if adult_type == "child" else payload.get("role", "member")
    if role not in {"admin", "member", "child"}:
        role = "member"
    if role == "admin" and auth_user["role"] != "creator":
        raise ApiError(HTTPStatus.FORBIDDEN, "只有家庭创建者可以添加管理员?")

    if family_id != auth_user["family_id"]:
        raise ApiError(HTTPStatus.FORBIDDEN, "不能管理其他家庭的成员?")

    family = conn.execute("SELECT * FROM families WHERE id = ?", (family_id,)).fetchone()
    if not family:
        raise ApiError(HTTPStatus.NOT_FOUND, "Family not found")

    user_id = unique_id(conn, str(payload.get("userId", "")), "USR")
    new_password = temporary_password()
    salt, digest = hash_password(new_password)
    conn.execute(
        """
        INSERT INTO users
          (id, family_id, family_name, name, password_salt, password_hash, role, family_role, adult_type, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
        """,
        (user_id, family["id"], family["name"], name, salt, digest, role, family_role, adult_type),
    )
    return {"userId": user_id, "defaultPassword": new_password, "state": state_payload(conn, family["id"])}


def create_password_reset_request(conn: sqlite3.Connection, payload: dict[str, Any]) -> dict[str, Any]:
    user_id = require_string(payload, "userId")
    message = str(payload.get("message", "")).strip() or "我忘记了登录密码，请帮我重置?"
    public_response = {"message": "If the account exists, a password reset request has been submitted."}
    row = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    if not row:
        return public_response
    pending = conn.execute(
        """
        SELECT * FROM password_reset_requests
        WHERE user_id = ? AND family_id = ? AND status = 'pending'
        ORDER BY created_at DESC
        LIMIT 1
        """,
        (row["id"], row["family_id"]),
    ).fetchone()
    if pending:
        return public_response
    request_id = readable_id("RESET")
    conn.execute(
        """
        INSERT INTO password_reset_requests
          (id, family_id, user_id, requester_name, message, status)
        VALUES (?, ?, ?, ?, ?, 'pending')
        """,
        (request_id, row["family_id"], row["id"], row["name"], message),
    )
    return public_response


def delete_family(conn: sqlite3.Connection, family_id: str, auth_user: sqlite3.Row) -> dict[str, Any]:
    if family_id != auth_user["family_id"]:
        raise ApiError(HTTPStatus.FORBIDDEN, "不能注销其他家庭?")
    if auth_user["role"] != "creator":
        raise ApiError(HTTPStatus.FORBIDDEN, "只有家庭创建者可以注锢家庭?")

    family = conn.execute("SELECT * FROM families WHERE id = ?", (family_id,)).fetchone()
    if not family:
        raise ApiError(HTTPStatus.NOT_FOUND, "Family not found")
    if family["creator_user_id"] != auth_user["id"]:
        raise ApiError(HTTPStatus.FORBIDDEN, "只有当前家庭创建者可以注锢家庭?")

    conn.execute("DELETE FROM families WHERE id = ?", (family_id,))
    return {"deletedFamilyId": family_id}


def update_password_reset_request(
    conn: sqlite3.Connection,
    request_id: str,
    payload: dict[str, Any],
    auth_user: sqlite3.Row,
) -> dict[str, Any]:
    action = payload.get("action")
    row = conn.execute("SELECT * FROM password_reset_requests WHERE id = ?", (request_id,)).fetchone()
    if not row or row["family_id"] != auth_user["family_id"]:
        raise ApiError(HTTPStatus.NOT_FOUND, "Password reset request not found")
    if action == "reject":
        conn.execute("UPDATE password_reset_requests SET status = 'rejected' WHERE id = ?", (request_id,))
        return {"state": state_payload(conn, auth_user["family_id"])}
    if action != "reset":
        raise ApiError(HTTPStatus.BAD_REQUEST, "Action must be reset or reject")

    new_password = temporary_password()
    validate_password_strength(new_password)
    salt, digest = hash_password(new_password)
    conn.execute(
        "UPDATE users SET password_salt = ?, password_hash = ?, token_version = token_version + 1 WHERE id = ? AND family_id = ?",
        (salt, digest, row["user_id"], auth_user["family_id"]),
    )
    conn.execute("UPDATE password_reset_requests SET status = 'resolved' WHERE id = ?", (request_id,))
    return {"newPassword": new_password, "state": state_payload(conn, auth_user["family_id"])}


def update_member_status(conn: sqlite3.Connection, user_id: str, payload: dict[str, Any], auth_user: sqlite3.Row) -> dict[str, Any]:
    status = payload.get("status")
    if status not in {"active", "rejected"}:
        raise ApiError(HTTPStatus.BAD_REQUEST, "Status must be active or rejected")

    target = conn.execute(
        "SELECT * FROM users WHERE id = ? AND family_id = ? AND role != 'creator'",
        (user_id, auth_user["family_id"]),
    ).fetchone()
    if not target:
        raise ApiError(HTTPStatus.NOT_FOUND, "User not found or cannot update creator")
    if target["status"] != "pending":
        raise ApiError(HTTPStatus.BAD_REQUEST, "只有待审批的加入申请可以在这里审批或拒绝?")

    cur = conn.execute(
        "UPDATE users SET status = ? WHERE id = ? AND family_id = ? AND role != 'creator'",
        (status, user_id, auth_user["family_id"]),
    )
    if cur.rowcount == 0:
        raise ApiError(HTTPStatus.NOT_FOUND, "User not found or cannot update creator")
    return {"state": state_payload(conn, auth_user["family_id"])}


def update_member_role(conn: sqlite3.Connection, user_id: str, payload: dict[str, Any], auth_user: sqlite3.Row) -> dict[str, Any]:
    if auth_user["role"] != "creator":
        raise ApiError(HTTPStatus.FORBIDDEN, "只有家庭创建者可以任免管理员?")

    role = payload.get("role")
    if role not in {"admin", "member"}:
        raise ApiError(HTTPStatus.BAD_REQUEST, "Role must be admin or member")

    target = conn.execute(
        "SELECT * FROM users WHERE id = ? AND family_id = ? AND status = 'active'",
        (user_id, auth_user["family_id"]),
    ).fetchone()
    if not target:
        raise ApiError(HTTPStatus.NOT_FOUND, "User not found")
    if target["role"] == "creator":
        raise ApiError(HTTPStatus.FORBIDDEN, "创建者身份不能在这里调整?")
    if target["adult_type"] == "child":
        raise ApiError(HTTPStatus.FORBIDDEN, "孩子账户不能设为管理员?")

    conn.execute("UPDATE users SET role = ? WHERE id = ? AND family_id = ?", (role, user_id, auth_user["family_id"]))
    return {"state": state_payload(conn, auth_user["family_id"])}


def transfer_creator(conn: sqlite3.Connection, user_id: str, auth_user: sqlite3.Row) -> dict[str, Any]:
    if auth_user["role"] != "creator":
        raise ApiError(HTTPStatus.FORBIDDEN, "只有家庭创建者可以转让创建身份?")
    if user_id == auth_user["id"]:
        raise ApiError(HTTPStatus.BAD_REQUEST, "不能转让给自己?")

    target = conn.execute(
        "SELECT * FROM users WHERE id = ? AND family_id = ? AND status = 'active'",
        (user_id, auth_user["family_id"]),
    ).fetchone()
    if not target:
        raise ApiError(HTTPStatus.NOT_FOUND, "User not found")
    if target["adult_type"] == "child":
        raise ApiError(HTTPStatus.FORBIDDEN, "孩子账户不能成为家庭创建者?")

    conn.execute("UPDATE users SET role = 'admin' WHERE id = ? AND family_id = ?", (auth_user["id"], auth_user["family_id"]))
    conn.execute("UPDATE users SET role = 'creator' WHERE id = ? AND family_id = ?", (target["id"], auth_user["family_id"]))
    conn.execute("UPDATE families SET creator_user_id = ? WHERE id = ?", (target["id"], auth_user["family_id"]))
    return {"state": state_payload(conn, auth_user["family_id"])}


def delete_member(conn: sqlite3.Connection, user_id: str, auth_user: sqlite3.Row) -> dict[str, Any]:
    if user_id == auth_user["id"]:
        raise ApiError(HTTPStatus.FORBIDDEN, "不能移除当前登录账号?")

    target = conn.execute(
        "SELECT * FROM users WHERE id = ? AND family_id = ?",
        (user_id, auth_user["family_id"]),
    ).fetchone()
    if not target:
        raise ApiError(HTTPStatus.NOT_FOUND, "User not found")
    if target["role"] == "creator":
        raise ApiError(HTTPStatus.FORBIDDEN, "不能直接移除家庭创建者，请先转让创建者身份?")
    if auth_user["role"] != "creator" and target["role"] == "admin":
        raise ApiError(HTTPStatus.FORBIDDEN, "管理员不能移除其他管理员?")

    conn.execute("DELETE FROM users WHERE id = ? AND family_id = ?", (user_id, auth_user["family_id"]))
    return {"state": state_payload(conn, auth_user["family_id"])}


def main() -> None:
    init_db()
    port = int(os.environ.get("PORT", "8001"))
    server = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    print(f"Backend running at http://127.0.0.1:{port}")
    server.serve_forever()


if __name__ == "__main__":
    main()
