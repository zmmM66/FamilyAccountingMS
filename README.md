# 家庭记账管理系统

一个面向家庭协作场景的记账管理系统。系统围绕家庭成员身份、收支记录、预算管理、统计图表、AI 分析、孩子财商练习和系统后台管理展开，适合作为金融科技课程项目展示。

## 核心功能

- 家庭创建与登录：支持创建家庭、加入家庭、登录、忘记密码和验证码校验。
- 角色权限：包含家庭创建者、管理员、普通成员、孩子和系统管理员。
- 成员管理：创建者/管理员可审批加入申请、移除成员、重置密码；创建者可任免管理员、转让创建者身份和注销家庭。
- 系统后台：独立系统管理员账号可查看和维护后端 SQLite 中的家庭、用户和密码找回申请，并可注销任意家庭。
- 收支记录：支持收入、支出、转账、还款、投资、奖励等账单类型，并可设置是否计入家庭统计。
- 收支统计：支持个人统计、家庭统计、收入/支出/结余概览、趋势图、结构图、排行图和分类图表。
- 预算管理：支持月度、周度、分类和活动预算，并根据账单自动计算使用进度。
- AI 分析：创建者和管理员可配置 AI API 代理与家庭提示词；普通成员和孩子只能使用已配置能力获取建议。未配置 API 时使用本地规则建议兜底。
- 孩子端：包含记录收支、查看收支、任务目标、消费申请、储蓄目标和 AI 分析。
- 登录页介绍：登录页下滑展示系统功能说明与使用教程海报。

## 角色说明

- 家庭创建者：拥有家庭最高权限，可管理成员、预算、账单、AI 设置和注销家庭。
- 管理员：协助创建者处理成员审批、账单、预算、孩子请求和 AI 使用。
- 普通成员：可记录自己的收支，查看个人/家庭统计和预算执行情况，但不能管理成员或修改 AI 接入设置。
- 孩子：只能进入孩子端功能，管理自己的消费、奖励、任务、申请和储蓄目标。
- 系统管理员：独立后台账号，不属于任何家庭，只管理后端持久化的家庭、用户和密码找回数据。

## 系统管理员

本地课程项目默认启用系统管理员账号：

```text
账号：ADMIN_
密码：ADMIN_PASSWORD
```

公开上传或演示时建议通过环境变量覆盖默认账号和密码。可以复制 `.env.example` 作为本地配置参考：

```powershell
copy .env.example .env
```

PowerShell 示例：

```powershell
$env:FAMILY_LEDGER_ADMIN_ID="ADMIN_"
$env:FAMILY_LEDGER_ADMIN_PASSWORD="ChangeMe123"
$env:FAMILY_LEDGER_TOKEN_SECRET="replace-with-a-long-random-secret"
python backend/server.py
```

## 运行方式

本项目目前只使用 Python 标准库，不依赖第三方 pip 包。推荐直接启动后端服务，后端会同时提供 API 和前端静态页面：

```powershell
python backend/server.py
```

浏览器打开：

```text
http://127.0.0.1:8001
```

如果只想查看纯前端页面，也可以使用：

```powershell
python -m http.server 5173 -d frontend
```

通过 `5173` 打开的页面会自动尝试连接 `http://127.0.0.1:8001` 的后端 API。

## 数据说明

- 后端 SQLite 数据库会在首次运行时自动创建，默认位置为 `data/app.db`。
- Token 签名密钥默认保存在 `data/.token_secret`，也可以通过 `FAMILY_LEDGER_TOKEN_SECRET` 环境变量指定。
- `data/app.db` 和 `data/.token_secret` 属于本地运行数据，已通过 `.gitignore` 排除，不应提交到 Git。
- 后端当前持久化家庭、用户、密码找回申请，以及收支、预算、孩子任务、消费申请、储蓄目标和周期账单等 JSON 状态数据。
- 前端仍会使用浏览器 `localStorage` 缓存部分界面状态，键名为 `family-ledger-state-v3`。

## 常用检查命令

```powershell
node --check frontend/app.js
python -m py_compile backend/server.py
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8001/api/health
```

## 项目结构

```text
frontend/index.html                  前端入口
frontend/app.js                      前端核心功能逻辑
frontend/styles.css                  全站样式与主题
frontend/assets/system-guide-poster.png  登录页功能教程海报
backend/server.py                    后端 API、认证、SQLite 与静态页面服务
data/.gitkeep                        保留运行数据目录，实际数据库不提交
DESIGN.md                            UI 设计说明
.env.example                         本地环境变量示例
.gitignore                           Git 忽略规则
requirements.txt                     Python 依赖说明
```

## 后续可扩展方向

- 将收支记录、预算、孩子任务、消费申请、储蓄目标等继续迁移到后端数据库，实现多设备同步。
- 增加真实 AI 后端代理，统一处理密钥、提示词模板、隐私过滤和调用日志。
- 增加账单导出、月度报告、预算预警、家庭活动复盘和更细粒度的权限审计。
- 完善生产级安全能力，例如 HTTPS、审计日志、备份恢复、异常登录告警和更严格的后台操作确认。
