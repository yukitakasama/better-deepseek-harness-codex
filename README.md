# 更好的 deepseek harness（codex 风格）

[English](README.en.md) | 简体中文

面向 **Coding 用户**的 DeepSeek Harness 整合包，向 Codex 的风格与功能看齐。
基座 **DSH 0.2.0-rc.2**。

> 整合包标识 `better-deepseek-harness-codex`（仓库名 / `.dspack` 前缀 / profile 名）。
> 社区整合包，非 DeepSeek 官方产品。

## 装什么

一条命令拿到完整的 Codex 式编码工作台：

- **Codex 风格界面** —— 工作区会话树、全局搜索、轮次跳转、会话重命名/归档/分叉
- **代码审查与简化** —— `/review` 调独立子 Agent 审代码，`/simplify` 按 Git 变更范围简化
- **只读旁问** —— 基于当前上下文单独提问，不打断主任务
- **思考强度滑块** —— 推理等级换成 Codex 风格连续滑块，带动效
- **费用与余额** —— 本会话/当日费用、90+ 模型价格、11 家 Coding Plan 额度
- **桌宠** —— DeepSeek 娘鲸鱼女仆，报开工收工与单轮花费
- **上下文守卫** —— AST 压缩、测试日志过滤、token 预算
- **Git 图** —— 分支选择与提交图
- **多智能体协作** —— agent-teams 多 Agent 团队协作；dsh-agent-arena 多智能体议事厅与提示词竞技场（可调协作栏、渠道限流、自动接话）
- **上下文仪表盘** —— dsh-context 上下文可视化
- **子代理选模型** —— subagent-director 为每个子代理独立指定模型
- **循环守护** —— loop-guard 检测模型空转退化循环，自动打断并注入纠正提示
- **跨会话记忆** —— mneme 让 agent 记住项目背景与既往决策
- **视觉理解** —— modlens 视觉桥，截图/图片路由到视觉模型理解
- **内嵌配图** —— inline-figures 让回答变成「文字-图-文字」
- **Prompt 工具箱** —— dsh-prompt 24 条深度模板随手点选
- **动态壁纸** —— Wallpaper Engine 壁纸搬进 DSH 网页界面
- **额度上限** —— key-limits 显示 API key / 订阅剩余额度（与 cost-meter 互补）
- **Computer Use** —— 操控 Windows 原生桌面：UIA 无障碍树观察、截图、鼠标键盘、窗口管理（22 个工具）
- **自带 47 个 skill** —— 安装即落入 `DSH_HOME/skills/`，开箱即用（覆盖设计/前端、动效、数据分析、代码开发、办公文档、浏览器等；MCP 服务器本次未随包分发，按本机 `cordis.patch.yml` 单独配置）

## 安装

需要 **DSH 0.2.0-rc.2**（本包 `dshVersion` 精确锁定该版本；同时声明兼容 0.2.0-rc.1）。

```bash
dsh --profile better-deepseek-harness-codex
```

或由 DSH 启动器导入 `.dspack`。

> **注意**：自 v2.2.0 起，`dsh-agent-arena` 以 git fork 依赖（`github:yukitakasama/dsh-agent-arena#25e2c55`）
> 引入，安装时需能访问 GitHub。上游发布面向 0.2.0-rc.2 的官方版本后将改回 npm registry 版本。

## v2.0.0 变更说明

### 重大变更
- **基座升级**：从 DSH 0.1.7-rc.2 升级到 0.2.0-rc.2
- **移除插件**：dsh-plugin-edit-message（无 0.2.x 兼容版本）
- **全部插件更新**：10 个插件全部更新到支持 0.2.0-rc.2 的最新版本

### 插件清单变更（10 个，全部钉死精确版本）

| 插件 | v1.1.0 版本 | v2.0.0 版本 | 变化 |
|---|---|---|---|
| `@michengai/dsh-codex-ui` | 1.1.18 | 1.1.25 | ↑ 7 个小版本 |
| `@michengai/dsh-code-review` | 0.1.7 | 0.1.9 | ↑ 2 个小版本 |
| `@michengai/dsh-simplify` | 0.1.10 | 0.1.12 | ↑ 2 个小版本 |
| `@michengai/dsh-btw` | 0.1.13 | 0.1.15 | ↑ 2 个小版本 |
| `dsh-effort-slider` | 1.2.0 | 1.3.1 | ↑ 次版本 |
| `dsh-cost-meter` | 1.7.37 | 1.7.47 | ↑ 10 个小版本 |
| `dsh-whale-girl-pet` | 0.3.4 | 0.3.7 | ↑ 3 个小版本 |
| `@goodandready/dsh-context-lens` | 0.1.24 | 0.1.28 | ↑ 4 个小版本 |
| `@linxin666/dsh-client-ui-git-graph` | 0.4.2 | 0.4.4 | ↑ 2 个小版本 |
| `dsh-computer-use-win` | 0.1.2 | 0.2.3 | ↑ 次版本 + 1 个小版本 |
| ~~`dsh-plugin-edit-message`~~ | ~~0.1.5~~ | **已移除** | 无 0.2.x 兼容版本 |

### 新增字段（manifest v5）
- `dshVersions`: 声明实测兼容版本集合（0.2.0-rc.2、0.2.0-rc.1）
- `launchers`: 声明启动器兼容性（dshl、dsh-packforge-app）

## 插件清单（22 个）

| 插件 | 版本 | 作用 |
|---|---|---|
| `@michengai/dsh-codex-ui` | 1.1.25 | Codex 风格侧栏、工作区会话树、全局搜索、轮次导航 |
| `@michengai/dsh-code-review` | 0.1.9 | `/review` 独立子 Agent 代码审查 |
| `@michengai/dsh-simplify` | 0.1.12 | `/simplify` Git 范围代码简化 |
| `@michengai/dsh-btw` | 0.1.15 | 只读旁问，不打断主任务 |
| `dsh-effort-slider` | 1.3.1 | Codex 风格思考强度连续滑块 |
| `dsh-cost-meter` | 1.7.47 | 费用统计、模型价格、Coding Plan 额度、余额 |
| `dsh-whale-girl-pet` | 0.3.7 | DeepSeek 娘鲸鱼女仆桌宠 |
| `@goodandready/dsh-context-lens` | 0.1.28 | AST 上下文压缩、token 预算守卫 |
| `@linxin666/dsh-client-ui-git-graph` | 0.4.4 | Git 分支图 |
| `dsh-computer-use-win` | 0.2.3 | Windows Computer Use 桌面操控（22 工具） |
| `@nanmicoder/dsh-agent-teams` | 0.1.22 | 多智能体团队协作 |
| `dsh-context` | 0.63.0 | 上下文可视化仪表盘 |
| `dsh-plugin-subagent-director` | 0.5.5 | 子代理独立选模型 |
| `dsh-agent-arena` | 0.6.0（fork `25e2c55`） | 多智能体议事厅与提示词竞技场 |
| `@mrweicodes/dsh-loop-guard` | 1.0.8 | 思考循环守护，自动打断空转 |
| `@modusensus/dsh-mneme` | 0.8.13 | 跨会话长期记忆 |
| `@liustack/modlens` | 3.26.6 | 视觉桥与截图理解 |
| `dsh-inline-figures` | 0.1.0 | 回答内嵌矢量图 |
| `dsh-prompt` | 0.3.0 | Prompt 模板工具箱 |
| `dsh-plugin-wallpaper-engine` | 1.2.0 | Wallpaper Engine 动态壁纸 |
| `@goodandready/dsh-key-limits` | 0.2.19 | API key / 订阅额度上限 |
| `@tencent-connect/dsh-qqbot` | 0.5.0 | QQ 机器人频道（腾讯官方）：私聊/群聊对话、图片与文件理解、流式回复、主动提问与操作确认、/preset 切换预设、/compact 压缩会话 |

### Computer Use 说明

`dsh-computer-use-win` 通过 DSH 内置的 `@deepseek-ai/dsh-mcp-client` 桥接一个
MCP stdio 服务器，工具以 `mcp__wincu__windows_computer_use_*` 出现：

- **看**：UIA 无障碍树（`control`/`content`/`raw` 三视图）、窗口裁剪截图
  （PrintWindow → WGC → 屏幕区域三级回退）、OCR 词框
- **做**：鼠标（标准/双击/拖拽/滚动）、键盘、UIA 语义动作、窗口管理
- **安全**：急停 failsafe（鼠标停屏幕角落 500ms 拒所有输入）、前台校验
  fail-closed、identity guard（HWND/PID 变化即拒）、Win 键组合黑名单

零运行时依赖（纯 Node 内置模块 + PowerShell/C# UIA 后端）。

> **本包已修正该插件的 MCP 路径 bug**（见下），否则它在本整合包内无法启动。

## 已知上游 bug 与修正

### `dsh-computer-use-win@0.1.2` 的 MCP 路径解析

该插件自带的 `cordis.patch.yml` 用 `new URL('mcp/server.mjs', baseUrl)` 定位自己的
MCP 服务器，注释里假设 `baseUrl` 是**该 patch 文件所在目录**。但 dsh 实际把
`baseUrl` 设为 **profile 根目录**：

```js
// dsh-app-boot: ctx.baseUrl = pathToFileURL(dirname(absoluteConfigPath)).href + "/"
```

**后果**：单包 profile 下恰好能跑（包目录 ≈ profile 根），但在多插件 profile 里
解析成 `<profile>/mcp/server.mjs` → `MODULE_NOT_FOUND`，MCP 起不来，模型看不到
`mcp__wincu__*` 工具。实测 boot 日志报错即为此。

**本包修法**：在 profile patch 层覆盖该行的 `args`，改用相对 profile 根
（即 `node_modules` 所在处）的路径：

```yaml
- id: mcp-dsh-computer-use-win
  name: "@deepseek-ai/dsh-mcp-client"
  config:
    serverName: wincu
    transport: stdio
    command: !!js process.execPath
    args:
      - !!js "process.getBuiltinModule('node:url').fileURLToPath(new URL('node_modules/dsh-computer-use-win/mcp/server.mjs', baseUrl))"
    toolCallTimeoutMs: 60000
    failOnStartupError: false
```

修复后 boot 日志出现 `windows-computer-use MCP server 0.1.2 ready`。
若上游修好此 bug，可以删掉这条补丁。

## 选型说明

### 兼容性判定

DSH 用 `semver.satisfies(版本, peer范围, { includePrerelease: true })` 校验，所以：

- `>=0.1.0-rc.5 <0.2.0` 这类宽范围 **匹配** rc.2；
- 钉死精确版本（如 `0.1.7-rc.1`）的插件在 rc.2 上会**硬失败**，本包一律不选。

本包 21 个插件的 peerDependencies 全部通过 rc.2 自带的
`evaluatePluginCompatibility()` 实测，21/21 无阻断（`docs/compat-check.cjs` 门禁）。

### 冲突排除

- `@michengai/dsh-codex-ui` 会接管官方 `ui-sidebar` 与 `ui-settings-general`
  并自行重建；它同时**重新提供** `sidebar.footer.action` 与 `settings.section`，
  因此 `dsh-cost-meter` 的余额卡片和桌宠的设置分区仍有落点。
- 桌宠走浮动浮层，不争抢侧栏插槽。
- **没有**装 `dsh-better-sidebar` / `dsh-coding-sidebar`——与 codex-ui 抢同一侧栏位置。
- **没有**装 `dsh-prompt-history`——↑↓ 召回历史输入已由 codex-ui 自带。
- 桌宠只选 1 个（候选池 10+ 个全部抢同一浮层）。
- 层栈中 codex-ui 排在**最后**，确保它的插槽接管生效于其他插件注册之后。

## 验证（需在 DSH 0.2.0-rc.2 环境下重新验证）

| 测试 | v1.1.0 结果 | v2.0.0 状态 |
|---|---|---|
| 规格校验（pack-structure v3 + manifest v5 硬约束） | 30/30 PASS | 待验证 |
| `evaluatePluginCompatibility()` 实测 | 11/11 无阻断 | 待验证（10 个插件） |
| `pnpm install` 全量解析 | 成功，11 插件就位 | 待验证 |
| `dsh --dump-config` | exit 0，1303 行，零 stderr | 待验证 |
| 真实启动 web 服务 | 成功监听，插件正常初始化 | 待验证 |
| Computer Use MCP 服务器启动 | `windows-computer-use MCP server 0.1.2 ready` | 待验证（0.2.3） |
| 插件 MCP self-test（独立验证） | UIA 树 + 截图均 OK（2560×1600） | 待验证 |

## 自定义

profile patch 层 `overrides/cordis.patch.yml` 为空数组 `[]`——挂载关系已由各插件
自身的 bundle patch 完整表达。改动后请跑：

```bash
dsh --profile better-deepseek-harness-codex --dump-config
```

> patch 对已存在条目是**逐键覆盖**而非深合并：只带 `config:` 不会清掉 `disabled`，
> 但写了 `disabled:` 会整体替换。

## 许可与致谢

本整合包仅为插件组合与配置，不含上述插件的源码。各插件版权归其作者所有：

- [MichengAI](https://github.com/MichengAI)（Codex UI / Code Review / Simplify / BTW）
- [goodandready](https://www.npmjs.com/~goodandready)（Context Lens）
- [linxin666](https://www.npmjs.com/~linxin666)（Git Graph）
- `dsh-effort-slider`、`dsh-cost-meter`、`dsh-whale-girl-pet`、`dsh-computer-use-win` 各作者

格式规范：[DSH-PackForge](https://github.com/DSH-PackForge/DSH-PackForge)。

## 更新日志

### v2.5.0 (2026-10-06)
- **整合包自带 47 个 skill**（v2.5.0 起）：dspack 携带 `home/skills/`，安装时落入 `DSH_HOME/skills/`，开箱即用，不再依赖各 harness 本地目录。
- **47 个 skill**：覆盖设计/前端、动效、数据分析、代码开发、媒体、规划效率、打包、办公文档（docx/pdf/pptx/xlsx/research）、浏览器（agent-browser）及新建的 `qq-chat-style-miner`（从 QQ 聊天记录提炼用户风格）。选择标准：仅通用、可广泛改善体验的 skill；项目级与纯本机自动化类已排除。
- **MCP 服务器本次未随整合包分发**：维持 `overrides/cordis.patch.yml` 原有 1 条 computer-use 修正，不含任何 MCP 条目；如需扩展 MCP 请在 DSH Launcher 的 MCP 管理页单独配置。
- 基座与插件组合同 v2.4.0（DSH 0.2.0-rc.2，含 `@tencent-connect/dsh-qqbot@0.5.0`）；`scripts/build-dspack.py` 已更新为携带 `home/skills/`。

### v2.4.0 (2026-10-05)
- **新增**：`@tencent-connect/dsh-qqbot@0.5.0` —— QQ 机器人频道（腾讯官方插件）：把 QQ Bot 接入 DSH，支持私聊/群聊对话、图片与文件理解、流式回复、主动提问与操作确认、/preset 切换预设、/compact 压缩会话、/bot-ping 网络检测。
- **适配判定**：peer `@deepseek-ai/dsh-agent/llm/session: >=0.1.0-rc.6` 与 `cordis: >=4.0.1` 均覆盖 0.2.0-rc.2（cordis 4.x 基线同 agent-arena fork）。npm 已发布 0.5.0，**无需 fork**，直接钉 npm 版本。
- **验证**：`docs/compat-check.cjs` peer 门禁 dsh-qqbot 4/4 ✅；`npm install @tencent-connect/dsh-qqbot@0.5.0` 可下载、自带 `cordis.patch.yml`（dsh 启动自动加载）、传递依赖就位。全量 `pnpm install` + `dsh --dump-config` 真机加载因沙箱无法克隆 git fork（github.com TLS 限制）未能实跑，需在用户 0.2.0-rc.2 宿主确认（与本包既往版本同因）。
- 插件总数 21 → 22（bundles 23 → 24 含 2 个官方基座；dependencies 21 → 22）。

### v2.3.0 (2026-10-05)
- **新增 7 个插件**（经交互式选型器勾选，peer 门禁全过 + 真机 `dsh --dump-config` 零 stderr）：
  - `@mrweicodes/dsh-loop-guard@1.0.8` —— 思考循环守护
  - `@modusensus/dsh-mneme@0.8.13` —— 跨会话长期记忆
  - `@liustack/modlens@3.26.6` —— 视觉桥与截图理解
  - `dsh-inline-figures@0.1.0` —— 回答内嵌矢量图
  - `dsh-prompt@0.3.0` —— Prompt 模板工具箱
  - `dsh-plugin-wallpaper-engine@1.2.0` —— Wallpaper Engine 动态壁纸（npm 最新为 1.2.0，repo 的 1.3.0 未发布）
  - `@goodandready/dsh-key-limits@0.2.19` —— API key / 订阅额度上限（npm 已到 0.2.19，高于 repo 的 0.2.15）
- **移除**：`dsh-edit-resend@0.1.0` —— npm 发布产物声明 peer `^0.1.0-rc.6`，
  0.2.0-rc.2 下被 runtime 拒装（v2.1.0 时按 GitHub 源码判定「无 peer」有误，真机实测修正）
- **修复**：仓库 `package.json` 自 v2.1.0 起落后于 manifest（缺 4 个插件），本次全量重同步；
  manifest 中 codex-ui 重复条目一并清理（保持层栈末位唯一）
- 插件总数 15 → 21，依赖 14 → 21；`pnpm-workspace.yaml` 补录新插件 `minimumReleaseAgeExclude`
- 真机验证：`dsh --dump-config` exit 0、零 stderr，23 bundle 全部加载（隔离安装 @deepseek-ai/dsh@0.2.0-rc.2 实测）

### v2.2.0 (2026-10-05)
- **新增**：dsh-agent-arena —— 多智能体议事厅与提示词竞技场（可调协作栏、渠道限流、自动接话控制）
- **兼容性处理**：上游 `Tikzen/dsh-agent-arena@0.6.0` 把核心 peer 精确锁定 `0.1.7-rc.2`，
  无法在 DSH 0.2.0-rc.2 下安装；经授权采用 **fork 放宽**方案——
  `yukitakasama/dsh-agent-arena@feat/relax-peers-0.2.0-rc.2`（commit `25e2c55`），
  10 条核心 peer 由精确 `0.1.7-rc.2` 放宽为 `>=0.1.7-rc.2`，依赖精确钉到该 fork commit
- **注意**：安装需可访问 GitHub（git fork 依赖）；上游出 0.2.0-rc.2 官方版后建议改回 npm 版本
- `.gitignore` 新增忽略 `.workbuddy/`（本地记忆目录）

### v2.1.0 (2026-10-04)
- **新增 4 个社区插件**（全部 peer 兼容 0.2.0-rc.2，`docs/compat-check.cjs` 门禁通过）：
  - `@nanmicoder/dsh-agent-teams@0.1.22` —— 多智能体团队协作
  - `dsh-context@0.63.0` —— 上下文可视化仪表盘
  - `dsh-plugin-subagent-director@0.5.5` —— 子代理独立选模型
  - `dsh-edit-resend@0.1.0` —— 消息编辑重发，补回早前移除的 edit-message 缺口
- 插件总数 12 → 16（bundles），依赖 10 → 14，全部钉死精确版本；同步更新中英文 description
- 新增 `docs/`：插件调研报告、交互式选型器（`plugin-selector.html`）、兼容性测试脚本（`compat-check.cjs`）与结果

### v2.0.0 (2026-09-30)
- **破坏性变更**：升级基座到 DSH 0.2.0-rc.2
- **移除**：dsh-plugin-edit-message（无 0.2.x 兼容版本）
- **更新**：全部 10 个插件更新到最新版本并验证兼容性
- **新增**：manifest 增加 `dshVersions` 和 `launchers` 字段（v5 规范）
- **改名**：整合包更名「更好的 deepseek harness（codex 风格）」；标识/仓库名/`.dspack`
  前缀/profile 名统一为 `better-deepseek-harness-codex`

### v1.1.0
- 新增 Windows Computer Use 支持

### v1.0.0
- 初始发布，基于 DSH 0.1.7-rc.2
