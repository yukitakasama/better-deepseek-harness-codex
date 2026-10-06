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
- **WorkBuddy 模型接入** —— dsh-workbuddy-connect 复用 WorkBuddy 桌面 App 的登录态，GLM-5.3、DeepSeek-V4、Kimi-K3、MiniMax-M3、Hy3 等直接出现在模型选择器中，零配置；国内版与国际版各成一个分组，**本机没装/没登录 WorkBuddy 时该分组自动隐藏，不影响启动**
- **自带 49 个 skill** —— 安装即落入 `DSH_HOME/skills/`，开箱即用（覆盖设计/前端、动效、数据分析、代码开发、办公文档、浏览器等；MCP 服务器本次未随包分发，按本机 `cordis.patch.yml` 单独配置）

## 安装

需要 **DSH 0.2.0-rc.2**（本包 `dshVersion` 精确锁定该版本；同时声明兼容 0.2.0-rc.1）。

```bash
dsh --profile better-deepseek-harness-codex
```

或由 DSH 启动器导入 `.dspack`。

> **注意**：自 v2.2.0 起，`dsh-agent-arena` 以 git fork 依赖（`github:yukitakasama/dsh-agent-arena#25e2c55`）
> 引入，安装时需能访问 GitHub。上游发布面向 0.2.0-rc.2 的官方版本后将改回 npm registry 版本。

> **WorkBuddy 模型的前提**：自 v2.7.0 起本包带 `dsh-workbuddy-connect`，它复用 WorkBuddy 桌面 App
> 的**本机登录态**，所以要看到 WorkBuddy 模型分组，需要先安装并登录 WorkBuddy（国内版或国际版
> WorkBuddy AI 均可）。**没装也不影响本包启动**——对应分组直接隐藏，其余插件照旧。详见下方
> 「WorkBuddy 模型接入」。

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

## 插件清单（24 个）

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
| `dsh-computer-use` | fork `72f390a` | **Codex 风格 Computer Use**：13 个 window2 原生工具（+3 个 DSH 扩展）、可见合成光标与状态药丸、Esc 急停、按应用授权。挂在**独立的 `computer-use` preset** 里，普通编码会话拿不到鼠标。详见下方「Codex 风格 Computer Use」 |
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
| `@tencent-connect/dsh-qqbot` | fork 0.5.1 | QQ 机器人频道：**默认关闭、按需启用**。私聊/群聊对话、图片与文件理解、流式回复、主动提问与操作确认、/preset 切换预设、/compact 压缩会话。启用方式见下方「QQ 机器人频道（im-qqbot）」 |
| `dsh-workbuddy-connect` | 0.7.1 | **WorkBuddy 桌面端模型接入**：复用 WorkBuddy App 的本机登录态，把 GLM-5.3、DeepSeek-V4、Kimi-K3、MiniMax-M3、Hy3 等送进 DSH 模型选择器，零配置调用；国内版与国际版分组并存、各用自己的账号与积分，未登录则分组隐藏。详见下方「WorkBuddy 模型接入」 |

### Codex 风格 Computer Use（dsh-computer-use）

上游： [wushi2333/dsh-computer-use_codex-style](https://github.com/wushi2333/dsh-computer-use_codex-style)，
按提交精确钉死（`#72f390a`），**未做任何源码修改**。

它把能力拆成两个平面，本包两层都接上了：

| 平面 | 行 | 由谁提供 |
|---|---|---|
| HOST（进程级桌面 sidecar：指针、覆盖层、截图、批准、回合生命周期） | `computer-use` | 插件自带的 `cordis.patch.yml` |
| PRESET（13 个 window2 工具） | `tool-computer-use` | **本包的 `overrides/cordis.patch.yml`** |

**为什么整合包要补第二层**：上游插件只带 HOST 那一行——它的注释写明
「Tools stay in the user agent preset so standard coding sessions do not get the mouse」。
工具行必须挂在 agent preset 里才对模型可见，所以本包新增了一个 **`computer-use` preset**：

> **普通编码会话（standard / ptc）永远不会拿到鼠标**；只有显式选「Computer Use」
> preset 新建的会话才有桌面工具。

技术细节：这一层用 `- insert:` **新增**一个 preset，而不是往 `preset-standard` 里塞行。
loader patch 对已存在的 preset 条目是「整体替换它的 `plugins` 数组」而非追加——实测
只要对 `preset-standard` 写一次 `config.plugins`，标准 preset 的 32 行会被压缩成你写的
那几行，等于废掉整个默认工作台。新增 preset 则完全不碰既有预设（实测四个官方 preset
行数不变）。

> **不要在同一会话里同时驱动桌面**：`dsh-computer-use-win`（22 工具的 extension 方案）
> 与本插件可以共存，工具名与挂载方式都不同，但两套指针/覆盖层同时跑会互相打架。
> 日常桌面操控建议只用其中一个。

随包投递 `computer-use` 与 `computer-use-browser` 两个 skill（落入 `DSH_HOME/skills/`）。

### QQ 机器人频道（im-qqbot）

本插件**默认关闭**。原因是原版在凭据缺失时会于插件加载阶段同步等待扫码，而那个
Promise 没有超时、二维码过期只会不断刷新——cordis 串行加载插件，于是整个 dsh 实例
永远停在「等待就绪」（启动器表现为启动窗口一直转圈、Web 服务始终不监听）。

本包已改用 fork 版 `yukitakasama/dsh-qqbot`（凭据缺失时跳过而非阻塞），并默认保持
关闭：需要时再打开，不必为一个没配凭据的频道付出加载成本。

**启用前先准备凭据**（二选一）：

1. **免扫码**：在 QQ 开放平台创建机器人，拿到 AppID / AppSecret，填入启动器
   「实例 → 环境变量」：`QQBOT_APPID`、`QQBOT_SECRET`。
2. **扫码**：在 profile 目录下跑一次 `npx dsh-qqbot-bind`（首次出码会同时用默认
   浏览器打开扫码页），凭据会自动写入 `cordis.patch.yml`。

**然后启用并重启**：启动器「插件」页把 `im-qqbot` 设为启用，**重启实例**后生效
（插件开关与环境变量都只在进程启动时读取，不支持热启用）。

### WorkBuddy 模型接入（dsh-workbuddy-connect）

上游：[corrinehu/dsh-workbuddy-connect](https://github.com/corrinehu/dsh-workbuddy-connect)，
钉 npm `0.7.1`（当前稳定版），**未做任何源码修改**。

它把 WorkBuddy 桌面 App 里的模型（GLM-5.3、GLM-5.2、GLM-5.3-Flash、DeepSeek-V4-Pro/Flash、
Kimi-K3、MiniMax-M3、Hy3 等）注册成 DSH 的一个 LLM provider（`llm-workbuddy`），于是这些模型
直接出现在模型选择器与 `/model` 弹窗里，**不需要另外申请 API key**。

- **凭据来自本机 App** —— 插件复用 WorkBuddy 桌面端的登录态，不自建 OAuth 流程；你在 App 里
  切换账号，DSH 这边跟着切。Windows 上先查 `%LOCALAPPDATA%\Programs\WorkBuddy\WorkBuddy.exe`，
  再查卸载注册表来定位解密程序；国际版（WorkBuddy AI）只查注册表。
- **国内版 / 国际版互不混用** —— 各成一个分组（「WorkBuddy」/「WorkBuddy AI」），各看自己那版
  App 的登录状态，模型、账号、积分彼此独立。
- **未登录时不打扰** —— 某版 App 从未登录、也没留下插件自留副本时，**该版分组不再显示**
  （0.7 起的行为变化：过去国内版会显示一份内置兜底列表，但那些模型选了必然报错）。
  因此没装 WorkBuddy 的用户装本包不会遇到任何启动报错（2026-10-07 实测：`--dump-config` 零 stderr、
  web 服务正常监听、界面无 WorkBuddy 分组）。控制台会多出一条
  `list slot "plugins.item" requires options.id`——该报错**不含本插件的基线同样存在**（基线 2 条 /
  含插件 3 条同类），属既有的插槽注册问题，不影响使用，详见「验证记录」。
- **能力面** —— 多数模型支持发图（GLM-5.3-Flash、GLM-5.2、DeepSeek-V4 系列等）；上游声明了
  档位的模型直接给出 low / high / max；模型名后显示积分倍率与促销徽章（限时免费、夜间折扣）；
  设置卡片可查看账号、令牌有效期、剩余积分与模型列表来源（实时 / 已保存 / 内置）。
- **计费走 WorkBuddy 积分**，不是 API key 余额，因此与 `dsh-cost-meter` 的费用数字**口径不同**：
  cost-meter 按模型单价估算，WorkBuddy 侧实际扣的是积分倍率。

> **版本必须对得上**：`0.7.0` 起插件**仅面向 0.2.0 内核**（`0.7.1` 只支持 `0.2.0-rc.2`），
> 与本包基座正好一致；仍在 DSH `0.1.x` 上的人需要 `0.6.5`。不匹配的组合会让 DSH **启动失败**，
> 上游 issue #63 即是插件被宿主整体跳过的案例。这也是本包把 `dshVersion` 精确锁在
> `0.2.0-rc.2` 的原因之一。
>
> 另外，该插件是 **web 平台注入**（`dsh.client.platform: web`，客户端注入 model-selection 等
> 六个官方包），与本包的 web 基座匹配。若你想把它单独装进 **TUI** profile，需要
> `@deepseek-harness-tui/dsh-tui` **≥ 0.10.0-beta.5**，更早版本装了会启动失败
> （报 `events is not iterable`）。

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

判定口径与宿主一致：`semver.satisfies(宿主版本, peer范围, { includePrerelease: true })`。
`docs/compat-check.cjs` 目前**逐条录入 13 个在装插件**的 peer 范围，实测 **13/13 通过**；
候选池另计 1 个不兼容（`dsh-edit-resend`，v2.3.0 已移除、未装入本包，不参与总判定）。
其余插件的 peer 范围在 v2.0.0–v2.3.0 的选型中逐个评估过，但**未录入脚本**，不要把它当成 24/24 的全覆盖声明。

v2.7.0 新增的 `dsh-workbuddy-connect@0.7.1` 声明 7 个 `@deepseek-ai/dsh-*` peer，
**全部精确钉 `0.2.0-rc.2`**，与本包基座逐一对上 → 7/7 ✅。非 `dsh-*` 的 host peer 由基座树
满足：`@deepseek-ai/cordis ^4.0.2`（宿主带 4.0.4）、`@deepseek-ai/schemastery ^3.18.2`
（web-app 带 `~3.18.4`）、`@earendil-works/pi-ai ^0.87.1`（`dsh-llm-pi-ai@0.2.0-rc.2`
自身的依赖范围就是 `^0.87.1`，不存在上游 issue #74 提到的两代混用）、`react ^18.2.0`
（与已真机实测的 `dsh-codex-ui` 同一 peer）。

> 跑 `node docs/compat-check.cjs` 会分别输出「在装插件 N/N 通过 ✅」与「候选池（未装）…」两行，
> **只有前者决定门禁**（脚本 exit code 也只跟前者走）。自 v2.7.0 起候选条目用
> `installed: false` 标注，已移除的历史候选（`dsh-edit-resend`）不再把总结行染红。

### 冲突排除

- `@michengai/dsh-codex-ui` 会接管官方 `ui-sidebar` 与 `ui-settings-general`
  并自行重建；它同时**重新提供** `sidebar.footer.action` 与 `settings.section`，
  因此 `dsh-cost-meter` 的余额卡片和桌宠的设置分区仍有落点。
- 桌宠走浮动浮层，不争抢侧栏插槽。
- **没有**装 `dsh-better-sidebar` / `dsh-coding-sidebar`——与 codex-ui 抢同一侧栏位置。
- **没有**装 `dsh-prompt-history`——↑↓ 召回历史输入已由 codex-ui 自带。
- 桌宠只选 1 个（候选池 10+ 个全部抢同一浮层）。
- `dsh-workbuddy-connect` **不争抢 UI 插槽**：它只注册一行 LLM provider（`llm-workbuddy`）并向
  官方 model-selection / conversation / renderer 等六个客户端包注入内容，侧栏与设置页仍归
  codex-ui 接管；层栈中它排在 codex-ui **之前**，保持「codex-ui 最后接管」的既有约定。
- 层栈中 codex-ui 排在**最后**，确保它的插槽接管生效于其他插件注册之后。

## 验证记录

### v2.7.0 · 2026-10-07 实测（隔离安装真 `@deepseek-ai/dsh@0.2.0-rc.2` CLI + 独立 DSH_HOME）

| 测试 | 结果 |
|---|---|
| peer 门禁 `node docs/compat-check.cjs` | 在装 **13/13 ✅**，exit 0；候选池 1 个不兼容（未装） |
| `dsh --dump-config` | **exit 0、stderr 0 字节**、stdout 1367 行 |
| 层栈完整性 | 参与测试的 **23/23 bundle 全部出现**在层栈中 |
| provider 行 | `llm-workbuddy` 由插件自带 bundle patch 注入，位于 codex-ui 之前 ✅ |
| 真实启动 web 服务 | 成功监听 `http://127.0.0.1:3987`，页面标题 `DeepSeek Harness` 正常渲染 |
| Computer Use MCP 启动 | `windows-computer-use MCP server 0.2.3 ready`（profile patch 的路径修正生效） |
| 未装 WorkBuddy 时的行为 | 模型选择器中**无 WorkBuddy 分组**、启动与界面均不受影响（与插件 0.7 起的「无凭据即隐藏」一致） |

**测试范围的两个诚实边界**：

1. 本次是 **23 bundle**（基座 + 21 个 npm 插件）而不是全部 26 —— 三个 git 依赖插件
   （`dsh-computer-use`、`dsh-agent-arena`、`@tencent-connect/dsh-qqbot`）在 Windows 上触发 pnpm 的
   store 文件锁（`[EBUSY] unlink …\store\v11\tmp\_tmp_*\.git\FETCH_HEAD`）导致 `pnpm install` 失败，
   两次尝试（共享 store 与独立 store）均复现。这三个插件本身在 v2.4.0 / v2.6.0 已分别真机验证过。
2. **WorkBuddy 登录态下的功能冒烟（选模型、发图、积分显示、卡片）没有做** —— 本机未安装 WorkBuddy 桌面 App。

另记录一条与本包无关的现象：DSH 界面控制台有 `list slot "plugins.item" requires options.id` 报错，
**不含新插件的基线同样出现**（基线 2 条 / 含插件 3 条同类），属既有的插槽注册问题，非 v2.7.0 引入。

### 历史（v1.1.0 时代在 0.1.x 基座上的记录，仅作对照）

| 测试 | v1.1.0 结果 |
|---|---|
| 规格校验（pack-structure v3 + manifest v5 硬约束） | 30/30 PASS |
| `evaluatePluginCompatibility()` 实测 | 11/11 无阻断 |
| `dsh --dump-config` | exit 0，1303 行，零 stderr |
| 插件 MCP self-test | UIA 树 + 截图均 OK（2560×1600） |

## 自定义

profile patch 层 `overrides/cordis.patch.yml` 现有 **3 条**：`dsh-computer-use-win` 的 MCP 路径修正、
`im-qqbot` 默认关闭、`computer-use` preset 注入。其余挂载关系仍由各插件自身的 bundle patch 表达——
`dsh-workbuddy-connect` 的 provider 行同样由它自带 patch 注册，**不需要在这里补条目**。改动后请跑：

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
- [corrinehu](https://github.com/corrinehu/dsh-workbuddy-connect)（WorkBuddy 模型接入）
- [wushi2333](https://github.com/wushi2333/dsh-computer-use_codex-style)（Codex 风格 Computer Use）
- `dsh-effort-slider`、`dsh-cost-meter`、`dsh-whale-girl-pet`、`dsh-computer-use-win` 各作者
- `dsh-context`、`@modusensus/dsh-mneme`、`@liustack/modlens`、`dsh-prompt`、
  `dsh-inline-figures`、`@mrweicodes/dsh-loop-guard`、`dsh-plugin-wallpaper-engine`、
  `@nanmicoder/dsh-agent-teams`、`dsh-plugin-subagent-director`、`@goodandready/dsh-key-limits`
  等各作者
- fork 依赖 `dsh-agent-arena`、`dsh-qqbot` 由本仓库维护分叉，功能版权归上游原作者

格式规范：[DSH-PackForge](https://github.com/DSH-PackForge/DSH-PackForge)。

## 更新日志

### v2.7.0 (2026-10-07)
- **新增**：`dsh-workbuddy-connect@0.7.1` —— **WorkBuddy 桌面端模型接入**。复用 WorkBuddy 桌面 App
  的本机登录态，把 GLM-5.3、GLM-5.2、GLM-5.3-Flash、DeepSeek-V4-Pro/Flash、Kimi-K3、MiniMax-M3、Hy3
  等注册成 DSH 的一个 LLM provider，零配置出现在模型选择器与 `/model` 里；国内版与国际版各成一个
  分组、积分互不混用。功能与限制详见上方「WorkBuddy 模型接入」。
- **不增加使用门槛**：没装或未登录 WorkBuddy 时，对应模型分组直接隐藏（0.7 起无凭据不再展示内置
  兜底列表），不报错、不影响其余插件启动——实测 `--dump-config` 零 stderr、web 服务正常监听、
  界面无该分组（见「验证记录」）。
- **适配判定**：该插件 7 个 `@deepseek-ai/dsh-*` peer **全部精确钉 `0.2.0-rc.2`**，与本包基座一致，
  peer 门禁 7/7 ✅；`@earendil-works/pi-ai ^0.87.1` 与基座 `dsh-llm-pi-ai@0.2.0-rc.2` 自身的依赖
  范围同源，不存在上游 issue #74 的两代混用。**版本必须对得上**：`0.7.x` 仅面向 0.2.0 内核，
  在 DSH `0.1.x` 上需退回 `0.6.5`，装错会启动失败。
- **层栈位置**：排在 `@tencent-connect/dsh-qqbot` 之后、`@michengai/dsh-codex-ui` 之前，
  维持「codex-ui 末位接管」的既有约定；`overrides/cordis.patch.yml` **本次未新增条目**——
  provider 行由插件自带的 bundle patch 注册，整合包无需补层。
- `pnpm-workspace.yaml` 补录 `dsh-workbuddy-connect@0.7.1` 的 `minimumReleaseAgeExclude`。
  **事后溯源（2026-10-07）**：阈值不在 profile 的 `pnpm-workspace.yaml` 里，来自 pnpm 11 的
  `minimumReleaseAge`（DSH 生态实测按 `1440` 分钟＝1 天处理，见 dsh-market 安装器的绕过逻辑）；
  0.7.1 发布于 2026-10-01，早已超出 1 天窗口 → **这条 exclude 其实不需要**，保留至 v2.7.0 已发布
  资产不变，**下一版移除**。
- 插件总数 23 → **24**（bundles 25 → **26** 含 2 个官方基座；dependencies 23 → **24**）；
  自带 skill 数量与基座均与 v2.6.0 相同。
- **验证（2026-10-07 实测，详见「验证记录」）**：隔离安装真 `@deepseek-ai/dsh@0.2.0-rc.2` CLI + 独立
  DSH_HOME 跑通 —— `dsh --dump-config` **exit 0、stderr 0 字节、1367 行**，参与测试的 **23/23 bundle
  全部在层栈中**，`llm-workbuddy` provider 行由插件自带 patch 注入在位；web 服务成功监听、界面正常，
  未登录时模型选择器无 WorkBuddy 分组。peer 门禁 13/13 ✅（脚本口径见「兼容性判定」）。
  **两个边界**：三个 git 依赖插件（`dsh-computer-use` / `dsh-agent-arena` / `dsh-qqbot`）本次
  **未参与同一次启动**——Windows 上 pnpm 取 git 依赖稳定触发 store 文件锁
  （`[EBUSY] unlink …\.git\FETCH_HEAD`），共享/独立 store 两次尝试均复现；**WorkBuddy 登录态下的
  功能冒烟未做**（本机未装该桌面 App）。上游自述 0.7.0/0.7.1 已在 0.2.0-rc.2 web 端真机实测。

### v2.6.0 (2026-10-06)
- **新增**：`dsh-computer-use`（钉上游提交 `72f390a`，未改源码）—— Codex 风格 Computer Use：
  13 个 window2 原生工具 + `batch_actions` / `health` / `experience` 三个 DSH 扩展、可见合成光标
  与状态药丸、Esc 急停、按应用授权。
- **新增独立 `computer-use` preset**：上游插件只带 HOST 平面那一行，13 个工具必须由 preset 挂载
  才对模型可见，故本包在 `overrides/cordis.patch.yml` 用 `- insert:` **新增**一个 preset
  （不往 `preset-standard` 塞行——loader patch 会整体替换它的 `plugins` 数组，实测会把标准
  preset 的 32 行压没）。**普通编码会话（standard / ptc）拿不到鼠标**。
- 与 `dsh-computer-use-win` 可共存，但**不要在同一会话里同时驱动桌面**（两套指针/覆盖层会打架）。
- **随包 skill 47 → 49**：新增投递 `computer-use`、`computer-use-browser`。
- 插件总数 22 → **23**（bundles 24 → 25；dependencies 22 → 23）。
- 完整说明见 `docs/release-notes-v2.6.0.md`。

### v2.5.0 (2026-10-06)
- **整合包自带 49 个 skill**（v2.5.0 起）：dspack 携带 `home/skills/`，安装时落入 `DSH_HOME/skills/`，开箱即用，不再依赖各 harness 本地目录。
- **49 个 skill**：覆盖设计/前端、动效、数据分析、代码开发、媒体、规划效率、打包、办公文档（docx/pdf/pptx/xlsx/research）、浏览器（agent-browser）及新建的 `qq-chat-style-miner`（从 QQ 聊天记录提炼用户风格）。选择标准：仅通用、可广泛改善体验的 skill；项目级与纯本机自动化类已排除。
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
