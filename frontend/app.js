const STORAGE_KEY = "family-ledger-state-v3";

const roleLabels = {
  creator: "家庭账户创建者",
  admin: "管理员",
  member: "普通成员",
  child: "孩子",
  systemAdmin: "系统管理员",
};

const statusLabels = {
  active: "已启用",
  pending: "等待审批",
  rejected: "已拒绝",
};

const resetStatusLabels = {
  pending: "待处理",
  resolved: "已处理",
  rejected: "已拒绝",
};

const rolePermissions = {
  creator: ["dashboard", "members", "transactions", "personalStats", "familyStats", "budgets", "ai", "allowance"],
  admin: ["dashboard", "members", "transactions", "personalStats", "familyStats", "budgets", "ai", "allowance"],
  member: ["dashboard", "familyDirectory", "transactions", "personalStats", "familyStats", "budgets", "ai"],
  child: ["childTransactions", "childStatement", "childTasks", "childRequests", "childSavings", "childAi"],
  systemAdmin: ["adminData"],
};

const navItems = [
  { id: "dashboard", label: "工作台" },
  { id: "members", label: "成员管理" },
  { id: "familyDirectory", label: "家庭成员" },
  { id: "transactions", label: "记录收支" },
  { id: "personalStats", label: "个人统计" },
  { id: "familyStats", label: "家庭统计" },
  { id: "budgets", label: "预算管理" },
  { id: "ai", label: "AI 分析" },
  { id: "allowance", label: "零花钱管理" },
  { id: "childTransactions", label: "记录收支" },
  { id: "childStatement", label: "查看收支" },
  { id: "childTasks", label: "任务目标" },
  { id: "childRequests", label: "发起请求" },
  { id: "childSavings", label: "储蓄目标" },
  { id: "childAi", label: "AI 分析" },
  { id: "adminData", label: "后台数据" },
];

const familyRoleOptions = [
  { value: "father", label: "父亲", memberType: "adult" },
  { value: "mother", label: "母亲", memberType: "adult" },
  { value: "grandfather", label: "爷爷/外公", memberType: "adult" },
  { value: "grandmother", label: "奶奶/外婆", memberType: "adult" },
  { value: "adultOther", label: "其他成人", memberType: "adult" },
  { value: "child", label: "孩子", memberType: "child" },
];

const categories = ["餐饮", "交通", "住宿", "教育", "医疗", "日用品", "娱乐", "人情", "投资理财", "零花钱发放", "文具"];

const transactionCategoryOptions = {
  收入: ["工资", "奖金", "兼职收入", "经营收入", "利息收入", "租金收入", "报销", "退款", "红包礼金", "其他收入"],
  支出: categories,
  转账: ["账户互转", "家庭内部调拨", "零花钱发放", "储蓄转入", "信用卡还款", "备用金调整"],
  投资: ["基金", "股票", "定投", "银行理财", "投资收益", "资产配置", "养老金账户"],
  还款: ["房贷", "车贷", "信用卡还款", "借款归还", "花呗分期", "助学贷款"],
  奖励: ["任务奖励", "学习奖励", "家务奖励", "节日奖励", "成长激励", "其他奖励"],
};

const transactionCategoryPlaceholders = {
  收入: "工资 / 奖金 / 退款",
  支出: "餐饮 / 交通 / 教育",
  转账: "账户互转 / 零花钱发放",
  投资: "基金 / 定投 / 资产配置",
  还款: "房贷 / 信用卡还款",
  奖励: "任务奖励 / 学习奖励",
};

const demoRecurringBills = [];

const defaultStatsViews = {
  personalStats: "overview",
  familyStats: "overview",
  childStatement: "overview",
};

const defaultAiSettings = {
  endpoint: "",
  promptType: "本月总结",
  publicPrompt: "你是家庭账本分析助手。只基于已提供的家庭收支、预算和孩子成长账户数据生成建议；不得输出投资、借贷、理财产品推荐；不得推断或要求账号、密码、身份证、银行卡等敏感信息；用中文输出，先给结论，再给 3 条可执行建议。",
};

const statsChartViews = [
  { id: "overview", label: "概览" },
  { id: "trend", label: "趋势" },
  { id: "structure", label: "结构" },
  { id: "category", label: "分类" },
  { id: "ranking", label: "排行" },
];

const featureCopy = {
  members: "管理家庭成员的加入、审批和权限分工，让创建者、管理员、普通成员和孩子各司其职。",
  transactions: "统一记录收入、支出、转账、还款、投资和奖励，并明确每笔账是否进入家庭统计。",
  personalStats: "汇总个人收入、支出、结余和分类结构，帮助了解自己的消费承担。",
  familyStats: "从家庭视角查看收入、支出、结余、活动开销和分类图表。",
  budgets: "围绕月度、周度、分类和活动设置预算，实时查看使用进度和风险。",
  ai: "根据本月账单和预算生成消费总结、异常提醒和复盘建议。",
  allowance: "为孩子发放零花钱、布置任务、审核奖励和处理大额消费请求。",
  childTransactions: "孩子可以记录自己的消费、收入、奖励和储蓄变动。",
  childStatement: "孩子只查看自己的收支明细、分类结构和趋势变化。",
  childTasks: "孩子接收任务、提交完成状态，并等待家长审核奖励。",
  childRequests: "孩子提交消费申请，家长批准后自动形成真实消费记录。",
  childSavings: "孩子设定储蓄目标并更新进度，家长负责查看和陪伴。",
  childAi: "用更容易理解的语言帮助孩子复盘消费习惯和储蓄目标。",
};

const demoTransactions = [];
const demoBudgets = [];
const demoChildRequests = [];
const demoTasks = [];
const demoGoals = [];
const legacyDemoIds = {
  transactions: new Set(["TX-001", "TX-002", "TX-003", "TX-004", "TX-005", "TX-006", "TX-007", "TX-008", "TX-009"]),
  budgets: new Set(["BD-001", "BD-002", "BD-003"]),
  childRequests: new Set(["REQ-001", "REQ-002"]),
  childTasks: new Set(["TASK-001", "TASK-002", "TASK-003"]),
  savingGoals: new Set(["GOAL-001"]),
  recurringBills: new Set(["RB-001"]),
};

const demoPasswordResetRequests = [];

const app = document.querySelector("#app");
const API_BASE = location.port === "8001" ? "" : "http://127.0.0.1:8001";
const SYSTEM_ADMIN_LOGIN_ID = "ADMIN_";
const localCaptchas = {};
const TEMP_PASSWORD = "Temp1234";
let state = loadState();

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  const parsed = safeParseState(saved, STORAGE_KEY);
  if (parsed) return normalizeState(parsed);

  return normalizeState({
    families: [],
    users: [],
    currentUserId: null,
    currentAdmin: null,
    authToken: null,
    activePage: "dashboard",
    authMode: "home",
    lastCreated: null,
    passwordResetRequests: demoPasswordResetRequests,
    transactions: demoTransactions,
    budgets: demoBudgets,
    childRequests: demoChildRequests,
    childTasks: demoTasks,
    savingGoals: demoGoals,
    recurringBills: demoRecurringBills,
    statsViews: defaultStatsViews,
    aiSettings: defaultAiSettings,
    aiAdvice: null,
    editingTransactionId: null,
  });
}

function safeParseState(value, key) {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn(`Invalid ${key} state removed`, error);
    localStorage.removeItem(key);
    return null;
  }
}

function removeLegacyDemoRecords(records, kind) {
  const ids = legacyDemoIds[kind];
  if (!Array.isArray(records)) return [];
  if (!ids) return records;
  return records.filter((item) => !ids.has(item.id));
}

function mergeDemoIncomeSamples(transactions) {
  const list = Array.isArray(transactions) ? transactions : [];
  return removeLegacyDemoRecords(list, "transactions");
}

function normalizeState(raw) {
  const transactions = mergeDemoIncomeSamples(raw.transactions);
  const normalized = {
    families: raw.families || [],
    users: raw.users || [],
    currentUserId: raw.currentUserId === "guest" ? null : raw.currentUserId || null,
    currentAdmin: raw.currentAdmin?.role === "systemAdmin" ? raw.currentAdmin : null,
    authToken: raw.authToken || null,
    activePage: raw.activePage || "dashboard",
    authMode: raw.authMode || raw.mode || "home",
    lastCreated: raw.lastCreated || null,
    passwordResetRequests: raw.passwordResetRequests || [],
    transactions,
    budgets: removeLegacyDemoRecords(raw.budgets, "budgets"),
    childRequests: removeLegacyDemoRecords(raw.childRequests, "childRequests"),
    childTasks: removeLegacyDemoRecords(raw.childTasks, "childTasks"),
    savingGoals: removeLegacyDemoRecords(raw.savingGoals, "savingGoals"),
    recurringBills: removeLegacyDemoRecords(raw.recurringBills, "recurringBills"),
    statsViews: { ...defaultStatsViews, ...(raw.statsViews || {}) },
    aiSettings: { ...defaultAiSettings, ...(raw.aiSettings || {}) },
    aiAdvice: raw.aiAdvice || null,
    editingTransactionId: raw.editingTransactionId || null,
  };

  if (normalized.users.length && !normalized.families.length) {
    const familyId = makeReadableId("FAM");
    const familyName = normalized.users[0].familyName || "我的家庭账本";
    normalized.families.push({ id: familyId, name: familyName, creatorUserId: normalized.users[0].id });
    normalized.users = normalized.users.map((user, index) => ({
      ...user,
      familyId,
      familyName,
      password: user.password || null,
      status: user.status || "active",
      familyRole: user.familyRole || (user.adultType === "child" ? "孩子" : "家庭成员"),
      role: user.role === "guest" ? "member" : user.role || (index === 0 ? "creator" : "member"),
    }));
  }

  normalized.users = normalized.users.filter((user) => user.role !== "guest").map((user) => ({
    ...user,
    status: user.status || "active",
    password: user.password || null,
    adultType: user.adultType || (user.role === "child" ? "child" : "adult"),
    familyRole: user.familyRole || (user.role === "child" ? "孩子" : "家庭成员"),
  }));

  if (!normalized.users.some((user) => user.id === normalized.currentUserId && user.status === "active")) {
    normalized.currentUserId = null;
  }
  if (!normalized.authToken) normalized.currentAdmin = null;
  if (normalized.currentAdmin) normalized.currentUserId = null;

  if (!["home", "login", "register-family", "join-family", "forgot-password"].includes(normalized.authMode)) {
    normalized.authMode = "home";
  }

  return normalized;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

async function apiRequest(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (state.authToken) {
    headers.Authorization = `Bearer ${state.authToken}`;
  }
  const response = await fetch(`${API_BASE}${path}`, {
    headers,
    ...options,
  });
  const contentType = response.headers.get("Content-Type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json().catch(() => ({})) : {};
  if (!response.ok) {
    const error = new Error(data.message || "请求失败，请稍后再试。");
    error.status = response.status;
    error.backendUnavailable = !isJson;
    throw error;
  }
  if (!isJson) {
    const error = new Error("Backend did not return JSON.");
    error.status = response.status;
    error.backendUnavailable = true;
    throw error;
  }
  return data;
}

function applyRemoteState(remote) {
  state.families = remote.families || [];
  state.users = remote.users || [];
  state.passwordResetRequests = remote.passwordResetRequests || [];
  if (!currentSystemAdmin() && !state.users.some((user) => user.id === state.currentUserId && user.status === "active")) {
    state.currentUserId = null;
  }
  saveState();
}

function clearLedgerData() {
  state.transactions = [];
  state.budgets = [];
  state.childRequests = [];
  state.childTasks = [];
  state.savingGoals = [];
  state.recurringBills = [];
  state.editingTransactionId = null;
}

function removeFamilyFromState(familyId) {
  state.families = (state.families || []).filter((family) => family.id !== familyId);
  state.users = (state.users || []).filter((user) => user.familyId !== familyId);
  state.passwordResetRequests = (state.passwordResetRequests || []).filter((request) => request.familyId !== familyId);
}

function isBackendUnavailable(error) {
  return error.backendUnavailable || !error.status;
}

function isAuthExpired(error) {
  return error?.status === 401;
}

function clearAuthSession() {
  state.currentUserId = null;
  state.currentAdmin = null;
  state.authToken = null;
  state.activePage = "dashboard";
  state.authMode = "login";
  saveState();
}

function makeLocalCaptcha(scope) {
  const left = Math.floor(Math.random() * 8) + 2;
  const right = Math.floor(Math.random() * 8) + 2;
  const captchaId = `LOCAL-${crypto.randomUUID().split("-")[0].toUpperCase()}`;
  localCaptchas[scope] = { captchaId, answer: String(left + right) };
  return { captchaId, question: `${left} + ${right} = ?`, local: true };
}

async function loadCaptcha(scope) {
  const question = document.querySelector(`#${scope}-captcha-question`);
  const input = document.querySelector(`#${scope}-captcha-answer`);
  const id = document.querySelector(`#${scope}-captcha-id`);
  if (!question || !input || !id) return;
  question.textContent = "正在生成验证码...";
  input.value = "";
  try {
    const result = await apiRequest("/api/captcha");
    id.value = result.captchaId;
    question.textContent = result.question;
    delete localCaptchas[scope];
  } catch (error) {
    if (!isBackendUnavailable(error)) {
      question.textContent = "验证码生成失败，请刷新重试";
      return;
    }
    const fallback = makeLocalCaptcha(scope);
    id.value = fallback.captchaId;
    question.textContent = fallback.question;
  }
}

function captchaPayload(scope) {
  return {
    captchaId: document.querySelector(`#${scope}-captcha-id`)?.value.trim() || "",
    captchaAnswer: document.querySelector(`#${scope}-captcha-answer`)?.value.trim() || "",
  };
}

function verifyLocalCaptcha(scope, error) {
  const local = localCaptchas[scope];
  if (!local) return true;
  const answer = captchaPayload(scope).captchaAnswer;
  if (!answer) {
    error.textContent = "请先完成验证码。";
    return false;
  }
  if (answer !== local.answer) {
    error.textContent = "验证码不正确，请重新输入。";
    loadCaptcha(scope);
    return false;
  }
  delete localCaptchas[scope];
  return true;
}

async function syncBackendState() {
  if (!state.authToken) return;
  try {
    const remote = await apiRequest(currentSystemAdmin() ? "/api/admin/state" : "/api/state");
    applyRemoteState(remote);
    render();
  } catch (error) {
    if (isAuthExpired(error)) {
      clearAuthSession();
      render();
      return;
    }
    console.warn("Backend is not available, using local prototype state.", error);
  }
}

function makeReadableId(prefix) {
  if (["FAM", "USR"].includes(prefix)) {
    return `${prefix.slice(0, 1)}${crypto.randomUUID().replaceAll("-", "").slice(0, 8)}`;
  }
  return `${prefix}-${crypto.randomUUID().split("-")[0].toUpperCase()}`;
}

function currentUser() {
  return state.users.find((user) => user.id === state.currentUserId && user.status === "active");
}

function currentSystemAdmin() {
  return state.authToken && state.currentAdmin?.role === "systemAdmin" ? state.currentAdmin : null;
}

function currentFamily() {
  const user = currentUser();
  return user ? state.families.find((family) => family.id === user.familyId) : null;
}

function can(page) {
  const admin = currentSystemAdmin();
  if (admin) return (rolePermissions.systemAdmin || []).includes(page);
  const user = currentUser();
  return !!user && (rolePermissions[user.role] || []).includes(page);
}

function defaultPageForRole(role) {
  if (role === "systemAdmin") return "adminData";
  return role === "child" ? "childTransactions" : "dashboard";
}

function isManagerRole(user = currentUser()) {
  return ["creator", "admin"].includes(user?.role);
}

function isCreatorRole(user = currentUser()) {
  return user?.role === "creator";
}

function setPage(page) {
  state.activePage = can(page) ? page : defaultPageForRole(currentSystemAdmin()?.role || currentUser()?.role);
  saveState();
  render();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function money(value) {
  return `¥${Number(value || 0).toLocaleString("zh-CN", { maximumFractionDigits: 2 })}`;
}

function familyRoleLabel(value) {
  return familyRoleOptions.find((option) => option.value === value)?.label || value || "家庭成员";
}

function roleSelectOptions() {
  return familyRoleOptions.map((option) => `<option value="${option.value}">${option.label}</option>`).join("");
}

function memberTypeFromFamilyRole(value) {
  return familyRoleOptions.find((option) => option.value === value)?.memberType || "adult";
}

function cleanCustomId(value) {
  return value.trim();
}

function isValidCustomId(value) {
  return /^[A-Za-z0-9]{1,10}$/.test(value);
}

function localIdExists(value) {
  const id = cleanCustomId(value);
  return state.families.some((family) => family.id === id) ||
    state.users.some((user) => user.id === id);
}

function validateOptionalCustomId(value, error, label) {
  const id = cleanCustomId(value);
  if (!id) return "";
  if (!isValidCustomId(id)) {
    error.textContent = `${label} 只能包含字母和数字，长度不能超过 10 位，并且区分大小写。`;
    return null;
  }
  if (localIdExists(id)) {
    error.textContent = `${label} 已被家庭或用户使用，请换一个。`;
    return null;
  }
  return id;
}

function isStrongPassword(password) {
  return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
}

function validatePassword(password, confirm, error) {
  if (!isStrongPassword(password)) {
    error.textContent = "密码至少 8 位，并且需要同时包含字母和数字。";
    return false;
  }
  if (password !== confirm) {
    error.textContent = "两次输入的密码不一致。";
    return false;
  }
  return true;
}

function selectedAttr(value, selectedValue) {
  return value === selectedValue ? " selected" : "";
}

function getFamilyUsers() {
  const user = currentUser();
  return user ? state.users.filter((candidate) => candidate.familyId === user.familyId) : [];
}

function getActiveFamilyUsers() {
  return getFamilyUsers().filter((user) => user.status === "active");
}

function getFamilyTransactions() {
  return state.transactions;
}

function getPersonalTransactions(user) {
  return state.transactions.filter((tx) => tx.ownerId === user.id || tx.owner === user.name);
}

function isExpense(tx) {
  return ["支出", "还款"].includes(tx.type);
}

function isIncome(tx) {
  return ["收入", "奖励"].includes(tx.type);
}

function familyCountedTransactions() {
  return getFamilyTransactions().filter((tx) => tx.countFamily);
}

function sumTransactions(transactions, predicate = () => true) {
  return transactions.filter(predicate).reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
}

function groupSum(transactions, field) {
  return transactions.reduce((result, tx) => {
    const key = tx[field] || "未分类";
    result[key] = (result[key] || 0) + Number(tx.amount || 0);
    return result;
  }, {});
}

function topGroups(transactions, field, limit = 5) {
  return Object.entries(groupSum(transactions, field))
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

function categoryOptionsForType(type) {
  return transactionCategoryOptions[type] || categories;
}

function categoryPlaceholderForType(type) {
  return transactionCategoryPlaceholders[type] || "餐饮 / 交通 / 教育";
}

function renderCategoryOptions(type) {
  return categoryOptionsForType(type)
    .map((item) => `<option value="${escapeHtml(item)}"></option>`)
    .join("");
}

function displayCycle(cycle) {
  if (cycle === "外循环") return "真实消费";
  if (cycle === "内循环") return "个人/资产变动";
  return cycle || "未设置";
}

function activitySuggestions() {
  const values = [
    ...state.transactions.map((tx) => tx.event),
    ...state.budgets.filter((budget) => budget.type === "活动").flatMap((budget) => [budget.name, budget.category]),
    ...state.recurringBills.flatMap((bill) => [bill.name, bill.event]),
    "日常",
  ];
  return [...new Set(values.map((value) => String(value || "").trim()).filter(Boolean))].slice(0, 14);
}

function currentBudgetPeriod(type, dateValue = new Date()) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "当前周期";
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  if (type === "周度") {
    const firstDay = new Date(year, 0, 1);
    const days = Math.floor((date - firstDay) / 86400000);
    const week = Math.ceil((days + firstDay.getDay() + 1) / 7);
    return `${year}-W${`${week}`.padStart(2, "0")}`;
  }
  return `${year}-${month}`;
}

function transactionPeriod(tx, type) {
  if (!tx.date) return "";
  if (type === "周度") return currentBudgetPeriod("周度", tx.date);
  return String(tx.date).slice(0, 7);
}

function budgetMatchesTransaction(budget, tx) {
  if (!tx.countFamily || !isExpense(tx)) return false;
  if (budget.type === "活动") {
    return [tx.event, tx.tag, tx.category].includes(budget.name) || tx.event === budget.category;
  }
  const categoryMatches = !budget.category || tx.category === budget.category;
  if (!categoryMatches) return false;
  if (["月度", "分类"].includes(budget.type)) return transactionPeriod(tx, "月度") === budget.period;
  if (budget.type === "周度") return transactionPeriod(tx, "周度") === budget.period;
  return true;
}

function budgetUsage(budget) {
  const matched = familyCountedTransactions().filter((tx) => budgetMatchesTransaction(budget, tx));
  const used = matched.length ? sumTransactions(matched) : Number(budget.used || 0);
  const total = Math.max(1, Number(budget.total || 0));
  const percent = Math.min(999, Math.round((used / total) * 100));
  return {
    used,
    total,
    matchedCount: matched.length,
    percent,
    remaining: Number(budget.total || 0) - used,
    status: percent >= 100 ? "已超支" : percent >= 80 ? "接近上限" : "正常",
  };
}

function monthKey(dateValue) {
  return String(dateValue || "").slice(0, 7) || "未知月份";
}

function dayKey(dateValue) {
  return String(dateValue || "").slice(5, 10) || "未知日期";
}

function flowRows(transactions, field, limit = 8) {
  const grouped = transactions.reduce((result, tx) => {
    const key = tx[field] || "未分类";
    if (!result[key]) result[key] = { name: key, income: 0, expense: 0 };
    if (isIncome(tx)) result[key].income += Number(tx.amount || 0);
    if (isExpense(tx)) result[key].expense += Number(tx.amount || 0);
    return result;
  }, {});
  return Object.values(grouped)
    .map((row) => ({ ...row, balance: row.income - row.expense, total: row.income + row.expense }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}

function periodRows(transactions, limit = 8) {
  return flowRows(
    transactions.map((tx) => ({ ...tx, periodLabel: tx.date ? monthKey(tx.date) : "未知月份" })),
    "periodLabel",
    limit,
  ).sort((a, b) => a.name.localeCompare(b.name));
}

function statsView() {
  const key = state.activePage || "personalStats";
  return state.statsViews?.[key] || defaultStatsViews[key] || "overview";
}

function statsSummary(transactions) {
  const income = sumTransactions(transactions, isIncome);
  const expense = sumTransactions(transactions, isExpense);
  const balance = income - expense;
  const savingsRate = income > 0 ? Math.round((balance / income) * 100) : 0;
  const avgExpense = transactions.length ? Math.round(expense / Math.max(1, transactions.filter(isExpense).length)) : 0;
  return { income, expense, balance, savingsRate, avgExpense };
}

function trendBadge(current, previous, lowerIsBetter = false) {
  if (!previous) return `<em class="trend neutral">新数据</em>`;
  const change = Math.round(((current - previous) / previous) * 100);
  const good = lowerIsBetter ? change <= 0 : change >= 0;
  const label = `${change >= 0 ? "+" : ""}${change}%`;
  return `<em class="trend ${good ? "good" : "bad"}">${label}</em>`;
}

function compareTrend(transactions, predicate, lowerIsBetter = false) {
  const currentMonth = currentBudgetPeriod("月度");
  const current = sumTransactions(transactions.filter((tx) => monthKey(tx.date) === currentMonth), predicate);
  const previousDate = new Date();
  previousDate.setMonth(previousDate.getMonth() - 1);
  const previous = sumTransactions(transactions.filter((tx) => monthKey(tx.date) === currentBudgetPeriod("月度", previousDate)), predicate);
  return trendBadge(current, previous, lowerIsBetter);
}

function statsSummaryCard(label, value, note, trend = "") {
  return `
    <div class="stats-summary-card">
      <span>${label}</span>
      <div><strong>${value}</strong>${trend}</div>
      <small>${note}</small>
    </div>
  `;
}

function statsControls(view) {
  return `
    <div class="stats-controls">
      <div class="segmented">
        ${statsChartViews.map((item) => `<button class="${item.id === view ? "active" : ""}" data-stats-view="${item.id}" type="button">${item.label}</button>`).join("")}
      </div>
      <span class="hint">统计同时观察收入、支出、结余和预算压力。</span>
    </div>
  `;
}

function statsInsights(transactions) {
  const { income, expense, balance, savingsRate } = statsSummary(transactions);
  const expenseTx = transactions.filter(isExpense);
  const topCategory = topGroups(expenseTx, "category", 1)[0];
  const largest = [...expenseTx].sort((a, b) => Number(b.amount || 0) - Number(a.amount || 0))[0];
  const riskyBudgets = state.budgets.filter((budget) => budgetUsage(budget).percent >= 80);
  const insights = [];
  if (balance < 0) insights.push(`本期结余为 ${money(balance)}，支出已经高于收入，需要优先复盘非必要支出。`);
  if (income > 0 && savingsRate < 10) insights.push(`储蓄率为 ${savingsRate}%，建议先把固定储蓄或备用金列入月初安排。`);
  if (topCategory && expense > 0 && topCategory[1] / expense > 0.45) insights.push(`「${topCategory[0]}」占支出 ${Math.round((topCategory[1] / expense) * 100)}%，分类较集中。`);
  if (largest) insights.push(`最大单笔支出是「${largest.category}」${money(largest.amount)}，来自 ${largest.event || "日常"}。`);
  if (riskyBudgets.length) insights.push(`${riskyBudgets.length} 项预算已接近或超过上限，优先检查 ${riskyBudgets.slice(0, 2).map((budget) => budget.name).join("、")}。`);
  if (!insights.length) insights.push("当前收支结构比较平稳，可以继续保持按活动和分类记录。");
  return `
    <div class="stats-insight-panel">
      <div><strong>自动洞察</strong><span>${transactions.length} 笔记录</span></div>
      <ul>${insights.slice(0, 5).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </div>
  `;
}

function emptyChart(message = "暂无可统计数据") {
  return `<p class="hint">${message}</p>`;
}

function verticalChart(groups) {
  if (!groups.length) return emptyChart();
  const max = Math.max(...groups.map(([, value]) => value), 1);
  return `
    <div class="vertical-chart">
      ${groups.map(([name, value]) => `
        <div class="vertical-bar">
          <div class="vertical-track"><span style="height: ${Math.max(4, Math.round((value / max) * 100))}%"></span></div>
          <strong>${money(value)}</strong>
          <em>${escapeHtml(name)}</em>
        </div>
      `).join("")}
    </div>
  `;
}

function lineChart(rows) {
  if (!rows.length) return emptyChart();
  const values = rows.map((row) => row.balance);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 1);
  const width = 640;
  const height = 210;
  const pad = 22;
  const span = Math.max(1, max - min);
  const points = rows.map((row, index) => {
    const x = rows.length === 1 ? width / 2 : pad + (index * (width - pad * 2)) / (rows.length - 1);
    const y = height - pad - ((row.balance - min) / span) * (height - pad * 2);
    return { x, y, row };
  });
  const path = points.map((point, index) => `${index ? "L" : "M"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
  const area = `${path} L ${points.at(-1).x.toFixed(1)} ${height - pad} L ${points[0].x.toFixed(1)} ${height - pad} Z`;
  const zeroY = height - pad - ((0 - min) / span) * (height - pad * 2);
  return `
    <div class="line-chart-wrap">
      <svg class="line-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="结余趋势图">
        <path class="line-area" d="${area}"></path>
        <line class="line-zero" x1="${pad}" y1="${zeroY}" x2="${width - pad}" y2="${zeroY}"></line>
        <path class="line-path" d="${path}"></path>
        ${points.map((point) => `<circle class="line-dot" cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="4"></circle>`).join("")}
      </svg>
      <div class="line-chart-labels"><span>${escapeHtml(rows[0].name)}</span><strong>${money(rows.at(-1).balance)}</strong><span>${escapeHtml(rows.at(-1).name)}</span></div>
    </div>
  `;
}

function stackedFlowChart(rows) {
  if (!rows.length) return emptyChart();
  const max = Math.max(...rows.map((row) => row.income + row.expense), 1);
  return `
    <div class="stacked-flow-chart">
      ${rows.map((row) => {
        const incomeWidth = Math.round((row.income / max) * 100);
        const expenseWidth = Math.round((row.expense / max) * 100);
        return `
          <div class="stacked-row">
            <span>${escapeHtml(row.name)}</span>
            <div class="stacked-track">
              <i class="stacked-income" style="width:${incomeWidth}%"></i>
              <i class="stacked-expense" style="width:${expenseWidth}%"></i>
            </div>
            <strong>${money(row.income - row.expense)}</strong>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function treemapChart(groups) {
  if (!groups.length) return emptyChart();
  const total = Math.max(1, groups.reduce((sum, [, value]) => sum + value, 0));
  return `
    <div class="treemap-chart">
      ${groups.map(([name, value], index) => `
        <div class="treemap-cell treemap-tone-${index % 6}" style="flex:${Math.max(0.28, value / total)} 1 ${Math.max(120, Math.round((value / total) * 520))}px">
          <strong>${escapeHtml(name)}</strong>
          <span>${money(value)} / ${Math.round((value / total) * 100)}%</span>
        </div>
      `).join("")}
    </div>
  `;
}

function donutChart(groups, centerLabel) {
  if (!groups.length) return emptyChart();
  const total = Math.max(1, groups.reduce((sum, [, value]) => sum + value, 0));
  let start = 0;
  const colors = ["var(--primary)", "var(--accent)", "var(--blue)", "var(--warning)", "var(--primary-dark)", "var(--muted)"];
  const stops = groups.map(([, value], index) => {
    const end = start + (value / total) * 100;
    const segment = `${colors[index % colors.length]} ${start.toFixed(2)}% ${end.toFixed(2)}%`;
    start = end;
    return segment;
  }).join(", ");
  return `
    <div class="donut-layout">
      <div class="donut" style="background: conic-gradient(${stops})"><span>${escapeHtml(centerLabel)}</span></div>
      <div class="donut-legend">
        ${groups.map(([name, value], index) => `<div><i style="background:${colors[index % colors.length]}"></i><span>${escapeHtml(name)}</span><strong>${money(value)}</strong></div>`).join("")}
      </div>
    </div>
  `;
}

function flowChart(rows) {
  if (!rows.length) return emptyChart();
  const max = Math.max(...rows.map((row) => Math.max(row.income, row.expense)), 1);
  return `
    <div class="flow-chart">
      ${rows.map((row) => `
        <div class="flow-row">
          <div class="flow-name">
            <strong>${escapeHtml(row.name)}</strong>
            <span class="${row.balance >= 0 ? "positive" : "negative"}">结余 ${money(row.balance)}</span>
          </div>
          <div class="flow-bars">
            <div class="flow-line income"><span style="width:${Math.round((row.income / max) * 100)}%"></span></div>
            <div class="flow-line expense"><span style="width:${Math.round((row.expense / max) * 100)}%"></span></div>
          </div>
          <div class="flow-values">
            <span>收入 ${money(row.income)}</span>
            <span>支出 ${money(row.expense)}</span>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function cashflowOverviewChart(summary) {
  const rows = [
    { name: "收入", value: summary.income, tone: "income" },
    { name: "支出", value: summary.expense, tone: "expense" },
    { name: "结余", value: summary.balance, tone: summary.balance >= 0 ? "income" : "expense" },
  ];
  const max = Math.max(...rows.map((row) => Math.abs(row.value)), 1);
  const savingsRate = Math.max(-100, Math.min(100, summary.savingsRate));
  return `
    <div class="cashflow-overview">
      <div class="cashflow-bars">
        ${rows.map((row) => `
          <div class="cashflow-row">
            <div class="cashflow-label">
              <strong>${row.name}</strong>
              <span>${money(row.value)}</span>
            </div>
            <div class="cashflow-track">
              <span class="${row.tone}" style="width:${Math.max(4, Math.round((Math.abs(row.value) / max) * 100))}%"></span>
            </div>
          </div>
        `).join("")}
      </div>
      <div class="cashflow-gauge">
        <strong>${summary.savingsRate}%</strong>
        <span>储蓄率</span>
        <div><i style="width:${Math.max(0, savingsRate)}%"></i></div>
      </div>
    </div>
  `;
}

function categoryComparisonChart(rows) {
  if (!rows.length) return emptyChart();
  const max = Math.max(...rows.map((row) => Math.max(row.income, row.expense, Math.abs(row.balance))), 1);
  return `
    <div class="category-compare-chart">
      ${rows.map((row) => `
        <div class="category-compare-row">
          <div class="category-compare-name">
            <strong>${escapeHtml(row.name)}</strong>
            <span class="${row.balance >= 0 ? "positive" : "negative"}">结余 ${money(row.balance)}</span>
          </div>
          <div class="category-compare-bars">
            <div class="category-compare-line">
              <span>收入</span>
              <div><i class="income" style="width:${Math.round((row.income / max) * 100)}%"></i></div>
              <strong>${money(row.income)}</strong>
            </div>
            <div class="category-compare-line">
              <span>支出</span>
              <div><i class="expense" style="width:${Math.round((row.expense / max) * 100)}%"></i></div>
              <strong>${money(row.expense)}</strong>
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function render() {
  const admin = currentSystemAdmin();
  if (admin) {
    renderShell(admin);
    return;
  }
  const user = currentUser();
  if (!user) {
    renderAuth();
    return;
  }
  renderShell(user);
}

function renderAuth() {
  app.innerHTML = `
    <main class="auth-page">
      <div class="auth-layout">
        <section class="auth-hero">
          <div class="auth-hero-content">
            <div class="brand-mark">
              <span class="brand-symbol">¥</span>
              <span>家庭记账管理系统</span>
            </div>
            <span class="eyebrow">Family Ledger OS</span>
            <h1>从家庭身份开始管理每一笔钱</h1>
            <p>一个面向家庭协作的记账系统，把收支记录、成员权限、预算管理和孩子财商练习放在同一套清晰流程里。</p>
            <div class="hero-points">
              <span>家庭协作</span>
              <span>预算管理</span>
              <span>成长账户</span>
            </div>
          </div>
          <div class="ledger-preview" aria-label="系统介绍">
            <div class="preview-header">
              <span>系统能力</span>
              <strong>家庭账本工作台</strong>
            </div>
            <div class="preview-list">
              <div class="preview-line">
                <span>协作</span>
                <strong>按家庭身份分配操作权限</strong>
                <em>不同成员看到适合自己的功能入口</em>
              </div>
              <div class="preview-line">
                <span>记账</span>
                <strong>区分真实收支与内部流转</strong>
                <em>帮助家庭统计更清楚、更少重复</em>
              </div>
              <div class="preview-line">
                <span>成长</span>
                <strong>为孩子保留独立的练习空间</strong>
                <em>记录消费、奖励和储蓄目标</em>
              </div>
            </div>
            <div class="preview-pills">
              <span>多人共同维护</span>
              <span>统计口径清晰</span>
            </div>
            <p>从第一笔记录到每月复盘，家庭成员可以用同一套口径理解收入、支出、预算和储蓄变化。</p>
          </div>
        </section>
        <section class="auth-main">
          <div class="auth-panel">
            ${renderAuthTabs()}
            <div id="auth-form"></div>
          </div>
        </section>
      </div>
      <section class="auth-poster-section" aria-label="系统功能说明和使用教程">
        <img class="auth-guide-poster" src="./assets/system-guide-poster.png" alt="家庭记账管理系统功能说明和使用教程海报" />
      </section>
    </main>
  `;

  document.querySelectorAll("[data-auth-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.authMode = button.dataset.authMode;
      state.lastCreated = null;
      saveState();
      renderAuth();
    });
  });

  if (state.authMode === "login") renderLoginForm();
  if (state.authMode === "register-family") renderRegisterFamilyForm();
  if (state.authMode === "join-family") renderJoinFamilyForm();
  if (state.authMode === "forgot-password") renderForgotPasswordForm();
  if (state.authMode === "home") renderAuthHome();
}

function renderAuthTabs() {
  if (state.authMode === "home") {
    return `
      <div class="auth-actions">
        <button class="btn primary auth-choice" data-auth-mode="register-family"><span>注册</span><small>创建或加入家庭</small></button>
        <button class="btn auth-choice" data-auth-mode="login"><span>登录</span><small>使用用户 ID 进入</small></button>
      </div>
    `;
  }

  if (state.authMode === "register-family" || state.authMode === "join-family") {
    return `
      <div class="tabs">
        <button class="${state.authMode === "register-family" ? "active" : ""}" data-auth-mode="register-family">注册家庭</button>
        <button class="${state.authMode === "join-family" ? "active" : ""}" data-auth-mode="join-family">加入家庭</button>
      </div>
      <button class="btn subtle auth-back" data-auth-mode="home" type="button">返回入口</button>
    `;
  }

  return `
    <div class="auth-actions">
      <button class="btn subtle" data-auth-mode="home" type="button">返回入口</button>
      <button class="btn primary" data-auth-mode="register-family" type="button">去注册</button>
    </div>
  `;
}

function renderAuthHome() {
  document.querySelector("#auth-form").innerHTML = `
    <div class="auth-panel-heading">
      <span class="eyebrow">Account Gateway</span>
      <h2>选择你的入口</h2>
      <p>创建家庭后会获得家庭 ID；加入已有家庭的账号需要通过审批后才能登录。</p>
    </div>
    <div class="auth-feature-list">
      <button class="auth-feature-card" data-auth-mode="register-family" type="button">
        <div class="feature-title">注册家庭</div>
        <p class="feature-desc">创建一个新的家庭账户，系统生成家庭 ID 和创建者用户 ID。创建者拥有最高权限。</p>
      </button>
      <button class="auth-feature-card" data-auth-mode="join-family" type="button">
        <div class="feature-title">加入家庭</div>
        <p class="feature-desc">输入家庭 ID 发起加入申请。申请通过前账号不可登录，避免未授权成员进入家庭账本。</p>
      </button>
      <button class="auth-feature-card" data-auth-mode="login" type="button">
        <div class="feature-title">登录系统</div>
        <p class="feature-desc">使用自定义或系统生成的用户 ID 和密码登录。不同身份进入后会看到不同的功能操作。</p>
      </button>
      <button class="auth-feature-card" data-auth-mode="forgot-password" type="button">
        <div class="feature-title">找回密码</div>
        <p class="feature-desc">忘记密码时向家庭创建者或管理员发送找回请求，由其完成重置。</p>
      </button>
    </div>
  `;

  document.querySelectorAll("#auth-form [data-auth-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.authMode = button.dataset.authMode;
      state.lastCreated = null;
      saveState();
      renderAuth();
    });
  });
}

function renderLoginForm() {
  document.querySelector("#auth-form").innerHTML = `
    <form class="form" id="login-form">
      <div class="field">
        <label for="login-id">用户 ID</label>
        <input id="login-id" placeholder="例如：Mom01" autocomplete="username" required />
      </div>
      <div class="field">
        <label for="login-password">密码</label>
        <input id="login-password" type="password" autocomplete="current-password" required />
      </div>
      <div class="hint">加入家庭的账号会先进入待审批状态，创建者或管理员通过后才能登录。</div>
      <div class="error" id="auth-error"></div>
      <button class="btn primary" type="submit">登录</button>
      <button class="btn subtle" data-auth-mode="forgot-password" type="button">忘记密码</button>
    </form>
  `;

  document.querySelector("#login-form [data-auth-mode]").addEventListener("click", () => {
    state.authMode = "forgot-password";
    saveState();
    renderAuth();
  });

  document.querySelector("#login-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const id = document.querySelector("#login-id").value.trim();
    const password = document.querySelector("#login-password").value;
    const error = document.querySelector("#auth-error");

    try {
      const isSystemAdminLogin = id === SYSTEM_ADMIN_LOGIN_ID;
      const result = await apiRequest(isSystemAdminLogin ? "/api/admin/login" : "/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ userId: id, password }),
      });
      state.authToken = result.token;
      state.currentAdmin = isSystemAdminLogin ? result.admin : null;
      applyRemoteState(result.state);
      state.currentUserId = isSystemAdminLogin ? null : result.user.id;
      state.activePage = defaultPageForRole(isSystemAdminLogin ? result.admin.role : result.user.role);
      state.lastCreated = null;
      saveState();
      render();
      return;
    } catch (apiError) {
      if (!isBackendUnavailable(apiError)) {
        if (id !== SYSTEM_ADMIN_LOGIN_ID && apiError.status === 401) {
          try {
            const adminResult = await apiRequest("/api/admin/login", {
              method: "POST",
              body: JSON.stringify({ userId: id, password }),
            });
            state.authToken = adminResult.token;
            state.currentAdmin = adminResult.admin;
            applyRemoteState(adminResult.state);
            state.currentUserId = null;
            state.activePage = defaultPageForRole(adminResult.admin.role);
            state.lastCreated = null;
            saveState();
            render();
            return;
          } catch (adminError) {
            if (isBackendUnavailable(adminError)) {
              error.textContent = "系统管理员登录需要后端服务运行。";
              return;
            }
          }
        }
        state.authToken = null;
        state.currentAdmin = null;
        error.textContent = apiError.message;
        return;
      }
      if (id === SYSTEM_ADMIN_LOGIN_ID) {
        state.authToken = null;
        state.currentAdmin = null;
        error.textContent = "系统管理员登录需要后端服务运行。";
        return;
      }
    }

    const user = state.users.find((candidate) => candidate.id === id);

    if (!user || user.password !== password) {
      error.textContent = "用户 ID 或密码不正确。";
      return;
    }
    if (user.status === "pending") {
      error.textContent = "该账号仍在等待家庭创建者或管理员审批，暂时无法登录。";
      return;
    }
    if (user.status === "rejected") {
      error.textContent = "该加入申请已被拒绝，无法登录。";
      return;
    }

    state.currentUserId = user.id;
    state.activePage = defaultPageForRole(user.role);
    saveState();
    render();
  });
}

function renderRegisterFamilyForm() {
  document.querySelector("#auth-form").innerHTML = `
    ${renderCreatedNotice()}
    <form class="form" id="register-family-form">
      <div class="field">
        <label for="family-name">家庭名</label>
        <input id="family-name" placeholder="例如：王小明的家庭账本" required />
      </div>
      <div class="form-row">
        <div class="field">
          <label for="custom-family-id">自定义家庭 ID</label>
          <input id="custom-family-id" maxlength="10" placeholder="例如：Home01" />
        </div>
        <div class="field">
          <label for="custom-creator-id">自定义用户 ID</label>
          <input id="custom-creator-id" maxlength="10" placeholder="例如：Mom01" />
        </div>
      </div>
      <div class="form-row">
        <div class="field">
          <label for="creator-name">创建者昵称</label>
          <input id="creator-name" placeholder="例如：妈妈" required />
        </div>
        <div class="field">
          <label for="creator-family-role">在家庭中的角色</label>
          <select id="creator-family-role">${roleSelectOptions()}</select>
        </div>
      </div>
      <div class="form-row">
        <div class="field">
          <label for="creator-password">密码</label>
          <input id="creator-password" type="password" minlength="8" required />
        </div>
        <div class="field">
          <label for="creator-password-confirm">确认密码</label>
          <input id="creator-password-confirm" type="password" minlength="8" required />
        </div>
      </div>
      <div class="field">
        <label for="register-captcha-answer">验证码</label>
        <div class="captcha-line">
          <code id="register-captcha-question">正在生成验证码...</code>
          <button class="btn subtle" id="register-captcha-refresh" type="button">换一题</button>
        </div>
        <input id="register-captcha-answer" placeholder="请输入计算结果" inputmode="numeric" required />
        <input id="register-captcha-id" type="hidden" />
      </div>
      <div class="hint">ID 区分大小写，仅支持 10 位以内字母和数字。密码至少 8 位，并同时包含字母和数字。创建成功后会自动进入家庭账本。</div>
      <div class="error" id="auth-error"></div>
      <button class="btn primary" type="submit">创建家庭账户</button>
    </form>
  `;

  loadCaptcha("register");
  document.querySelector("#register-captcha-refresh").addEventListener("click", () => loadCaptcha("register"));

  document.querySelector("#register-family-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const familyName = document.querySelector("#family-name").value.trim();
    const name = document.querySelector("#creator-name").value.trim();
    const familyRole = document.querySelector("#creator-family-role").value;
    const customFamilyId = document.querySelector("#custom-family-id").value;
    const customUserId = document.querySelector("#custom-creator-id").value;
    const password = document.querySelector("#creator-password").value;
    const confirm = document.querySelector("#creator-password-confirm").value;
    const error = document.querySelector("#auth-error");

    if (!familyName || !name) {
      error.textContent = "请填写家庭名和创建者昵称。";
      return;
    }
    if (!validatePassword(password, confirm, error)) return;
    const familyIdInput = validateOptionalCustomId(customFamilyId, error, "家庭 ID");
    if (familyIdInput === null) return;
    const userIdInput = validateOptionalCustomId(customUserId, error, "用户 ID");
    if (userIdInput === null) return;
    if (familyIdInput && userIdInput && familyIdInput === userIdInput) {
      error.textContent = "家庭 ID 和用户 ID 不能相同。";
      return;
    }
    const registerCaptcha = captchaPayload("register");
    if (!registerCaptcha.captchaId || !registerCaptcha.captchaAnswer) {
      error.textContent = "请先完成验证码。";
      return;
    }

    try {
      const result = await apiRequest("/api/families", {
        method: "POST",
        body: JSON.stringify({
          ...registerCaptcha,
          familyId: familyIdInput,
          userId: userIdInput,
          familyName,
          name,
          password,
          familyRole: familyRoleLabel(familyRole),
          adultType: memberTypeFromFamilyRole(familyRole),
        }),
      });
      if (result.state) applyRemoteState(result.state);
      clearLedgerData();
      state.authToken = result.token;
      state.currentUserId = result.user?.id || result.userId;
      state.activePage = defaultPageForRole(result.user?.role || "creator");
      state.lastCreated = { type: "family", familyId: result.familyId, userId: result.userId };
      saveState();
      render();
      return;
    } catch (apiError) {
      if (!isBackendUnavailable(apiError)) {
        error.textContent = apiError.message;
        loadCaptcha("register");
        return;
      }
    }
    if (!localCaptchas.register || !verifyLocalCaptcha("register", error)) return;

    const familyId = familyIdInput || makeReadableId("FAM");
    const userId = userIdInput || makeReadableId("USR");
    state.families.push({ id: familyId, name: familyName, creatorUserId: userId });
    state.users.push({
      id: userId,
      familyId,
      familyName,
      name,
      password,
      role: "creator",
      familyRole: familyRoleLabel(familyRole),
      adultType: memberTypeFromFamilyRole(familyRole),
      status: "active",
    });
    clearLedgerData();
    state.currentUserId = userId;
    state.activePage = defaultPageForRole("creator");
    state.lastCreated = { type: "family", familyId, userId };
    saveState();
    render();
  });
}

function renderJoinFamilyForm() {
  document.querySelector("#auth-form").innerHTML = `
    ${renderCreatedNotice()}
    <form class="form" id="join-family-form">
      <div class="field">
        <label for="join-family-id">家庭 ID</label>
        <input id="join-family-id" maxlength="10" placeholder="例如：Home01" required />
      </div>
      <div class="field">
        <label for="custom-joiner-id">自定义用户 ID</label>
        <input id="custom-joiner-id" maxlength="10" placeholder="例如：Dad01 / Child01" />
      </div>
      <div class="form-row">
        <div class="field">
          <label for="joiner-name">加入者昵称</label>
          <input id="joiner-name" placeholder="例如：爸爸 / 小明" required />
        </div>
        <div class="field">
          <label for="joiner-family-role">在家庭中的角色</label>
          <select id="joiner-family-role">${roleSelectOptions()}</select>
        </div>
      </div>
      <div class="form-row">
        <div class="field">
          <label for="joiner-password">密码</label>
          <input id="joiner-password" type="password" minlength="8" required />
        </div>
        <div class="field">
          <label for="joiner-password-confirm">确认密码</label>
          <input id="joiner-password-confirm" type="password" minlength="8" required />
        </div>
      </div>
      <div class="field">
        <label for="join-captcha-answer">验证码</label>
        <div class="captcha-line">
          <code id="join-captcha-question">正在生成验证码...</code>
          <button class="btn subtle" id="join-captcha-refresh" type="button">换一题</button>
        </div>
        <input id="join-captcha-answer" placeholder="请输入计算结果" inputmode="numeric" required />
        <input id="join-captcha-id" type="hidden" />
      </div>
      <div class="hint">ID 区分大小写，仅支持 10 位以内字母和数字。密码至少 8 位，并同时包含字母和数字。审批通过前账号不可登录。</div>
      <div class="error" id="auth-error"></div>
      <button class="btn primary" type="submit">提交加入申请</button>
    </form>
  `;

  loadCaptcha("join");
  document.querySelector("#join-captcha-refresh").addEventListener("click", () => loadCaptcha("join"));

  document.querySelector("#join-family-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const familyId = document.querySelector("#join-family-id").value.trim();
    const name = document.querySelector("#joiner-name").value.trim();
    const familyRole = document.querySelector("#joiner-family-role").value;
    const customUserId = document.querySelector("#custom-joiner-id").value;
    const password = document.querySelector("#joiner-password").value;
    const confirm = document.querySelector("#joiner-password-confirm").value;
    const error = document.querySelector("#auth-error");

    if (!name) {
      error.textContent = "请填写加入者昵称。";
      return;
    }
    if (!validatePassword(password, confirm, error)) return;
    if (!isValidCustomId(familyId)) {
      error.textContent = "家庭 ID 只能包含字母和数字，长度不能超过 10 位，并且区分大小写。";
      return;
    }
    const userIdInput = validateOptionalCustomId(customUserId, error, "用户 ID");
    if (userIdInput === null) return;
    const joinCaptcha = captchaPayload("join");
    if (!joinCaptcha.captchaId || !joinCaptcha.captchaAnswer) {
      error.textContent = "请先完成验证码。";
      return;
    }

    try {
      const result = await apiRequest("/api/families/join", {
        method: "POST",
        body: JSON.stringify({
          ...joinCaptcha,
          familyId,
          userId: userIdInput,
          name,
          password,
          familyRole: familyRoleLabel(familyRole),
          adultType: memberTypeFromFamilyRole(familyRole),
        }),
      });
      if (result.state) applyRemoteState(result.state);
      state.lastCreated = { type: "join", familyId: result.familyId, userId: result.userId };
      saveState();
      renderAuth();
      return;
    } catch (apiError) {
      if (!isBackendUnavailable(apiError)) {
        error.textContent = apiError.message;
        loadCaptcha("join");
        return;
      }
    }
    if (!localCaptchas.join || !verifyLocalCaptcha("join", error)) return;

    const family = state.families.find((candidate) => candidate.id === familyId);

    if (!family) {
      error.textContent = "未找到该家庭 ID。请确认创建者提供的 ID 是否正确。";
      return;
    }

    const userId = userIdInput || makeReadableId("USR");
    const memberType = memberTypeFromFamilyRole(familyRole);
    state.users.push({
      id: userId,
      familyId: family.id,
      familyName: family.name,
      name,
      password,
      role: memberType === "child" ? "child" : "member",
      familyRole: familyRoleLabel(familyRole),
      adultType: memberType,
      status: "pending",
    });
    state.lastCreated = { type: "join", familyId: family.id, userId };
    saveState();
    renderAuth();
  });
}

function renderForgotPasswordForm() {
  document.querySelector("#auth-form").innerHTML = `
    ${renderCreatedNotice()}
    <form class="form" id="forgot-password-form">
      <div class="field">
        <label for="reset-user-id">用户 ID</label>
        <input id="reset-user-id" placeholder="输入需要找回密码的用户 ID" required />
      </div>
      <div class="field">
        <label for="reset-message">找回说明</label>
        <textarea id="reset-message" rows="3" placeholder="例如：我是爸爸，忘记了登录密码，请帮我重置。"></textarea>
      </div>
      <div class="hint">找回请求会发送给账号所在家庭的创建者或管理员；处理完成后，请向对方获取临时密码。</div>
      <div class="error" id="auth-error"></div>
      <button class="btn primary" type="submit">发送找回请求</button>
      <button class="btn subtle" data-auth-mode="login" type="button">返回登录</button>
    </form>
  `;

  document.querySelector("#forgot-password-form [data-auth-mode]").addEventListener("click", () => {
    state.authMode = "login";
    state.lastCreated = null;
    saveState();
    renderAuth();
  });

  document.querySelector("#forgot-password-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const userId = cleanCustomId(document.querySelector("#reset-user-id").value);
    const message = document.querySelector("#reset-message").value.trim();
    const error = document.querySelector("#auth-error");
    if (!userId) {
      error.textContent = "请填写需要找回密码的用户 ID。";
      return;
    }
    if (!isValidCustomId(userId)) {
      error.textContent = "用户 ID 只能包含字母和数字，长度不能超过 10 位，并且区分大小写。";
      return;
    }
    try {
      const result = await apiRequest("/api/password-resets", {
        method: "POST",
        body: JSON.stringify({ userId, message }),
      });
      state.lastCreated = { type: "password-reset", requestId: result.requestId };
      saveState();
      renderAuth();
      return;
    } catch (apiError) {
      if (!isBackendUnavailable(apiError)) {
        error.textContent = apiError.message;
        return;
      }
    }

    const user = state.users.find((candidate) => candidate.id === userId);
    if (!user) {
      error.textContent = "未找到该用户 ID。";
      return;
    }
    const requestId = makeReadableId("RESET");
    state.passwordResetRequests.unshift({
      id: requestId,
      familyId: user.familyId,
      userId: user.id,
      requesterName: user.name,
      message: message || "我忘记了登录密码，请帮我重置。",
      status: "pending",
      createdAt: new Date().toISOString(),
    });
    state.lastCreated = { type: "password-reset", requestId };
    saveState();
    renderAuth();
  });
}

function renderCreatedNotice() {
  if (!state.lastCreated) return "";
  if (state.lastCreated.type === "family") {
    return `
      <div class="panel notice">
        <strong>家庭创建成功</strong>
        <p>家庭 ID：<code>${state.lastCreated.familyId}</code></p>
        <p>创建者用户 ID：<code>${state.lastCreated.userId}</code></p>
      </div>
    `;
  }
  if (state.lastCreated.type === "member") {
    return `
      <div class="panel notice">
        <strong>成员添加成功</strong>
        <p>新成员用户 ID：<code>${state.lastCreated.userId}</code></p>
        <p>默认密码：<code>${state.lastCreated.defaultPassword}</code></p>
      </div>
    `;
  }
  if (state.lastCreated.type === "password-reset") {
    return `
      <div class="panel notice">
        <strong>找回请求已发送</strong>
        <p>请求编号：<code>${state.lastCreated.requestId}</code></p>
        <p>请等待家庭创建者或管理员审核，通过后即可使用自己的账号登录。</p>
      </div>
    `;
  }
  if (state.lastCreated.type === "password-reset-done") {
    return `
      <div class="panel notice">
        <strong>密码已重置</strong>
        <p>用户 ID：<code>${state.lastCreated.userId}</code></p>
        <p>临时密码：<code>${state.lastCreated.defaultPassword}</code></p>
      </div>
    `;
  }
  if (state.lastCreated.type === "admin-password-reset") {
    return `
      <div class="panel notice">
        <strong>后台密码重置完成</strong>
        <p>用户 ID：<code>${state.lastCreated.userId}</code></p>
        <p>临时密码：<code>${state.lastCreated.defaultPassword}</code></p>
      </div>
    `;
  }
  return `
    <div class="panel notice">
      <strong>加入申请已提交</strong>
      <p>你的用户 ID：<code>${state.lastCreated.userId}</code></p>
      <p>当前状态：等待家庭创建者或管理员审批。审批通过前暂时无法登录。</p>
    </div>
  `;
}

function renderShell(user) {
  const systemAdmin = user.role === "systemAdmin";
  const family = systemAdmin ? null : currentFamily();
  const visibleNav = navItems.filter((item) => can(item.id));
  const roleThemeClass = `theme-${user.role || "member"}`;
  if (!can(state.activePage)) {
    state.activePage = defaultPageForRole(user.role);
    saveState();
  }
  app.innerHTML = `
    <div class="app-shell ${roleThemeClass}">
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-title">${systemAdmin ? "系统后台" : "家庭账本"}</div>
          <div class="brand-subtitle">${systemAdmin ? "全局数据管理" : escapeHtml(family?.name || user.familyName)}</div>
          <div class="brand-subtitle">${systemAdmin ? "后台账号" : `家庭 ID：${escapeHtml(user.familyId)}`}</div>
        </div>
        <nav class="nav">
          ${visibleNav.map((item) => `<button class="${state.activePage === item.id ? "active" : ""}" data-page="${item.id}">${item.label}</button>`).join("")}
        </nav>
        <div class="side-footer">
          <span class="role-badge">${roleLabels[user.role]}</span>
          <span class="brand-subtitle">${systemAdmin ? "管理员 ID" : "用户 ID"}：${escapeHtml(user.id)}</span>
          <button class="btn" id="logout">退出登录</button>
        </div>
      </aside>
      <main class="main">
        <div id="page"></div>
      </main>
    </div>
  `;

  document.querySelectorAll("[data-page]").forEach((button) => {
    button.addEventListener("click", () => setPage(button.dataset.page));
  });
  document.querySelector("#logout").addEventListener("click", () => {
    state.currentUserId = null;
    state.currentAdmin = null;
    state.authToken = null;
    state.authMode = "login";
    state.lastCreated = null;
    saveState();
    render();
  });

  renderPage(user);
}

function renderPage(user) {
  const page = document.querySelector("#page");
  const renderers = {
    dashboard: renderDashboard,
    members: renderMembers,
    familyDirectory: renderFamilyDirectory,
    transactions: renderTransactions,
    personalStats: renderPersonalStats,
    familyStats: renderFamilyStats,
    budgets: renderBudgets,
    ai: renderAi,
    allowance: renderAllowance,
    childTransactions: renderChildTransactions,
    childStatement: renderChildStatement,
    childTasks: renderChildTasks,
    childRequests: renderChildRequests,
    childSavings: renderChildSavings,
    childAi: renderChildAi,
    adminData: renderAdminData,
  };
  const renderer = renderers[state.activePage] || renderers[defaultPageForRole(user.role)];
  page.innerHTML = renderer(user);
  bindPageEvents();
}

function renderAdminData(admin) {
  const families = state.families || [];
  const users = state.users || [];
  const resetRequests = state.passwordResetRequests || [];
  const activeUsers = users.filter((user) => user.status === "active").length;
  const pendingUsers = users.filter((user) => user.status === "pending").length;
  const pendingResets = resetRequests.filter((request) => request.status === "pending").length;

  return `
    <header class="topbar">
      <div>
        <h1 class="page-title">后台数据</h1>
        <p class="page-copy">你好，${escapeHtml(admin.name)}。这里集中维护已持久化的家庭、用户和密码找回数据，适合处理全局后台事务。</p>
      </div>
      <div class="toolbar">
        <span class="tag blue">管理员 ID：${escapeHtml(admin.id)}</span>
        <button class="btn subtle" data-admin-refresh type="button">刷新数据</button>
      </div>
    </header>
    ${state.lastCreated?.type === "admin-password-reset" ? renderCreatedNotice() : ""}
    <section class="grid four">
      ${metricCard("家庭总数", families.length, "系统中已创建的家庭账户")}
      ${metricCard("用户总数", users.length, `${activeUsers} 个账号处于启用状态`)}
      ${metricCard("待审批成员", pendingUsers, "已提交加入申请但尚未启用的账号")}
      ${metricCard("待处理找回", pendingResets, "等待处理的密码找回申请")}
    </section>
    <section class="panel">
      <div class="section-title"><div><h2>家庭数据</h2><p>用于维护家庭名称、创建者归属，以及必要时注销整个家庭。</p></div></div>
      <div class="table-wrap">
        <table class="table admin-table">
          <thead><tr><th>家庭</th><th>家庭名称</th><th>成员</th><th>当前创建者</th><th>新创建者</th><th>操作</th></tr></thead>
          <tbody>${families.map(adminFamilyRow).join("") || `<tr><td colspan="6">暂无家庭数据</td></tr>`}</tbody>
        </table>
      </div>
    </section>
    <section class="panel">
      <div class="section-title"><div><h2>用户数据</h2><p>用于调整用户昵称、家庭称谓、账号类型、系统身份和启用状态。</p></div></div>
      <div class="table-wrap">
        <table class="table admin-table user-admin-table">
          <thead><tr><th>用户</th><th>所属家庭</th><th>家庭称谓</th><th>账号类型</th><th>系统身份</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>${users.map(adminUserRow).join("") || `<tr><td colspan="7">暂无用户数据</td></tr>`}</tbody>
        </table>
      </div>
    </section>
    <section class="panel">
      <div class="section-title"><div><h2>密码找回申请</h2><p>集中处理各家庭的密码找回请求；重置后用户会获得新的临时密码。</p></div></div>
      <div class="table-wrap">
        <table class="table admin-table">
          <thead><tr><th>申请人</th><th>所属家庭</th><th>说明</th><th>状态</th><th>提交时间</th><th>操作</th></tr></thead>
          <tbody>${resetRequests.map(adminPasswordResetRow).join("") || `<tr><td colspan="6">暂无找回请求</td></tr>`}</tbody>
        </table>
      </div>
    </section>
  `;
}

function adminFamilyRow(family) {
  const familyUsers = (state.users || []).filter((user) => user.familyId === family.id);
  const creator = familyUsers.find((user) => user.id === family.creatorUserId);
  const activeAdultCount = familyUsers.filter((user) => user.status === "active" && user.adultType === "adult").length;
  return `
    <tr data-admin-family-row="${escapeHtml(family.id)}">
      <td><strong>${escapeHtml(family.id)}</strong><br><span class="hint">${activeAdultCount} 位可选成人</span></td>
      <td><input class="admin-table-input" data-admin-family-name value="${escapeHtml(family.name)}" /></td>
      <td>${familyUsers.length} 人<br><span class="hint">${familyUsers.filter((user) => user.status === "pending").length} 个待审批</span></td>
      <td>${escapeHtml(creator?.name || family.creatorUserId)}<br><span class="hint">${escapeHtml(family.creatorUserId)}</span></td>
      <td><select class="admin-table-input" data-admin-family-creator>${adminCreatorOptions(family)}</select></td>
      <td>
        <div class="row-actions">
          <button class="btn subtle" data-admin-save-family type="button">保存名称</button>
          <button class="btn subtle" data-admin-transfer-creator type="button">转移创建者</button>
          <button class="btn danger" data-admin-delete-family type="button">注销家庭</button>
        </div>
      </td>
    </tr>
  `;
}

function adminCreatorOptions(family) {
  return (state.users || [])
    .filter((user) => user.familyId === family.id && user.status === "active" && user.adultType === "adult")
    .map((user) => `<option value="${escapeHtml(user.id)}"${selectedAttr(user.id, family.creatorUserId)}>${escapeHtml(user.name)}（${escapeHtml(user.id)}）</option>`)
    .join("");
}

function adminUserRow(user) {
  const family = (state.families || []).find((item) => item.id === user.familyId);
  return `
    <tr data-admin-user-row="${escapeHtml(user.id)}">
      <td>
        <input class="admin-table-input" data-admin-user-name value="${escapeHtml(user.name)}" />
        <span class="hint">${escapeHtml(user.id)}</span>
      </td>
      <td>${escapeHtml(family?.name || user.familyName)}<br><span class="hint">${escapeHtml(user.familyId)}</span></td>
      <td><select class="admin-table-input" data-admin-user-family-role>${adminFamilyRoleOptions(user.familyRole)}</select></td>
      <td><select class="admin-table-input" data-admin-user-adult-type${user.role === "creator" ? " disabled" : ""}>${adminAdultTypeOptions(user.adultType)}</select></td>
      <td><select class="admin-table-input" data-admin-user-role${user.role === "creator" ? " disabled" : ""}>${adminRoleOptions(user.role)}</select></td>
      <td><select class="admin-table-input" data-admin-user-status${user.role === "creator" ? " disabled" : ""}>${adminStatusOptions(user.status)}</select></td>
      <td>
        <div class="row-actions">
          <button class="btn subtle" data-admin-save-user type="button">保存</button>
          <button class="btn subtle" data-admin-reset-user type="button">重置密码</button>
        </div>
      </td>
    </tr>
  `;
}

function adminFamilyRoleOptions(selected) {
  return familyRoleOptions
    .map((option) => `<option value="${option.value}"${selectedAttr(option.value, selected)}>${option.label}</option>`)
    .join("");
}

function adminAdultTypeOptions(selected) {
  return ["adult", "child"]
    .map((value) => `<option value="${value}"${selectedAttr(value, selected)}>${value === "child" ? "孩子" : "成人"}</option>`)
    .join("");
}

function adminRoleOptions(selected) {
  return ["creator", "admin", "member", "child"]
    .map((value) => `<option value="${value}"${selectedAttr(value, selected)}>${roleLabels[value]}</option>`)
    .join("");
}

function adminStatusOptions(selected) {
  return ["active", "pending", "rejected"]
    .map((value) => `<option value="${value}"${selectedAttr(value, selected)}>${statusLabels[value]}</option>`)
    .join("");
}

function adminPasswordResetRow(request) {
  const family = (state.families || []).find((item) => item.id === request.familyId);
  const user = (state.users || []).find((item) => item.id === request.userId);
  const actions = request.status === "pending"
    ? `
      <div class="row-actions">
        <button class="btn subtle" data-admin-reset-request="${escapeHtml(request.id)}" type="button">重置</button>
        <button class="btn danger" data-admin-reject-request="${escapeHtml(request.id)}" type="button">拒绝</button>
      </div>
    `
    : `<span class="hint">已处理</span>`;
  return `
    <tr>
      <td>${escapeHtml(request.requesterName || user?.name || "未知用户")}<br><span class="hint">${escapeHtml(request.userId)}</span></td>
      <td>${escapeHtml(family?.name || "未知家庭")}<br><span class="hint">${escapeHtml(request.familyId)}</span></td>
      <td>${escapeHtml(request.message)}</td>
      <td><span class="tag ${request.status === "pending" ? "orange" : "gray"}">${resetStatusLabels[request.status] || request.status}</span></td>
      <td>${escapeHtml(request.createdAt || "-")}</td>
      <td>${actions}</td>
    </tr>
  `;
}

function renderDashboard(user) {
  const familyTx = familyCountedTransactions();
  const personalTx = getPersonalTransactions(user);
  const familyExpense = sumTransactions(familyTx, isExpense);
  const personalExpense = sumTransactions(personalTx, isExpense);
  const pendingCount = getFamilyUsers().filter((candidate) => candidate.status === "pending").length;
  const pendingChildCount = state.childRequests.filter((item) => item.status === "pending").length;
  const visibleMemberCount = getFamilyUsers().filter((candidate) => candidate.status === "active").length;
  const budgetPressure = state.budgets.reduce((max, budget) => Math.max(max, budgetUsage(budget).percent / 100), 0);
  const manager = isManagerRole(user);
  const recentRows = getFamilyTransactions().slice(0, 5).map(publicTransactionRow).join("");

  return `
    <header class="topbar">
      <div>
        <h1 class="page-title">你好，${escapeHtml(user.name)}</h1>
        <p class="page-copy">当前身份：${roleLabels[user.role]} / ${escapeHtml(user.familyRole)}。这里汇总家庭收支、预算压力、待处理事项和最近账单。</p>
      </div>
      <div class="toolbar">
        ${can("transactions") ? `<button class="btn subtle" data-page-jump="transactions">新增记录</button>` : ""}
        ${can("members") ? `<button class="btn subtle" data-page-jump="members">审批成员</button>` : ""}
        ${can("budgets") ? `<button class="btn primary" data-page-jump="budgets">查看预算</button>` : ""}
      </div>
    </header>
    ${state.lastCreated?.type === "family" ? renderCreatedNotice() : ""}
    <section class="grid four">
      ${metricCard("家庭真实消费", money(familyExpense), "已计入家庭统计的真实支出")}
      ${metricCard("我的相关支出", money(personalExpense), "由我记录或承担的支出")}
      ${metricCard("预算最高使用率", `${Math.round(budgetPressure * 100)}%`, "接近 80% 时建议及时复盘")}
      ${manager
        ? metricCard("待审批事项", pendingCount + pendingChildCount, "待处理的加入申请与孩子消费请求")
        : metricCard("家庭成员", visibleMemberCount, "当前可见的家庭成员数量")}
    </section>
    <section class="dashboard-layout">
      <div class="panel">
        <div class="section-title">
          <div><h2>预算执行</h2><p>集中查看月度、周度、分类和活动预算的使用进度。</p></div>
          <button class="btn subtle" data-page-jump="budgets">管理预算</button>
        </div>
        <div class="budget-stack">${state.budgets.map(budgetCard).join("")}</div>
      </div>
      <div class="panel">
        <div class="section-title">
          <div><h2>分类结构</h2><p>按主分类观察真实消费分布，帮助发现高频开销。</p></div>
        </div>
        ${barList(topGroups(familyTx.filter(isExpense), "category"))}
      </div>
    </section>
    <section class="panel">
      <div class="section-title">
        <div><h2>最近账单</h2><p>快速核对最近记录的类型、分类、活动和统计口径。</p></div>
        <button class="btn subtle" data-page-jump="transactions">查看全部</button>
      </div>
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>日期</th><th>金额</th><th>类型</th><th>分类</th><th>活动</th><th>统计口径</th></tr></thead>
          <tbody>${recentRows}</tbody>
        </table>
      </div>
    </section>
  `;
}

function metricCard(label, value, desc) {
  return `
    <div class="panel metric">
      <span class="metric-label">${label}</span>
      <span class="metric-value">${value}</span>
      <span class="metric-desc">${desc}</span>
    </div>
  `;
}

function budgetCard(budget, options = {}) {
  const usage = budgetUsage(budget);
  const percent = Math.min(100, usage.percent);
  return `
    <div class="budget-card">
      <div>
        <strong>${escapeHtml(budget.name)}</strong>
        <span>${budget.type} / ${budget.category} / ${escapeHtml(budget.period || "当前周期")}</span>
      </div>
      <div class="budget-meta">
        <span>${money(usage.used)} / ${money(usage.total)}</span>
        <div class="row-actions">
          <span class="tag ${usage.percent >= 80 ? "orange" : ""}">${usage.status}</span>
          ${options.canCancel ? `<button class="btn danger" data-cancel-budget="${escapeHtml(budget.id)}" type="button">取消预算</button>` : ""}
        </div>
      </div>
      <div class="progress"><span style="width: ${percent}%"></span></div>
    </div>
  `;
}

function barList(groups) {
  const max = Math.max(...groups.map(([, value]) => value), 1);
  return `
    <div class="bar-list">
      ${groups.map(([name, value]) => `
        <div class="bar-row wide">
          <span>${escapeHtml(name)}</span>
          <div class="bar-track"><span style="width: ${Math.round((value / max) * 100)}%"></span></div>
          <strong>${money(value)}</strong>
        </div>
      `).join("") || `<p class="hint">暂无可统计数据。</p>`}
    </div>
  `;
}

function renderMembers() {
  const active = currentUser();
  const family = currentFamily();
  const familyUsers = getFamilyUsers();
  const activeMembers = familyUsers.filter((user) => user.status === "active");
  const pendingMembers = familyUsers.filter((user) => user.status === "pending");
  const resetRequests = (state.passwordResetRequests || []).filter((request) => request.familyId === active.familyId);

  return `
    <header class="topbar">
      <div>
        <h1 class="page-title">成员管理</h1>
        <p class="page-copy">家庭 ID：${escapeHtml(active.familyId)}。这里处理成员加入、角色调整、密码找回和家庭权限维护。</p>
      </div>
      <div class="toolbar">
        <span class="tag blue">${activeMembers.length} 位已启用成员</span>
        <span class="tag orange">${pendingMembers.length} 个待审批</span>
      </div>
    </header>
    ${["member", "password-reset-done"].includes(state.lastCreated?.type) ? renderCreatedNotice() : ""}
    <section class="grid two">
      <div class="panel">
        <div class="section-title compact"><div><h2>成员加入方式</h2><p>新成员通过登录页提交加入申请，填写家庭 ID 和个人信息后等待审批。</p></div></div>
        <div class="rule-list">
          ${ruleItem("创建者", "负责家庭最高权限，可任免管理员、转移创建者、移除成员和注销家庭。")}
          ${ruleItem("管理员", "协助处理加入审批、密码找回、普通成员移除和孩子账户管理。")}
          ${ruleItem("普通成员/孩子", "仅使用与自身身份相关的功能，不接触成员管理和后台数据。")}
        </div>
      </div>
      <div class="panel">
        <div class="section-title compact"><div><h2>权限说明</h2><p>界面只展示当前身份可执行的操作，后端也会再次校验权限。</p></div></div>
        <div class="permission-list">
          ${permissionItem("创建者", "拥有家庭所有权，可管理角色、数据和家庭生命周期。")}
          ${permissionItem("管理员", "负责日常审批和维护，但不能任命管理员或转让创建者。")}
          ${permissionItem("普通成员", "记录个人收支，查看个人统计、公开家庭统计和预算。")}
          ${permissionItem("孩子", "使用零花钱、任务、消费申请和储蓄目标等专属功能。")}
        </div>
      </div>
    </section>
    ${isCreatorRole(active) ? `
      <section class="panel danger-zone">
        <div class="section-title">
          <div>
            <h2>注销家庭</h2>
            <p>注销后，家庭「${escapeHtml(family?.name || active.familyName)}」及其成员账号、加入申请和密码找回请求都会从后台删除。</p>
          </div>
          <button class="btn danger" data-delete-family="${escapeHtml(active.familyId)}" type="button">注销家庭</button>
        </div>
      </section>
    ` : ""}
    <section class="panel">
      <div class="section-title"><div><h2>已启用成员</h2><p>查看当前有效账号，并根据权限进行角色调整、创建者转移或成员移除。</p></div></div>
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>成员</th><th>系统身份</th><th>家庭角色</th><th>类型</th><th>操作</th></tr></thead>
          <tbody>${activeMembers.map((user) => memberRow(user, active)).join("") || `<tr><td colspan="5">暂无成员</td></tr>`}</tbody>
        </table>
      </div>
    </section>
    <section class="panel">
      <div class="section-title"><div><h2>待审批加入申请</h2><p>通过申请后，成员即可使用自己的用户 ID 和密码登录家庭账本。</p></div></div>
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>申请人</th><th>家庭角色</th><th>类型</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>${pendingMembers.map(pendingMemberRow).join("") || `<tr><td colspan="5">暂无待审批申请</td></tr>`}</tbody>
        </table>
      </div>
    </section>
    <section class="panel">
      <div class="section-title"><div><h2>密码找回请求</h2><p>成员忘记密码时，可由创建者或管理员生成新的临时密码。</p></div></div>
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>申请人</th><th>用户 ID</th><th>说明</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>${resetRequests.map(passwordResetRow).join("") || `<tr><td colspan="5">暂无找回请求</td></tr>`}</tbody>
        </table>
      </div>
    </section>
  `;
}

function permissionItem(title, desc) {
  return `<div class="permission-item"><strong>${title}</strong><span>${desc}</span></div>`;
}

function memberManagementActions(user, active) {
  if (user.id === active.id) return `<span class="hint">当前登录账号</span>`;
  if (user.role === "creator") return `<span class="hint">创建者身份需先转让</span>`;
  const actions = [];
  if (isCreatorRole(active) && user.adultType !== "child") {
    actions.push(user.role === "admin"
      ? `<button class="btn subtle" data-member-role="${escapeHtml(user.id)}" data-role="member" type="button">取消管理员</button>`
      : `<button class="btn subtle" data-member-role="${escapeHtml(user.id)}" data-role="admin" type="button">设为管理员</button>`);
    actions.push(`<button class="btn subtle" data-transfer-creator="${escapeHtml(user.id)}" type="button">转为创建者</button>`);
  }
  if (isCreatorRole(active) || user.role !== "admin") {
    actions.push(`<button class="btn danger" data-remove-member="${escapeHtml(user.id)}" type="button">移除成员</button>`);
  }
  return actions.length ? `<div class="row-actions">${actions.join("")}</div>` : `<span class="hint">暂无可用操作</span>`;
}

function memberRow(user, active = currentUser()) {
  return `
    <tr>
      <td>${escapeHtml(user.name)}<br><span class="hint">${escapeHtml(user.id)}</span></td>
      <td><span class="tag">${roleLabels[user.role]}</span></td>
      <td>${escapeHtml(user.familyRole)}</td>
      <td>${user.adultType === "child" ? "孩子" : "成人"}</td>
      <td>${memberManagementActions(user, active)}</td>
    </tr>
  `;
}

function renderFamilyDirectory() {
  const user = currentUser();
  const visibleMembers = getFamilyUsers().filter((candidate) => candidate.status === "active");
  return `
    <header class="topbar">
      <div>
        <h1 class="page-title">家庭成员</h1>
        <p class="page-copy">普通成员可以查看家庭成员概况，但不会显示用户 ID、系统权限和审批信息。</p>
      </div>
      <div class="toolbar">
        <span class="tag blue">${visibleMembers.length} 位家庭成员</span>
      </div>
    </header>
    <section class="panel">
      <div class="section-title"><div><h2>${escapeHtml(user.familyName)}</h2><p>这里展示成员昵称、家庭称谓、成人/孩子类型和账号状态。</p></div></div>
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>成员</th><th>家庭称谓</th><th>类型</th><th>状态</th></tr></thead>
          <tbody>${visibleMembers.map(publicMemberRow).join("") || `<tr><td colspan="4">暂无成员</td></tr>`}</tbody>
        </table>
      </div>
    </section>
  `;
}

function publicMemberRow(user) {
  return `
    <tr>
      <td>${escapeHtml(user.name)}</td>
      <td>${escapeHtml(user.familyRole)}</td>
      <td>${user.adultType === "child" ? "孩子" : "成人"}</td>
      <td><span class="tag">${statusLabels[user.status]}</span></td>
    </tr>
  `;
}

function pendingMemberRow(user) {
  return `
    <tr>
      <td>${escapeHtml(user.name)}<br><span class="hint">${escapeHtml(user.id)}</span></td>
      <td>${escapeHtml(user.familyRole)}</td>
      <td>${user.adultType === "child" ? "孩子" : "成人"}</td>
      <td><span class="tag orange">${statusLabels[user.status]}</span></td>
      <td class="row-actions">
        <button class="btn primary" data-approve-user="${user.id}">同意</button>
        <button class="btn danger" data-reject-user="${user.id}">拒绝</button>
      </td>
    </tr>
  `;
}

function passwordResetRow(request) {
  return `
    <tr>
      <td>${escapeHtml(request.requesterName)}</td>
      <td><code>${escapeHtml(request.userId)}</code></td>
      <td>${escapeHtml(request.message)}</td>
      <td><span class="tag ${request.status === "pending" ? "orange" : "gray"}">${request.status === "pending" ? "待处理" : request.status === "resolved" ? "已重置" : "已拒绝"}</span></td>
      <td class="row-actions">
        ${request.status === "pending" ? `
          <button class="btn primary" data-reset-password="${request.id}">重置</button>
          <button class="btn danger" data-reject-reset="${request.id}">拒绝</button>
        ` : "已处理"}
      </td>
    </tr>
  `;
}

function renderTransactions() {
  const active = currentUser();
  const editingTx = state.editingTransactionId
    ? state.transactions.find((tx) => tx.id === state.editingTransactionId)
    : null;
  const selectedType = editingTx?.type || "支出";
  const selectedCycle = editingTx ? displayCycle(editingTx.cycle) : "真实消费";
  const selectedOwnerId = editingTx?.ownerId || active.id;
  return `
    <header class="topbar">
      <div>
        <h1 class="page-title">记录收支</h1>
        <p class="page-copy">记录家庭和个人的各类账单，并通过统计口径区分真实消费、收入和内部资金变动。</p>
      </div>
      ${editingTx ? `<button class="btn subtle" data-cancel-edit-transaction type="button">取消修改</button>` : ""}
    </header>
    <section class="grid two">
      <form class="panel form" id="transaction-form">
        <div class="section-title compact"><div><h2>${editingTx ? "修改账单" : "新增账单"}</h2><p>选择账单类型、分类、活动和成员，保存后会同步影响统计与预算。</p></div></div>
        <div class="form-row">
          <div class="field">
            <label for="tx-amount">金额</label>
            <input id="tx-amount" type="number" min="0" step="0.01" value="${editingTx ? Number(editingTx.amount || 0) : ""}" required />
          </div>
          <div class="field">
            <label for="tx-date">时间</label>
            <input id="tx-date" type="date" value="${escapeHtml(editingTx?.date || "")}" required />
          </div>
        </div>
        <div class="form-row">
          <div class="field">
            <label for="tx-type">账单类型</label>
            <select id="tx-type">
              ${["支出", "收入", "转账", "投资", "还款", "奖励"].map((type) => `<option${selectedAttr(type, selectedType)}>${type}</option>`).join("")}
            </select>
          </div>
          <div class="field">
            <label for="tx-cycle">统计口径</label>
            <select id="tx-cycle">
              ${["真实消费", "个人/资产变动"].map((cycle) => `<option${selectedAttr(cycle, selectedCycle)}>${cycle}</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="field">
            <label for="tx-category">主分类</label>
            <input id="tx-category" list="tx-categories" placeholder="${categoryPlaceholderForType(selectedType)}" value="${escapeHtml(editingTx?.category || "")}" required />
            <datalist id="tx-categories">${renderCategoryOptions(selectedType)}</datalist>
          </div>
          <div class="field">
            <label for="tx-tag">标签</label>
            <input id="tx-tag" placeholder="例如：旅游 / 孩子 / 家庭" value="${escapeHtml(editingTx?.tag || "")}" />
          </div>
        </div>
        <div class="form-row">
          <div class="field">
            <label for="tx-event">关联活动</label>
            <input id="tx-event" list="tx-activities" placeholder="例如：家庭活动 / 日常" value="${escapeHtml(editingTx?.event || "")}" />
            <datalist id="tx-activities">${activitySuggestions().map((item) => `<option value="${escapeHtml(item)}"></option>`).join("")}</datalist>
          </div>
          <div class="field">
            <label for="tx-owner">付款成员</label>
            <select id="tx-owner">${getActiveFamilyUsers().map((user) => `<option value="${user.id}"${selectedAttr(user.id, selectedOwnerId)}>${escapeHtml(user.name)}</option>`).join("")}</select>
          </div>
        </div>
        <div class="field">
          <label for="tx-note">备注</label>
          <textarea id="tx-note" rows="3">${escapeHtml(editingTx?.note || "")}</textarea>
        </div>
        <div class="form-row">
          <label class="hint"><input id="tx-family" type="checkbox" ${editingTx?.countFamily === false ? "" : "checked"} /> 计入家庭账户分类统计</label>
          <label class="hint"><input id="tx-recurring" type="checkbox" ${editingTx ? "disabled" : ""} /> 设为固定周期账单</label>
        </div>
        <div class="form-row" id="recurring-fields">
          <div class="field">
            <label for="tx-recurring-frequency">重复频率</label>
            <select id="tx-recurring-frequency">
              <option value="monthly">每月</option>
              <option value="weekly">每周</option>
            </select>
          </div>
          <div class="field">
            <label for="tx-recurring-name">固定账单名称</label>
            <input id="tx-recurring-name" placeholder="例如：房租 / 固定生活费" />
          </div>
        </div>
        <button class="btn primary" type="submit">${editingTx ? "保存修改" : "保存账单"}</button>
      </form>
      <div class="panel">
        <div class="section-title compact"><div><h2>统计口径提醒</h2><p>只有真实对外发生的收入或消费才进入家庭统计，内部转账不会重复计算。</p></div></div>
        <div class="rule-list">
          ${ruleItem("真实消费", "餐饮、住宿、交通、文具等对外支出会计入家庭支出。")}
          ${ruleItem("个人/资产变动", "零花钱发放、账户调拨和储蓄转入只记录流向，不重复计入消费。")}
          ${ruleItem("固定周期账单", "房租、生活费等固定项目可设置周期，到期自动生成记录。")}
        </div>
      </div>
    </section>
    <section class="panel">
      <div class="section-title"><div><h2>固定周期账单</h2><p>管理会定期发生的账单项目；修改单笔记录不会影响周期模板。</p></div></div>
      <div class="budget-stack">
        ${state.recurringBills.map((bill) => `
          <div class="recurring-item">
            <div><strong>${escapeHtml(bill.name || bill.category)}</strong><span>${bill.frequency === "weekly" ? "每周" : "每月"} / 下次 ${escapeHtml(bill.nextDate || "-")} / ${money(bill.amount)}</span></div>
            <button class="btn danger" data-remove-recurring="${escapeHtml(bill.id)}" type="button">移除</button>
          </div>
        `).join("") || `<p class="hint">暂无固定周期账单</p>`}
      </div>
    </section>
    <section class="panel">
      <div class="section-title"><div><h2>账单列表</h2><p>按时间查看家庭账单，并检查分类、活动和是否计入家庭统计。</p></div></div>
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>日期</th><th>金额</th><th>类型</th><th>分类</th><th>活动</th><th>统计口径</th><th>操作</th></tr></thead>
          <tbody>${getFamilyTransactions().map((tx) => transactionRow(tx, { canEdit: isManagerRole(active) })).join("") || `<tr><td colspan="7">暂无账单</td></tr>`}</tbody>
        </table>
      </div>
    </section>
  `;
}

function ruleItem(title, desc) {
  return `<div class="rule-item"><strong>${title}</strong><span>${desc}</span></div>`;
}

function transactionRow(tx, options = {}) {
  const canEdit = options.canEdit === true;
  return `
    <tr>
      <td>${escapeHtml(tx.date || "-")}<br><span class="hint">${escapeHtml(tx.owner || "未指定")}</span></td>
      <td><strong>${money(tx.amount)}</strong></td>
      <td>${escapeHtml(tx.type)}<br><span class="tag gray">${escapeHtml(displayCycle(tx.cycle))}</span></td>
      <td>${escapeHtml(tx.category)}<br><span class="tag orange">${escapeHtml(tx.tag || "无标签")}</span></td>
      <td>${escapeHtml(tx.event || "日常")}</td>
      <td>${tx.countFamily ? `<span class="tag">家庭统计</span>` : `<span class="tag gray">个人/资产</span>`}</td>
      <td>${canEdit ? `<button class="btn subtle" data-edit-transaction="${escapeHtml(tx.id)}" type="button">修改</button>` : `<span class="hint">只读</span>`}</td>
    </tr>
  `;
}

function publicTransactionRow(tx) {
  return `
    <tr>
      <td>${escapeHtml(tx.date || "-")}</td>
      <td><strong>${money(tx.amount)}</strong></td>
      <td>${escapeHtml(tx.type)}<br><span class="tag gray">${escapeHtml(displayCycle(tx.cycle))}</span></td>
      <td>${escapeHtml(tx.category)}<br><span class="tag orange">${escapeHtml(tx.tag || "无标签")}</span></td>
      <td>${escapeHtml(tx.event || "日常")}</td>
      <td>${tx.countFamily ? `<span class="tag">家庭统计</span>` : `<span class="tag gray">个人/资产</span>`}</td>
    </tr>
  `;
}

function renderPersonalStats(user) {
  const personalTx = getPersonalTransactions(user);
  const expenseTx = personalTx.filter(isExpense);
  const incomeTx = personalTx.filter(isIncome);
  const income = sumTransactions(incomeTx);
  const expense = sumTransactions(expenseTx);
  return `
    <header class="topbar">
      <div>
        <h1 class="page-title">个人账户收支统计</h1>
        <p class="page-copy">汇总 ${escapeHtml(user.name)} 的收入、支出和结余，并用图表呈现分类结构与变化趋势。</p>
      </div>
    </header>
    <section class="grid three">
      ${metricCard("个人收入", money(income), "本账号记录的收入、奖励和入账")}
      ${metricCard("个人支出", money(expense), "本账号记录或承担的支出")}
      ${metricCard("个人结余", money(income - expense), "收入扣除支出后的余额")}
    </section>
    ${statsPanels("个人", personalTx)}
  `;
}

function renderFamilyStats(user) {
  const familyTx = familyCountedTransactions();
  const showDetails = isManagerRole(user);
  const income = sumTransactions(familyTx, isIncome);
  const expense = sumTransactions(familyTx, isExpense);
  return `
    <header class="topbar">
      <div>
        <h1 class="page-title">家庭账户收支统计</h1>
        <p class="page-copy">汇总家庭真实收入、支出和结余，并按时间、结构、分类和排行绘制图表。</p>
      </div>
    </header>
    <section class="grid three">
      ${metricCard("家庭收入", money(income), "工资、报销、奖励等真实流入")}
      ${metricCard("家庭支出", money(expense), "纳入家庭统计的真实支出")}
      ${metricCard("家庭结余", money(income - expense), "家庭收入扣除支出后的余额")}
    </section>
    ${statsPanels("家庭", familyTx, { showDetails })}
  `;
}

function statsPanels(scope, transactions, options = {}) {
  const expenseTx = transactions.filter(isExpense);
  const incomeTx = transactions.filter(isIncome);
  const summary = statsSummary(transactions);
  const showDetails = options.showDetails !== false;
  const view = statsView();
  const periodData = periodRows(transactions, 8);
  const expenseField = showDetails ? "category" : "event";
  const rankingField = showDetails ? "category" : "event";
  const expenseGroups = topGroups(expenseTx, expenseField, 8);
  const incomeGroups = topGroups(incomeTx, showDetails ? "category" : "event", 8);
  const flowData = flowRows(transactions, rankingField, 8);
  const categoryFlowData = flowRows(transactions, "category", 12);
  const categoryExpenseGroups = topGroups(expenseTx, "category", 10);
  const categoryIncomeGroups = topGroups(incomeTx, "category", 10);
  const dayFlowData = flowRows(transactions.map((tx) => ({ ...tx, day: dayKey(tx.date) })), "day", 10).sort((a, b) => a.name.localeCompare(b.name));
  const chartContent = {
    overview: `
      <div class="stats-chart-grid">
        <div class="chart-card wide">
          <div class="chart-title"><strong>收入 / 支出 / 结余</strong><span>按月份汇总</span></div>
          ${flowChart(periodData)}
        </div>
        <div class="chart-card">
          <div class="chart-title"><strong>支出结构</strong><span>${showDetails ? "按分类" : "按活动"}</span></div>
          ${donutChart(expenseGroups.slice(0, 6), "支出占比")}
        </div>
        <div class="chart-card">
          <div class="chart-title"><strong>收入结构</strong><span>${showDetails ? "按分类" : "按活动"}</span></div>
          ${donutChart(incomeGroups.slice(0, 6), "收入占比")}
        </div>
      </div>
    `,
    trend: `
      <div class="stats-chart-grid">
        <div class="chart-card wide">
          <div class="chart-title"><strong>结余趋势</strong><span>收入减支出</span></div>
          ${lineChart(periodData)}
        </div>
        <div class="chart-card">
          <div class="chart-title"><strong>月度流量</strong><span>收入与支出</span></div>
          ${stackedFlowChart(periodData)}
        </div>
        <div class="chart-card">
          <div class="chart-title"><strong>每日收支</strong><span>收入、支出、结余</span></div>
          ${flowChart(dayFlowData)}
        </div>
      </div>
    `,
    structure: `
      <div class="stats-chart-grid">
        <div class="chart-card">
          <div class="chart-title"><strong>支出占比</strong><span>${showDetails ? "分类" : "活动"}</span></div>
          ${donutChart(expenseGroups.slice(0, 6), "支出")}
        </div>
        <div class="chart-card">
          <div class="chart-title"><strong>收入占比</strong><span>${showDetails ? "分类" : "活动"}</span></div>
          ${donutChart(incomeGroups.slice(0, 6), "收入")}
        </div>
        <div class="chart-card wide">
          <div class="chart-title"><strong>支出面积图</strong><span>看集中度</span></div>
          ${treemapChart(expenseGroups)}
        </div>
      </div>
    `,
    category: `
      <div class="stats-chart-grid">
        <div class="chart-card wide">
          <div class="chart-title"><strong>分类收支对比</strong><span>每个分类的收入、支出、结余</span></div>
          ${categoryComparisonChart(categoryFlowData)}
        </div>
        <div class="chart-card">
          <div class="chart-title"><strong>分类收入排行</strong><span>按收入分类</span></div>
          ${verticalChart(categoryIncomeGroups)}
        </div>
        <div class="chart-card">
          <div class="chart-title"><strong>分类支出排行</strong><span>按支出分类</span></div>
          ${verticalChart(categoryExpenseGroups)}
        </div>
        <div class="chart-card wide">
          <div class="chart-title"><strong>分类支出面积图</strong><span>支出占比越大面积越大</span></div>
          ${treemapChart(categoryExpenseGroups)}
        </div>
      </div>
    `,
    ranking: `
      <div class="stats-chart-grid">
        <div class="chart-card wide">
          <div class="chart-title"><strong>收入支出排行</strong><span>${showDetails ? "按分类" : "按活动"}</span></div>
          ${flowChart(flowData)}
        </div>
        <div class="chart-card">
          <div class="chart-title"><strong>收入排行</strong><span>Top 8</span></div>
          ${verticalChart(incomeGroups)}
        </div>
        <div class="chart-card">
          <div class="chart-title"><strong>支出排行</strong><span>Top 8</span></div>
          ${verticalChart(expenseGroups)}
        </div>
      </div>
    `,
  };

  return `
    <section class="panel stats-workbench">
      <div class="section-title compact"><div><h2>${scope}收支统计工作台</h2><p>通过概览、趋势、结构、分类和排行视图分析收入、支出与结余。</p></div></div>
      ${statsControls(view)}
      ${showDetails ? "" : `<p class="hint stats-permission-note">普通成员视图只展示汇总图表，不展示成员明细或单笔敏感说明。</p>`}
      <div class="stats-summary-grid">
        ${statsSummaryCard("总收入", money(summary.income), "收入与奖励", compareTrend(transactions, isIncome))}
        ${statsSummaryCard("总支出", money(summary.expense), "支出与还款", compareTrend(transactions, isExpense, true))}
        ${statsSummaryCard("净结余", money(summary.balance), "收入 - 支出", summary.balance >= 0 ? `<em class="trend good">正结余</em>` : `<em class="trend bad">负结余</em>`)}
        ${statsSummaryCard("储蓄率 / 均支出", `${summary.savingsRate}%`, `单笔均支出 ${money(summary.avgExpense)}`)}
      </div>
      <div class="stats-chart-grid">
        <div class="chart-card wide">
          <div class="chart-title"><strong>收支可视化总览</strong><span>收入、支出、结余、储蓄率</span></div>
          ${cashflowOverviewChart(summary)}
        </div>
        <div class="chart-card">
          <div class="chart-title"><strong>收入支出占比</strong><span>总量对比</span></div>
          ${donutChart([["收入", summary.income], ["支出", summary.expense]].filter(([, value]) => value > 0), "收支")}
        </div>
      </div>
      ${statsInsights(transactions)}
      ${chartContent[view] || chartContent.overview}
    </section>
    ${showDetails ? `<section class="panel">
      <div class="section-title compact"><div><h2>${scope}账单明细</h2><p>按日期查看明细，便于追溯统计图表背后的具体记录。</p></div></div>
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>日期</th><th>金额</th><th>类型</th><th>分类</th><th>活动</th><th>统计口径</th></tr></thead>
          <tbody>${transactions.map(publicTransactionRow).join("") || `<tr><td colspan="6">暂无数据</td></tr>`}</tbody>
        </table>
      </div>
    </section>` : `<section class="panel">
      <div class="section-title compact"><div><h2>${scope}公开统计</h2><p>普通成员视图仅展示汇总结果，不展示敏感成员明细。</p></div></div>
      <p class="hint">个人承担情况可在“个人统计”中查看。</p>
    </section>`}
  `;
}

function renderBudgets() {
  const user = currentUser();
  const manager = isManagerRole(user);
  const usages = state.budgets.map(budgetUsage);
  const total = usages.reduce((sum, usage) => sum + usage.total, 0);
  const used = usages.reduce((sum, usage) => sum + usage.used, 0);
  const riskyCount = usages.filter((usage) => usage.percent >= 80).length;
  return `
    <header class="topbar">
      <div>
        <h1 class="page-title">${manager ? "预算管理" : "预算查看"}</h1>
        <p class="page-copy">预算会根据已记录账单自动计算使用额，帮助提前发现分类或活动超支风险。</p>
      </div>
    </header>
    <section class="grid three">
      ${metricCard("预算总额", money(total), "所有有效预算的额度合计")}
      ${metricCard("已使用", money(used), "按账单分类和活动自动匹配")}
      ${metricCard("风险预算", riskyCount, "使用率超过 80% 的预算项")}
    </section>
    <section class="grid two">
      ${manager ? `<form class="panel form" id="budget-form">
        <div class="section-title compact"><div><h2>新建预算</h2><p>为固定周期、重点分类或一次性家庭活动设置额度。</p></div></div>
        <div class="form-row">
          <div class="field"><label for="budget-name">预算名称</label><input id="budget-name" required /></div>
          <div class="field"><label for="budget-total">预算金额</label><input id="budget-total" type="number" min="1" required /></div>
        </div>
        <div class="form-row">
          <div class="field">
            <label for="budget-type">预算类型</label>
            <select id="budget-type"><option>月度</option><option>周度</option><option>分类</option><option>活动</option></select>
          </div>
          <div class="field"><label for="budget-category">预算分类</label><input id="budget-category" list="budget-categories" placeholder="餐饮 / 旅游 / 零花钱" required /><datalist id="budget-categories">${categories.map((item) => `<option value="${item}"></option>`).join("")}</datalist></div>
        </div>
        <button class="btn primary" type="submit">保存预算</button>
      </form>` : `<div class="panel">
        <div class="section-title compact"><div><h2>只读预算</h2><p>普通成员可查看预算执行情况，但不能创建、修改或取消预算。</p></div></div>
        <div class="rule-list">
          ${ruleItem("自动计算", "系统根据已记录账单匹配预算使用额。")}
          ${ruleItem("活动预算", "旅行、开学季等活动会按关联活动聚合。")}
          ${ruleItem("风险提醒", "使用率超过 80% 的预算会被重点提示。")}
        </div>
      </div>`}
      <div class="panel">
        <div class="section-title compact"><div><h2>预算列表</h2><p>查看每项预算的使用额、剩余额度和风险状态。</p></div></div>
        <div class="budget-stack">${state.budgets.map((budget) => budgetCard(budget, { canCancel: manager })).join("") || `<p class="hint">暂无预算</p>`}</div>
      </div>
    </section>
  `;
}

function aiAllowedTransactions() {
  const currentMonth = currentBudgetPeriod("月度");
  return familyCountedTransactions().filter((tx) => {
    const text = `${tx.type || ""} ${tx.category || ""} ${tx.tag || ""} ${tx.event || ""}`;
    return monthKey(tx.date) === currentMonth && !text.includes("投资");
  });
}

function aiPublicPrompt() {
  const settings = state.aiSettings || defaultAiSettings;
  const promptType = settings.promptType || "本月总结";
  const base = settings.publicPrompt || defaultAiSettings.publicPrompt;
  return `${promptType}：${base}`;
}

function aiEndpointReady() {
  return Boolean((state.aiSettings?.endpoint || "").trim());
}

function aiAudienceLabel(user = currentUser()) {
  if (user?.role === "child") return "孩子";
  if (isManagerRole(user)) return "家庭管理者";
  return "普通成员";
}

function localAiAdvice({ audience = "adult" } = {}) {
  const user = currentUser();
  const tx = audience === "child" ? getPersonalTransactions(user) : aiAllowedTransactions();
  const expenses = tx.filter(isExpense);
  const incomes = tx.filter(isIncome);
  const totalExpense = sumTransactions(expenses);
  const totalIncome = sumTransactions(incomes);
  const topCategory = topGroups(expenses, "category", 1)[0] || ["暂无", 0];
  const riskyBudgets = state.budgets.filter((budget) => budgetUsage(budget).percent >= 80);
  if (audience === "child") {
    return `收支小结：你已经记录 ${tx.length} 笔账单，支出最多的分类是「${topCategory[0]}」。\n建议：1. 每次花钱后及时记录用途；2. 有收入时先留一部分给储蓄目标；3. 遇到较大的消费先提交申请并说明理由。`;
  }
  return `本月小结：家庭记录中收入 ${money(totalIncome)}，支出 ${money(totalExpense)}，支出最多的分类是「${topCategory[0]}」。\n建议：1. 优先复盘高频支出分类；2. ${riskyBudgets.length ? `关注预算接近上限的项目：${riskyBudgets.map((budget) => budget.name).join("、")}。` : "继续保持当前预算节奏。"} 3. 记录账单时补充分类和活动，方便月底复盘。`;
}

function aiPromptPayload({ audience = "adult" } = {}) {
  const user = currentUser();
  const settings = state.aiSettings || defaultAiSettings;
  const tx = audience === "child" ? getPersonalTransactions(user) : aiAllowedTransactions();
  const budgetSummaries = state.budgets.map((budget) => {
    const usage = budgetUsage(budget);
    return {
      name: budget.name,
      type: budget.type,
      category: budget.category,
      period: budget.period,
      total: budget.total,
      used: usage.used,
      percent: usage.percent,
    };
  });
  const prompt = [
    `分析类型：${settings.promptType || defaultAiSettings.promptType}`,
    `用户身份：${aiAudienceLabel(user)}`,
    `家庭称谓：${user?.familyRole || "家庭成员"}`,
    settings.publicPrompt || defaultAiSettings.publicPrompt,
    audience === "child"
      ? "孩子端输出要求：语气温和，避免责备；用孩子能理解的话说明消费、奖励和储蓄目标；不要展示其他家庭成员数据。"
      : "成人端输出要求：围绕收入、支出、预算风险和记录质量给建议；普通成员也只能获得建议，不能修改 API 设置。",
    "输出格式：一段简短结论 + 3 条编号建议 + 1 条下次记录提醒。",
  ].join("\n");
  return {
    prompt,
    promptType: settings.promptType || defaultAiSettings.promptType,
    audience,
    role: user?.role,
    generatedAt: new Date().toISOString(),
    data: {
      transactions: tx.map((item) => ({
        amount: item.amount,
        type: item.type,
        cycle: item.cycle,
        category: item.category,
        tag: item.tag,
        event: item.event,
        countFamily: item.countFamily,
        date: item.date,
      })),
      budgets: budgetSummaries,
      savingGoals: audience === "child" ? savingGoalsForUser(user).map((goal) => ({
        name: goal.name,
        target: goal.target,
        saved: goal.saved,
      })) : [],
    },
  };
}

function readAiResponse(data) {
  if (typeof data === "string") return data;
  return data?.advice || data?.result || data?.text || data?.message || "";
}

async function generateAiAdvice({ audience = "adult" } = {}) {
  const settings = state.aiSettings || defaultAiSettings;
  const endpoint = (settings.endpoint || "").trim();
  const fallback = localAiAdvice({ audience });
  if (!endpoint) {
    state.aiAdvice = { audience, source: "local", text: fallback, updatedAt: new Date().toISOString() };
    saveState();
    render();
    return;
  }

  try {
    const response = await fetch(endpoint.startsWith("/") ? `${API_BASE}${endpoint}` : endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(state.authToken ? { Authorization: `Bearer ${state.authToken}` } : {}),
      },
      body: JSON.stringify(aiPromptPayload({ audience })),
    });
    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json") ? await response.json() : await response.text();
    if (!response.ok) {
      const message = typeof payload === "string" ? payload : payload?.message;
      throw new Error(message || "AI API 调用失败。");
    }
    state.aiAdvice = {
      audience,
      source: "api",
      text: readAiResponse(payload) || fallback,
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    state.aiAdvice = {
      audience,
      source: "local",
      text: `${fallback}\n\n提示：AI API 暂时不可用，已使用本地规则生成建议。${error.message ? `原因：${error.message}` : ""}`,
      updatedAt: new Date().toISOString(),
    };
  }
  saveState();
  render();
}

function aiAdvicePanel({ audience = "adult" } = {}) {
  const advice = state.aiAdvice?.audience === audience ? state.aiAdvice : null;
  const sourceLabel = advice?.source === "api" ? "API 建议" : "本地规则";
  return `
    <div class="panel ai-card">
      <span class="tag ${advice?.source === "api" ? "blue" : "gray"}">${sourceLabel}</span>
      <h2>${advice ? "已生成建议" : "等待生成建议"}</h2>
      <p>${escapeHtml(advice?.text || "点击重新生成后，系统会根据当前角色和账本数据生成建议。").replaceAll("\n", "<br>")}</p>
      ${advice?.updatedAt ? `<p class="hint">生成时间：${escapeHtml(new Date(advice.updatedAt).toLocaleString())}</p>` : ""}
    </div>
  `;
}

function renderAi() {
  const aiTx = aiAllowedTransactions();
  const expenses = aiTx.filter(isExpense);
  const incomes = aiTx.filter(isIncome);
  const totalExpense = sumTransactions(expenses);
  const totalIncome = sumTransactions(incomes);
  const topCategory = topGroups(expenses, "category", 1)[0] || ["暂无", 0];
  const riskyBudgets = state.budgets.filter((budget) => budgetUsage(budget).percent >= 80);
  const topEvent = topGroups(expenses, "event", 1)[0] || ["日常", 0];
  const settings = state.aiSettings || defaultAiSettings;
  const manager = isManagerRole();

  return `
    <header class="topbar">
      <div>
        <h1 class="page-title">AI 生成分析</h1>
        <p class="page-copy">${manager ? "创建者和管理员负责接入 AI API 与维护提示词，家庭成员通过已配置能力获取建议。" : "AI API 由创建者或管理员维护，你可以直接基于当前账本生成建议。"}</p>
      </div>
      <button class="btn primary" id="refresh-ai" data-ai-audience="adult">重新生成</button>
    </header>
    <section class="grid two">
      ${manager ? `<form class="panel form" id="ai-settings-form">
        <div class="section-title compact"><div><h2>AI 接入设置</h2><p>仅创建者和管理员可配置 API 代理与家庭提示词；前端不保存密钥。</p></div></div>
        <div class="field"><label for="ai-endpoint">后端代理地址</label><input id="ai-endpoint" value="${escapeHtml(settings.endpoint || "")}" placeholder="/api/ai/analyze" /></div>
        <div class="field">
          <label for="ai-prompt-type">分析类型</label>
          <select id="ai-prompt-type">
            ${["本月总结", "预算提醒", "活动复盘"].map((item) => `<option${selectedAttr(item, settings.promptType)}>${item}</option>`).join("")}
          </select>
        </div>
        <div class="field"><label for="ai-public-prompt">家庭 AI 提示词</label><textarea id="ai-public-prompt" rows="6">${escapeHtml(settings.publicPrompt || defaultAiSettings.publicPrompt)}</textarea></div>
        <button class="btn primary" type="submit">保存设置</button>
      </form>` : `<div class="panel">
        <div class="section-title compact"><div><h2>AI 使用权限</h2><p>API 接入由创建者或管理员统一维护，普通成员不能修改代理地址和提示词。</p></div></div>
        <div class="rule-list">
          ${ruleItem("接入状态", aiEndpointReady() ? "家庭 AI API 已配置，可尝试调用 API 生成建议。" : "暂未配置 API，系统会使用本地规则生成建议。")}
          ${ruleItem("成员权限", "你可以查看和生成建议，但不能修改 API 接入设置。")}
          ${ruleItem("隐私边界", "请求数据不包含密码、账号凭据、身份证或银行卡等敏感信息。")}
        </div>
      </div>`}
      <div class="panel">
        <div class="section-title compact"><div><h2>数据边界</h2><p>分析范围限定为本月家庭消费、收入和预算执行，不输出投资建议。</p></div></div>
        <div class="rule-list">
          ${ruleItem("本月数据", `当前纳入 ${aiTx.length} 笔本月非投资账单。`)}
          ${ruleItem("禁止投资建议", "投资、基金、股票、资产配置相关记录会被排除。")}
          ${ruleItem("提示词边界", aiPublicPrompt())}
        </div>
      </div>
    </section>
    <section class="grid two">
      ${aiAdvicePanel({ audience: "adult" })}
      <div class="panel ai-card">
        <span class="tag blue">本月总结</span>
        <h2>收入 ${money(totalIncome)} / 支出 ${money(totalExpense)}</h2>
        <p>本月支出最高的分类是「${escapeHtml(topCategory[0])}」，金额为 ${money(topCategory[1])}。建议继续按分类和活动记录账单，便于后续复盘。</p>
      </div>
      <div class="panel ai-card">
        <span class="tag orange">预算提醒</span>
        <h2>${riskyBudgets.length ? `${riskyBudgets.length} 项预算接近上限` : "预算整体正常"}</h2>
        <p>${riskyBudgets.length ? `建议优先关注：${riskyBudgets.map((budget) => budget.name).join("、")}。` : "目前没有预算超过 80%，可以继续保持当前节奏。"}</p>
      </div>
      <div class="panel ai-card">
        <span class="tag">活动复盘</span>
        <h2>${escapeHtml(topEvent[0] || "日常")}</h2>
        <p>该活动累计金额为 ${money(topEvent[1])}。活动结束后可复盘餐饮、住宿、交通等主分类，判断哪些开销最值得优化。</p>
      </div>
      <div class="panel ai-card">
        <span class="tag gray">合规边界</span>
        <h2>仅提供消费分析</h2>
        <p>AI 模块只提供家庭消费结构、预算执行和异常提醒，不提供股票、基金等具体投资建议。</p>
      </div>
    </section>
  `;
}

function getChildUsers() {
  return getFamilyUsers().filter((user) => user.status === "active" && user.role === "child");
}

function childRequestsForUser(user) {
  return state.childRequests.filter((request) => request.ownerId ? request.ownerId === user.id : request.childName === user.name);
}

function childTasksForUser(user) {
  return state.childTasks.filter((task) => task.ownerId ? task.ownerId === user.id : true);
}

function savingGoalsForUser(user) {
  return state.savingGoals.filter((goal) => goal.ownerId ? goal.ownerId === user.id : true);
}

function taskStatusLabel(status) {
  if (status === "pendingReview") return "等待审核";
  if (status === "rewarded") return "已奖励";
  return status || "待完成";
}

function activeGoalForUser(user) {
  const goals = savingGoalsForUser(user);
  return goals[0] || { id: "GOAL-EMPTY", name: "暂无储蓄目标", target: 1, saved: 0 };
}

function renderAllowance() {
  const pendingRequests = state.childRequests.filter((request) => request.status === "pending");
  const pendingTasks = state.childTasks.filter((task) => task.status === "pendingReview");
  const children = getChildUsers();
  const firstGoal = state.savingGoals[0] || { name: "暂无目标", saved: 0, target: 1 };
  return `
    <header class="topbar">
      <div>
        <h1 class="page-title">孩子零花钱管理</h1>
        <p class="page-copy">管理孩子的零花钱、任务奖励、消费申请和储蓄目标，让家庭教育和账本记录保持一致。</p>
      </div>
    </header>
    <section class="grid three">
      ${metricCard("待审批请求", pendingRequests.length, "孩子提交后等待处理的消费申请")}
      ${metricCard("待审核任务", pendingTasks.length, "孩子完成后等待确认的任务")}
      ${metricCard("储蓄目标进度", `${Math.round((firstGoal.saved / firstGoal.target) * 100)}%`, firstGoal.name)}
    </section>
    <section class="grid two">
      <form class="panel form" id="allowance-form">
        <div class="section-title compact"><div><h2>发放零花钱</h2><p>零花钱发放记录为内部资金变动，不会重复计入家庭消费。</p></div></div>
        <div class="field">
          <label for="allowance-child">发放对象</label>
          <select id="allowance-child">${children.map((child) => `<option value="${child.id}">${escapeHtml(child.name)}</option>`).join("")}</select>
        </div>
        <div class="field"><label for="allowance-amount">发放金额</label><input id="allowance-amount" type="number" min="1" value="100" /></div>
        <div class="field"><label for="allowance-reason">发放原因</label><input id="allowance-reason" placeholder="例如：零花钱 / 奖励" /></div>
        <button class="btn primary" type="submit" ${children.length ? "" : "disabled"}>发放到孩子钱包</button>
      </form>
      <form class="panel form" id="guardian-task-form">
        <div class="section-title compact"><div><h2>派发任务目标</h2><p>为孩子设置可完成的任务和奖励金额，完成后再审核入账。</p></div></div>
        <div class="field">
          <label for="task-child">指定孩子</label>
          <select id="task-child">${children.map((child) => `<option value="${child.id}">${escapeHtml(child.name)}</option>`).join("")}</select>
        </div>
        <div class="field"><label for="task-title">任务内容</label><input id="task-title" placeholder="例如：整理书桌" required /></div>
        <div class="field"><label for="task-reward">奖励金额</label><input id="task-reward" type="number" min="1" value="10" required /></div>
        <button class="btn primary" type="submit" ${children.length ? "" : "disabled"}>派发任务</button>
      </form>
    </section>
    <section class="grid two">
      <div class="panel">
        <div class="section-title compact"><div><h2>待审批请求</h2><p>审核孩子的消费理由和金额，批准后会生成真实消费记录。</p></div></div>
        <div class="request-list">${state.childRequests.map((request) => requestCard(request, { canAct: true })).join("")}</div>
      </div>
      <div class="panel">
        <div class="section-title compact"><div><h2>任务奖励审核</h2><p>确认任务完成情况，通过后自动生成孩子的奖励收入。</p></div></div>
        <div class="task-list">${state.childTasks.map((task) => taskCard(task, { canReview: true })).join("")}</div>
      </div>
    </section>
    <section class="panel">
      <div class="section-title compact"><div><h2>孩子储蓄目标</h2><p>查看孩子设定的目标和进度，帮助他们建立储蓄意识。</p></div></div>
      <div class="task-list">${state.savingGoals.map(goalReadonlyCard).join("") || `<p class="hint">暂无储蓄目标</p>`}</div>
    </section>
  `;
}

function requestCard(request, options = {}) {
  const canAct = options.canAct === true;
  return `
    <div class="request-card">
      <div><strong>${escapeHtml(request.title)}</strong><span>${escapeHtml(request.childName)}：${escapeHtml(request.reason)}</span></div>
      <div class="request-actions">
        <span>${money(request.amount)}</span>
        ${request.status === "pending" && canAct ? `<button class="btn primary" data-approve-request="${request.id}">批准</button><button class="btn danger" data-reject-request="${request.id}">拒绝</button>` : `<span class="tag gray">${request.status === "approved" ? "已批准" : request.status === "rejected" ? "已拒绝" : "待审批"}</span>`}
      </div>
    </div>
  `;
}

function taskCard(task, options = {}) {
  const canComplete = options.canComplete === true && !["pendingReview", "rewarded", "已奖励"].includes(task.status);
  const canReview = options.canReview === true && task.status === "pendingReview";
  return `
    <div class="task-card">
      <div><strong>${escapeHtml(task.title)}</strong><span>${escapeHtml(task.childName || "孩子")} / 奖励 ${money(task.reward)}</span></div>
      <div class="row-actions">
        <span class="tag ${task.status === "rewarded" || task.status === "已奖励" ? "" : "orange"}">${taskStatusLabel(task.status)}</span>
        ${canComplete ? `<button class="btn primary" data-complete-task="${task.id}">我已完成</button>` : ""}
        ${canReview ? `<button class="btn primary" data-approve-task="${task.id}">通过</button><button class="btn danger" data-reject-task="${task.id}">退回</button>` : ""}
      </div>
    </div>
  `;
}

function goalReadonlyCard(goal) {
  const owner = state.users.find((user) => user.id === goal.ownerId);
  const percent = Math.min(100, Math.round(((goal.saved || 0) / Math.max(1, goal.target || 1)) * 100));
  return `
    <div class="task-card">
      <div><strong>${escapeHtml(goal.name)}</strong><span>${escapeHtml(owner?.name || "孩子")} / ${money(goal.saved || 0)} / ${money(goal.target || 0)}</span></div>
      <span class="tag ${percent >= 100 ? "" : "orange"}">${percent >= 100 ? "已达成" : `${percent}%`}</span>
    </div>
  `;
}

function renderChildTransactions() {
  const user = currentUser();
  return `
    <header class="topbar">
      <div>
        <h1 class="page-title">记录收支</h1>
        <p class="page-copy">记录自己的收入、奖励、消费和储蓄变化，并学会区分真实消费与钱包内部变动。</p>
      </div>
    </header>
    <section class="grid two">
      <form class="panel form" id="child-transaction-form">
        <div class="section-title compact"><div><h2>新增账单</h2><p>真实消费会进入家庭支出；零花钱和储蓄变化只影响自己的钱包记录。</p></div></div>
        <div class="form-row">
          <div class="field"><label for="child-tx-amount">金额</label><input id="child-tx-amount" type="number" min="0" step="0.01" required /></div>
          <div class="field"><label for="child-tx-date">时间</label><input id="child-tx-date" type="date" required /></div>
        </div>
        <div class="form-row">
          <div class="field">
            <label for="child-tx-type">账单类型</label>
            <select id="child-tx-type"><option>支出</option><option>收入</option><option>转账</option><option>奖励</option></select>
          </div>
          <div class="field">
            <label for="child-tx-cycle">账单口径</label>
            <select id="child-tx-cycle"><option value="familyExpense">真实消费</option><option value="personalMove">零花钱/储蓄变动</option></select>
          </div>
        </div>
        <div class="form-row">
          <div class="field"><label for="child-tx-category">主分类</label><input id="child-tx-category" list="child-categories" placeholder="文具 / 零食 / 奖励" required /><datalist id="child-categories">${categories.map((item) => `<option value="${item}"></option>`).join("")}</datalist></div>
          <div class="field"><label for="child-tx-tag">标签</label><input id="child-tx-tag" placeholder="学习 / 日常 / 任务" /></div>
        </div>
        <div class="field"><label for="child-tx-note">备注</label><textarea id="child-tx-note" rows="3"></textarea></div>
        <label class="hint"><input id="child-tx-family" type="checkbox" checked /> 真实消费计入家庭统计</label>
        <button class="btn primary" type="submit">保存账单</button>
      </form>
      <div class="panel">
        <div class="section-title compact"><div><h2>记录口径</h2><p>选择正确口径，可以避免零花钱发放和实际消费被重复计算。</p></div></div>
        <div class="rule-list">
          ${ruleItem("真实消费", "购买文具、零食、交通等实际花出去的钱，会计入家庭统计。")}
          ${ruleItem("零花钱/储蓄变动", "零花钱转入、储蓄划分等内部变化，只影响自己的余额记录。")}
          ${ruleItem("自动入账", "任务审核通过或消费申请批准后，系统会自动生成对应记录。")}
        </div>
      </div>
    </section>
  `;
}

function renderChildStatement() {
  const user = currentUser();
  const personalTx = getPersonalTransactions(user);
  const expenseTx = personalTx.filter(isExpense);
  const incomeTx = personalTx.filter((tx) => isIncome(tx) || tx.type === "转账");
  return `
    <header class="topbar">
      <div>
        <h1 class="page-title">查看收支</h1>
        <p class="page-copy">这里只展示 ${escapeHtml(user.name)} 自己的收支记录和统计结果，不显示其他家庭成员账单。</p>
      </div>
    </header>
    <section class="grid three">
      ${metricCard("我的支出", money(sumTransactions(expenseTx)), "自己实际花出去的金额")}
      ${metricCard("我的收入/奖励", money(sumTransactions(incomeTx)), "零花钱、任务奖励和其他收入")}
      ${metricCard("记录数", personalTx.length, "已经记录的个人账单数量")}
    </section>
    ${statsPanels("我的", personalTx)}
  `;
}

function renderChildTasks() {
  const user = currentUser();
  const tasks = childTasksForUser(user);
  return `
    <header class="topbar">
      <div>
        <h1 class="page-title">任务目标</h1>
        <p class="page-copy">完成家长布置的任务后提交审核，通过后奖励会自动计入收入。</p>
      </div>
    </header>
    <section class="panel">
      <div class="section-title compact"><div><h2>我的任务</h2><p>查看任务状态，完成后提交给家长确认。</p></div></div>
      <div class="task-list">${tasks.map((task) => taskCard(task, { canComplete: true })).join("") || `<p class="hint">暂无任务</p>`}</div>
    </section>
  `;
}

function renderChildRequests() {
  const user = currentUser();
  const myRequests = childRequestsForUser(user);
  return `
    <header class="topbar">
      <div>
        <h1 class="page-title">发起请求</h1>
        <p class="page-copy">遇到较大的消费计划时，先提交申请，家长批准后会自动生成真实消费记录。</p>
      </div>
    </header>
    <section class="grid two">
      <form class="panel form" id="child-request-form">
        <div class="section-title compact"><div><h2>新的消费请求</h2><p>写清楚想买什么、预计金额和理由，方便家长判断。</p></div></div>
        <div class="form-row">
          <div class="field"><label for="request-title">想买什么</label><input id="request-title" required /></div>
          <div class="field"><label for="request-amount">预计金额</label><input id="request-amount" type="number" min="1" required /></div>
        </div>
        <div class="field"><label for="request-reason">申请理由</label><textarea id="request-reason" rows="3"></textarea></div>
        <button class="btn primary" type="submit">提交给家长</button>
      </form>
      <div class="panel">
        <div class="section-title compact"><div><h2>我的请求</h2><p>查看自己提交过的消费申请和处理结果。</p></div></div>
        <div class="request-list">${myRequests.map((request) => requestCard(request)).join("") || `<p class="hint">暂无消费请求</p>`}</div>
      </div>
    </section>
  `;
}

function renderChildSavings() {
  const user = currentUser();
  const goals = savingGoalsForUser(user);
  return `
    <header class="topbar">
      <div>
        <h1 class="page-title">储蓄目标</h1>
        <p class="page-copy">为想购买的物品设定储蓄目标，记录已经存下的钱和完成进度。</p>
      </div>
    </header>
    <section class="grid two">
      <form class="panel form" id="saving-goal-form">
        <div class="section-title compact"><div><h2>创建目标</h2><p>写下目标名称、目标金额和已经存下的金额。</p></div></div>
        <div class="field"><label for="goal-name">目标名称</label><input id="goal-name" placeholder="例如：想购买的物品" required /></div>
        <div class="form-row">
          <div class="field"><label for="goal-target">目标金额</label><input id="goal-target" type="number" min="1" required /></div>
          <div class="field"><label for="goal-saved">已储蓄</label><input id="goal-saved" type="number" min="0" value="0" /></div>
        </div>
        <button class="btn primary" type="submit">保存目标</button>
      </form>
      <div class="panel">
        <div class="section-title compact"><div><h2>我的目标</h2><p>持续更新储蓄进度，达到目标后可以标记完成。</p></div></div>
        <div class="task-list">${goals.map(childGoalCard).join("") || `<p class="hint">暂无储蓄目标</p>`}</div>
      </div>
    </section>
  `;
}

function childGoalCard(goal) {
  const percent = Math.min(100, Math.round(((goal.saved || 0) / Math.max(1, goal.target || 1)) * 100));
  return `
    <div class="task-card">
      <div><strong>${escapeHtml(goal.name)}</strong><span>${money(goal.saved || 0)} / ${money(goal.target || 0)}</span></div>
      <div class="row-actions">
        <span class="tag ${percent >= 100 ? "" : "orange"}">${percent >= 100 ? "已达成" : `${percent}%`}</span>
        ${percent < 100 ? `<button class="btn primary" data-complete-goal="${goal.id}">我已达成</button>` : ""}
      </div>
    </div>
  `;
}

function renderChildAi() {
  const user = currentUser();
  const personalTx = getPersonalTransactions(user);
  const expenseTx = personalTx.filter(isExpense);
  const topCategory = topGroups(expenseTx, "category", 1)[0] || ["暂无", 0];
  return `
    <header class="topbar">
      <div>
        <h1 class="page-title">AI 分析</h1>
        <p class="page-copy">用简单的方式回顾自己的消费、收入和储蓄目标。AI API 由家长维护，孩子只获取适合自己的建议。</p>
      </div>
      <button class="btn primary" id="refresh-ai" data-ai-audience="child">重新生成</button>
    </header>
    <section class="grid two">
      ${aiAdvicePanel({ audience: "child" })}
      <div class="panel ai-card">
        <span class="tag blue">收支小结</span>
        <h2>我的记录共 ${personalTx.length} 笔</h2>
        <p>目前支出最高的分类是「${escapeHtml(topCategory[0])}」，金额为 ${money(topCategory[1])}。可以想一想哪些花费最值得保留。</p>
      </div>
      <div class="panel ai-card">
        <span class="tag orange">储蓄建议</span>
        <h2>先定目标，再安排零花钱</h2>
        <p>建议每次有收入时先留出一部分给储蓄目标，再决定可以自由使用的金额。</p>
      </div>
    </section>
  `;
}

function handleAdminApiError(error) {
  if (isAuthExpired(error)) {
    clearAuthSession();
    render();
    return;
  }
  alert(error.message || "后台操作失败，请稍后重试。");
}

function advanceRecurringDate(dateString, frequency) {
  const date = new Date(dateString || new Date());
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
  if (frequency === "weekly") {
    date.setDate(date.getDate() + 7);
  } else {
    date.setMonth(date.getMonth() + 1);
  }
  return date.toISOString().slice(0, 10);
}

function applyDueRecurringTransactions() {
  const today = new Date().toISOString().slice(0, 10);
  let changed = false;
  state.recurringBills.forEach((bill) => {
    let nextDate = bill.nextDate;
    let guard = 0;
    while (nextDate && nextDate <= today && guard < 24) {
      const exists = state.transactions.some((tx) => tx.recurringBillId === bill.id && tx.date === nextDate);
      if (!exists) {
        state.transactions.unshift({
          id: makeReadableId("TX"),
          amount: Number(bill.amount || 0),
          type: bill.type || "支出",
          cycle: bill.cycle || "真实消费",
          category: bill.category || "未分类",
          tag: bill.tag || "固定账单",
          event: bill.event || bill.name || "日常",
          owner: bill.owner,
          ownerId: bill.ownerId || null,
          countFamily: bill.countFamily !== false,
          date: nextDate,
          note: bill.note || bill.name || "固定周期账单",
          recurringBillId: bill.id,
        });
        changed = true;
      }
      nextDate = advanceRecurringDate(nextDate, bill.frequency);
      bill.nextDate = nextDate;
      guard += 1;
    }
  });
  if (changed) saveState();
}

function bindPageEvents() {
  const adminRefresh = document.querySelector("[data-admin-refresh]");
  if (adminRefresh) {
    adminRefresh.addEventListener("click", async () => {
      try {
        const remote = await apiRequest("/api/admin/state");
        state.lastCreated = null;
        applyRemoteState(remote);
        render();
      } catch (error) {
        handleAdminApiError(error);
      }
    });
  }

  document.querySelectorAll("[data-admin-save-family]").forEach((button) => {
    button.addEventListener("click", async () => {
      const row = button.closest("[data-admin-family-row]");
      const familyId = row?.dataset.adminFamilyRow;
      const name = row?.querySelector("[data-admin-family-name]")?.value.trim();
      if (!familyId || !name) {
        alert("请填写家庭名称。");
        return;
      }
      try {
        const result = await apiRequest(`/api/admin/families/${familyId}`, {
          method: "PATCH",
          body: JSON.stringify({ name }),
        });
        state.lastCreated = null;
        applyRemoteState(result.state);
        render();
      } catch (error) {
        handleAdminApiError(error);
      }
    });
  });

  document.querySelectorAll("[data-admin-transfer-creator]").forEach((button) => {
    button.addEventListener("click", async () => {
      const row = button.closest("[data-admin-family-row]");
      const familyId = row?.dataset.adminFamilyRow;
      const creatorUserId = row?.querySelector("[data-admin-family-creator]")?.value;
      if (!familyId || !creatorUserId) return;
      if (!confirm(`确认将 ${familyId} 的创建者转移给 ${creatorUserId}？`)) return;
      try {
        const result = await apiRequest(`/api/admin/families/${familyId}/creator`, {
          method: "PATCH",
          body: JSON.stringify({ creatorUserId }),
        });
        state.lastCreated = null;
        applyRemoteState(result.state);
        render();
      } catch (error) {
        handleAdminApiError(error);
      }
    });
  });

  document.querySelectorAll("[data-admin-delete-family]").forEach((button) => {
    button.addEventListener("click", async () => {
      const row = button.closest("[data-admin-family-row]");
      const familyId = row?.dataset.adminFamilyRow;
      const family = (state.families || []).find((item) => item.id === familyId);
      const memberCount = (state.users || []).filter((user) => user.familyId === familyId).length;
      if (!familyId || !family) return;
      if (!confirm(`确认注销家庭「${family.name}」（${familyId}）？该家庭的 ${memberCount} 个成员会一起删除。`)) return;
      try {
        const result = await apiRequest(`/api/admin/families/${familyId}`, {
          method: "DELETE",
        });
        state.lastCreated = null;
        applyRemoteState(result.state);
        render();
      } catch (error) {
        handleAdminApiError(error);
      }
    });
  });

  document.querySelectorAll("[data-admin-save-user]").forEach((button) => {
    button.addEventListener("click", async () => {
      const row = button.closest("[data-admin-user-row]");
      const userId = row?.dataset.adminUserRow;
      if (!userId) return;
      const payload = {
        name: row.querySelector("[data-admin-user-name]")?.value.trim(),
        familyRole: row.querySelector("[data-admin-user-family-role]")?.value,
        adultType: row.querySelector("[data-admin-user-adult-type]")?.value,
        role: row.querySelector("[data-admin-user-role]")?.value,
        status: row.querySelector("[data-admin-user-status]")?.value,
      };
      if (!payload.name) {
        alert("请填写用户昵称。");
        return;
      }
      try {
        const result = await apiRequest(`/api/admin/users/${userId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        state.lastCreated = null;
        applyRemoteState(result.state);
        render();
      } catch (error) {
        handleAdminApiError(error);
      }
    });
  });

  document.querySelectorAll("[data-admin-reset-user]").forEach((button) => {
    button.addEventListener("click", async () => {
      const row = button.closest("[data-admin-user-row]");
      const userId = row?.dataset.adminUserRow;
      if (!userId || !confirm(`确认将用户 ${userId} 的密码重置为临时密码？`)) return;
      try {
        const result = await apiRequest(`/api/admin/users/${userId}/password`, {
          method: "PATCH",
          body: JSON.stringify({ newPassword: TEMP_PASSWORD }),
        });
        applyRemoteState(result.state);
        state.lastCreated = { type: "admin-password-reset", userId, defaultPassword: result.newPassword || TEMP_PASSWORD };
        saveState();
        render();
      } catch (error) {
        handleAdminApiError(error);
      }
    });
  });

  document.querySelectorAll("[data-admin-reset-request]").forEach((button) => {
    button.addEventListener("click", async () => {
      const requestId = button.dataset.adminResetRequest;
      const request = (state.passwordResetRequests || []).find((item) => item.id === requestId);
      if (!request || !confirm(`确认重置用户 ${request.userId} 的密码？`)) return;
      try {
        const result = await apiRequest(`/api/admin/password-resets/${requestId}`, {
          method: "PATCH",
          body: JSON.stringify({ action: "reset", newPassword: TEMP_PASSWORD }),
        });
        applyRemoteState(result.state);
        state.lastCreated = { type: "admin-password-reset", userId: request.userId, defaultPassword: result.newPassword || TEMP_PASSWORD };
        saveState();
        render();
      } catch (error) {
        handleAdminApiError(error);
      }
    });
  });

  document.querySelectorAll("[data-admin-reject-request]").forEach((button) => {
    button.addEventListener("click", async () => {
      const requestId = button.dataset.adminRejectRequest;
      if (!requestId || !confirm("确认拒绝这条密码找回申请？")) return;
      try {
        const result = await apiRequest(`/api/admin/password-resets/${requestId}`, {
          method: "PATCH",
          body: JSON.stringify({ action: "reject" }),
        });
        state.lastCreated = null;
        applyRemoteState(result.state);
        render();
      } catch (error) {
        handleAdminApiError(error);
      }
    });
  });

  document.querySelectorAll("[data-page-jump]").forEach((button) => {
    button.addEventListener("click", () => setPage(button.dataset.pageJump));
  });

  document.querySelectorAll("[data-stats-view]").forEach((button) => {
    button.addEventListener("click", () => {
      state.statsViews = { ...defaultStatsViews, ...(state.statsViews || {}), [state.activePage]: button.dataset.statsView };
      saveState();
      render();
    });
  });

  document.querySelectorAll("[data-approve-user]").forEach((button) => {
    button.addEventListener("click", async () => {
      try {
        const result = await apiRequest(`/api/members/${button.dataset.approveUser}/status`, {
          method: "PATCH",
          body: JSON.stringify({ status: "active" }),
        });
        applyRemoteState(result.state);
      } catch (apiError) {
        if (!isBackendUnavailable(apiError)) return;
        const user = state.users.find((candidate) => candidate.id === button.dataset.approveUser);
        if (user) user.status = "active";
      }
      saveState();
      render();
    });
  });

  document.querySelectorAll("[data-reject-user]").forEach((button) => {
    button.addEventListener("click", async () => {
      try {
        const result = await apiRequest(`/api/members/${button.dataset.rejectUser}/status`, {
          method: "PATCH",
          body: JSON.stringify({ status: "rejected" }),
        });
        applyRemoteState(result.state);
      } catch (apiError) {
        if (!isBackendUnavailable(apiError)) return;
        const user = state.users.find((candidate) => candidate.id === button.dataset.rejectUser);
        if (user) user.status = "rejected";
      }
      saveState();
      render();
    });
  });

  document.querySelectorAll("[data-reset-password]").forEach((button) => {
    button.addEventListener("click", async () => {
      const newPassword = TEMP_PASSWORD;
      try {
        const result = await apiRequest(`/api/password-resets/${button.dataset.resetPassword}`, {
          method: "PATCH",
          body: JSON.stringify({ action: "reset", newPassword }),
        });
        applyRemoteState(result.state);
        state.lastCreated = {
          type: "password-reset-done",
          userId: (state.passwordResetRequests || []).find((item) => item.id === button.dataset.resetPassword)?.userId,
          defaultPassword: result.newPassword || newPassword,
        };
      } catch (apiError) {
        if (!isBackendUnavailable(apiError)) return;
        const request = state.passwordResetRequests.find((item) => item.id === button.dataset.resetPassword);
        const user = state.users.find((item) => item.id === request?.userId);
        if (request && user) {
          user.password = newPassword;
          request.status = "resolved";
          state.lastCreated = { type: "password-reset-done", userId: user.id, defaultPassword: newPassword };
        }
      }
      saveState();
      render();
    });
  });

  document.querySelectorAll("[data-reject-reset]").forEach((button) => {
    button.addEventListener("click", async () => {
      try {
        const result = await apiRequest(`/api/password-resets/${button.dataset.rejectReset}`, {
          method: "PATCH",
          body: JSON.stringify({ action: "reject" }),
        });
        applyRemoteState(result.state);
      } catch (apiError) {
        if (!isBackendUnavailable(apiError)) return;
        const request = state.passwordResetRequests.find((item) => item.id === button.dataset.rejectReset);
        if (request) request.status = "rejected";
      }
      saveState();
      render();
    });
  });

  document.querySelectorAll("[data-approve-request]").forEach((button) => {
    button.addEventListener("click", () => {
      const request = state.childRequests.find((item) => item.id === button.dataset.approveRequest);
      if (!request) return;
      request.status = "approved";
      state.transactions.unshift({
        id: makeReadableId("TX"),
        amount: request.amount,
        type: "支出",
        cycle: "真实消费",
        category: "孩子消费",
        tag: "孩子",
        event: "日常",
        owner: request.childName,
        ownerId: request.ownerId || null,
        countFamily: true,
        date: new Date().toISOString().slice(0, 10),
        note: request.title,
      });
      saveState();
      render();
    });
  });

  document.querySelectorAll("[data-complete-task]").forEach((button) => {
    button.addEventListener("click", () => {
      const task = state.childTasks.find((item) => item.id === button.dataset.completeTask);
      if (task) task.status = "pendingReview";
      saveState();
      render();
    });
  });

  document.querySelectorAll("[data-approve-task]").forEach((button) => {
    button.addEventListener("click", () => {
      const task = state.childTasks.find((item) => item.id === button.dataset.approveTask);
      if (!task) return;
      task.status = "rewarded";
      const child = state.users.find((user) => user.id === task.ownerId);
      state.transactions.unshift({
        id: makeReadableId("TX"),
        amount: Number(task.reward || 0),
        type: "奖励",
        cycle: "个人变动",
        category: "任务奖励",
        tag: "孩子",
        event: "日常",
        owner: child?.name || task.childName || "孩子",
        ownerId: task.ownerId || null,
        countFamily: false,
        date: new Date().toISOString().slice(0, 10),
        note: task.title,
      });
      saveState();
      render();
    });
  });

  document.querySelectorAll("[data-reject-task]").forEach((button) => {
    button.addEventListener("click", () => {
      const task = state.childTasks.find((item) => item.id === button.dataset.rejectTask);
      if (task) task.status = "进行中";
      saveState();
      render();
    });
  });

  document.querySelectorAll("[data-reject-request]").forEach((button) => {
    button.addEventListener("click", () => {
      const request = state.childRequests.find((item) => item.id === button.dataset.rejectRequest);
      if (request) request.status = "rejected";
      saveState();
      render();
    });
  });

  document.querySelectorAll("[data-delete-family]").forEach((button) => {
    button.addEventListener("click", async () => {
      const familyId = button.dataset.deleteFamily;
      const active = currentUser();
      const family = currentFamily();
      if (!active || !familyId || active.role !== "creator") return;
      if (!confirm(`确认注销家庭「${family?.name || active.familyName}」（${familyId}）？所有家庭成员会一起从后台删除。`)) return;
      try {
        const result = await apiRequest(`/api/families/${familyId}`, {
          method: "DELETE",
        });
        removeFamilyFromState(result.deletedFamilyId || familyId);
        state.currentUserId = null;
        state.authToken = null;
        state.activePage = "dashboard";
        state.authMode = "login";
        state.lastCreated = null;
        saveState();
        render();
      } catch (apiError) {
        if (!isBackendUnavailable(apiError)) {
          alert(apiError.message);
          return;
        }
        alert("注销家庭需要后端服务运行，请启动后端后再操作。");
      }
    });
  });

  document.querySelectorAll("[data-member-role]").forEach((button) => {
    button.addEventListener("click", async () => {
      const userId = button.dataset.memberRole;
      const role = button.dataset.role;
      if (!userId || !role) return;
      try {
        const result = await apiRequest(`/api/members/${userId}/role`, {
          method: "PATCH",
          body: JSON.stringify({ role }),
        });
        applyRemoteState(result.state);
      } catch (apiError) {
        if (!isBackendUnavailable(apiError)) {
          alert(apiError.message);
          return;
        }
        const user = state.users.find((candidate) => candidate.id === userId);
        if (user && currentUser()?.role === "creator") user.role = role;
      }
      saveState();
      render();
    });
  });

  document.querySelectorAll("[data-transfer-creator]").forEach((button) => {
    button.addEventListener("click", async () => {
      const userId = button.dataset.transferCreator;
      const target = state.users.find((candidate) => candidate.id === userId);
      if (!target || !confirm(`确认将家庭创建者身份转移给 ${target.name}？当前创建者会变为管理员。`)) return;
      try {
        const result = await apiRequest(`/api/members/${userId}/transfer-creator`, {
          method: "PATCH",
        });
        applyRemoteState(result.state);
      } catch (apiError) {
        if (!isBackendUnavailable(apiError)) {
          alert(apiError.message);
          return;
        }
        const active = currentUser();
        if (active && active.role === "creator") {
          active.role = "admin";
          target.role = "creator";
          const family = currentFamily();
          if (family) family.creatorUserId = target.id;
        }
      }
      saveState();
      render();
    });
  });

  document.querySelectorAll("[data-remove-member]").forEach((button) => {
    button.addEventListener("click", async () => {
      const userId = button.dataset.removeMember;
      const target = state.users.find((candidate) => candidate.id === userId);
      if (!target || !confirm(`确认移除成员 ${target.name}？该账号将不能再登录这个家庭。`)) return;
      try {
        const result = await apiRequest(`/api/members/${userId}`, {
          method: "DELETE",
        });
        applyRemoteState(result.state);
      } catch (apiError) {
        if (!isBackendUnavailable(apiError)) {
          alert(apiError.message);
          return;
        }
        state.users = state.users.filter((user) => user.id !== userId);
      }
      saveState();
      render();
    });
  });

  const txForm = document.querySelector("#transaction-form");
  if (txForm) {
    const txDate = document.querySelector("#tx-date");
    if (txDate && !txDate.value) txDate.valueAsDate = new Date();
    const txType = document.querySelector("#tx-type");
    const txCategory = document.querySelector("#tx-category");
    const txCategories = document.querySelector("#tx-categories");
    if (txType && txCategory && txCategories) {
      txType.addEventListener("change", () => {
        txCategories.innerHTML = renderCategoryOptions(txType.value);
        txCategory.placeholder = categoryPlaceholderForType(txType.value);
      });
    }
    const recurringToggle = document.querySelector("#tx-recurring");
    const recurringFields = document.querySelector("#recurring-fields");
    const updateRecurringFields = () => {
      if (recurringFields) recurringFields.style.display = recurringToggle?.checked ? "grid" : "none";
    };
    if (recurringToggle) {
      recurringToggle.addEventListener("change", updateRecurringFields);
      updateRecurringFields();
    }
    txForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const ownerId = document.querySelector("#tx-owner").value;
      const owner = state.users.find((user) => user.id === ownerId);
      const editingId = state.editingTransactionId;
      const existingIndex = state.transactions.findIndex((tx) => tx.id === editingId);
      const tx = {
        id: editingId && existingIndex >= 0 ? editingId : makeReadableId("TX"),
        amount: Number(document.querySelector("#tx-amount").value),
        type: document.querySelector("#tx-type").value,
        cycle: document.querySelector("#tx-cycle").value,
        category: document.querySelector("#tx-category").value.trim(),
        tag: document.querySelector("#tx-tag").value.trim(),
        event: document.querySelector("#tx-event").value.trim() || "日常",
        owner: owner?.name || currentUser().name,
        ownerId: owner?.id || currentUser().id,
        countFamily: document.querySelector("#tx-family").checked,
        date: document.querySelector("#tx-date").value,
        note: document.querySelector("#tx-note").value.trim(),
      };
      if (editingId && existingIndex >= 0) {
        state.transactions[existingIndex] = { ...state.transactions[existingIndex], ...tx };
        state.editingTransactionId = null;
      } else {
        state.transactions.unshift(tx);
        if (document.querySelector("#tx-recurring")?.checked) {
          const frequency = document.querySelector("#tx-recurring-frequency").value;
          state.recurringBills.unshift({
            ...tx,
            id: makeReadableId("RB"),
            name: document.querySelector("#tx-recurring-name").value.trim() || `${tx.category}固定账单`,
            frequency,
            nextDate: advanceRecurringDate(tx.date, frequency),
            sourceTransactionId: tx.id,
          });
        }
      }
      saveState();
      render();
    });
  }

  document.querySelectorAll("[data-edit-transaction]").forEach((button) => {
    button.addEventListener("click", () => {
      state.editingTransactionId = button.dataset.editTransaction;
      saveState();
      render();
    });
  });

  const cancelEditTransaction = document.querySelector("[data-cancel-edit-transaction]");
  if (cancelEditTransaction) {
    cancelEditTransaction.addEventListener("click", () => {
      state.editingTransactionId = null;
      saveState();
      render();
    });
  }

  document.querySelectorAll("[data-remove-recurring]").forEach((button) => {
    button.addEventListener("click", () => {
      state.recurringBills = state.recurringBills.filter((bill) => bill.id !== button.dataset.removeRecurring);
      saveState();
      render();
    });
  });

  const budgetForm = document.querySelector("#budget-form");
  if (budgetForm) {
    budgetForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const type = document.querySelector("#budget-type").value;
      state.budgets.unshift({
        id: makeReadableId("BD"),
        name: document.querySelector("#budget-name").value.trim(),
        total: Number(document.querySelector("#budget-total").value),
        used: 0,
        type,
        category: document.querySelector("#budget-category").value.trim(),
        period: currentBudgetPeriod(type),
      });
      saveState();
      render();
    });
  }

  document.querySelectorAll("[data-cancel-budget]").forEach((button) => {
    button.addEventListener("click", () => {
      const budget = state.budgets.find((item) => item.id === button.dataset.cancelBudget);
      if (!budget || !confirm(`确认取消预算「${budget.name}」？相关账单不会被删除。`)) return;
      state.budgets = state.budgets.filter((item) => item.id !== budget.id);
      saveState();
      render();
    });
  });

  const aiSettingsForm = document.querySelector("#ai-settings-form");
  if (aiSettingsForm) {
    aiSettingsForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!isManagerRole()) {
        alert("只有家庭创建者或管理员可以修改 AI API 接入设置。");
        return;
      }
      state.aiSettings = {
        endpoint: document.querySelector("#ai-endpoint").value.trim(),
        promptType: document.querySelector("#ai-prompt-type").value,
        publicPrompt: document.querySelector("#ai-public-prompt").value.trim() || defaultAiSettings.publicPrompt,
      };
      state.aiAdvice = null;
      saveState();
      render();
    });
  }

  const refreshAi = document.querySelector("#refresh-ai");
  if (refreshAi) {
    refreshAi.addEventListener("click", async () => {
      refreshAi.disabled = true;
      refreshAi.textContent = "生成中...";
      await generateAiAdvice({ audience: refreshAi.dataset.aiAudience || "adult" });
    });
  }

  const allowanceForm = document.querySelector("#allowance-form");
  if (allowanceForm) {
    allowanceForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const childId = document.querySelector("#allowance-child").value;
      const child = state.users.find((user) => user.id === childId);
      const amount = Number(document.querySelector("#allowance-amount").value);
      const reason = document.querySelector("#allowance-reason").value.trim();
      state.transactions.unshift({
        id: makeReadableId("TX"),
        amount,
        type: "转账",
        cycle: "个人/资产变动",
        category: "零花钱发放",
        tag: "孩子",
        event: "日常",
        owner: child?.name || "孩子",
        ownerId: childId,
        countFamily: false,
        date: new Date().toISOString().slice(0, 10),
        note: reason,
      });
      saveState();
      render();
    });
  }

  const guardianTaskForm = document.querySelector("#guardian-task-form");
  if (guardianTaskForm) {
    guardianTaskForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const childId = document.querySelector("#task-child").value;
      const child = state.users.find((user) => user.id === childId);
      state.childTasks.unshift({
        id: makeReadableId("TASK"),
        ownerId: childId,
        childName: child?.name || "孩子",
        title: document.querySelector("#task-title").value.trim(),
        reward: Number(document.querySelector("#task-reward").value),
        status: "进行中",
      });
      saveState();
      render();
    });
  }

  const childTransactionForm = document.querySelector("#child-transaction-form");
  if (childTransactionForm) {
    document.querySelector("#child-tx-date").valueAsDate = new Date();
    childTransactionForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const user = currentUser();
      const childCycle = document.querySelector("#child-tx-cycle").value;
      const isFamilyExpense = childCycle === "familyExpense";
      state.transactions.unshift({
        id: makeReadableId("TX"),
        amount: Number(document.querySelector("#child-tx-amount").value),
        type: document.querySelector("#child-tx-type").value,
        cycle: isFamilyExpense ? "真实消费" : "个人变动",
        category: document.querySelector("#child-tx-category").value.trim(),
        tag: document.querySelector("#child-tx-tag").value.trim(),
        event: "日常",
        owner: user.name,
        ownerId: user.id,
        countFamily: isFamilyExpense && document.querySelector("#child-tx-family").checked,
        date: document.querySelector("#child-tx-date").value,
        note: document.querySelector("#child-tx-note").value.trim(),
      });
      saveState();
      render();
    });
  }

  const childRequestForm = document.querySelector("#child-request-form");
  if (childRequestForm) {
    childRequestForm.addEventListener("submit", (event) => {
      event.preventDefault();
      state.childRequests.unshift({
        id: makeReadableId("REQ"),
        ownerId: currentUser().id,
        childName: currentUser().name,
        title: document.querySelector("#request-title").value.trim(),
        amount: Number(document.querySelector("#request-amount").value),
        reason: document.querySelector("#request-reason").value.trim(),
        status: "pending",
      });
      saveState();
      render();
    });
  }

  const savingGoalForm = document.querySelector("#saving-goal-form");
  if (savingGoalForm) {
    savingGoalForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const user = currentUser();
      state.savingGoals.unshift({
        id: makeReadableId("GOAL"),
        ownerId: user.id,
        name: document.querySelector("#goal-name").value.trim(),
        target: Number(document.querySelector("#goal-target").value),
        saved: Number(document.querySelector("#goal-saved").value || 0),
      });
      saveState();
      render();
    });
  }

  document.querySelectorAll("[data-complete-goal]").forEach((button) => {
    button.addEventListener("click", () => {
      const goal = state.savingGoals.find((item) => item.id === button.dataset.completeGoal);
      if (goal) goal.saved = goal.target;
      saveState();
      render();
    });
  });
}

applyDueRecurringTransactions();
render();
syncBackendState();
