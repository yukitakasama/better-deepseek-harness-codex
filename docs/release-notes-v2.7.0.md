# better-deepseek-harness-codex v2.7.0 发行说明

> 新增插件版。在 v2.6.0 基础上加入 **WorkBuddy 桌面端模型接入**
> （`dsh-workbuddy-connect@0.7.1`，来自 [corrinehu/dsh-workbuddy-connect](https://github.com/corrinehu/dsh-workbuddy-connect)）。
> 基座、其余 23 个插件与 49 个自带 skill 与 v2.6.0 **完全相同**。

## 新增内容

### WorkBuddy 桌面端模型接入（`dsh-workbuddy-connect`）

它把 WorkBuddy 桌面 App 中包含的模型——GLM-5.3、GLM-5.2、GLM-5.3-Flash、DeepSeek-V4-Pro、
DeepSeek-V4-Flash、Kimi-K3、MiniMax-M3、Hy3 等——注册成 DSH 的一个 LLM provider
（`llm-workbuddy`），于是这些模型**直接出现在模型选择器与 `/model` 弹窗里**，零配置即可对话，
**不需要另外申请任何 API key**。

- **凭据来自本机 App** —— 插件复用 WorkBuddy 桌面端的登录态，不自建 OAuth 流程；你在 App 里
  切换账号，DSH 这边自动跟随。Windows 上定位解密程序时先查
  `%LOCALAPPDATA%\Programs\WorkBuddy\WorkBuddy.exe`，查不到再看卸载注册表记录；国际版
  （WorkBuddy AI）没有已验证的默认安装位置，只查注册表。自动定位失败时可用环境变量显式指定
  （国内版 `WORKBUDDY_ELECTRON_BIN`、国际版 `WORKBUDDY_AI_ELECTRON_BIN`，自 0.6.4 起两变量分离），
  设置后需**完全退出并重启 DSH**（插件在构造时读取该变量）。
- **国内版与国际版互不混用** —— 各成一个分组（「WorkBuddy」/「WorkBuddy AI」），各看自己那版 App 的
  登录状态：只装国际版就只出现「WorkBuddy AI」，两版都装就两组并存，退出其中一版则对应分组消失。
  模型、账号、积分全部独立。
- **能力面** —— 多数模型支持发图（GLM-5.3-Flash、GLM-5.2、DeepSeek-V4 系列等，直接粘贴或拖入）；
  上游声明了档位的模型直接给出 low / high / max 可选；模型名后显示积分倍率（如 `GLM-5.2 · x0.79`、
  `Hy3 · x0.00`）与促销徽章（限时免费、夜间折扣）；设置卡片可查看账号、令牌有效期、剩余积分、
  企业额度，以及当前模型列表来自**实时 / 已保存 / 内置**哪一种。
- **模型显隐与上下文窗口** —— 可在卡片里勾选要在选择器中显示的模型，该配置**按登录账号分别保存**，
  切账号自动切换、切回恢复；隐藏只影响可选性，正在使用该模型的已有会话不受影响。

### 没装 WorkBuddy 会怎样（重要）

**什么都不发生** —— 某版 App 从未登录、也没留下插件自留副本时，**该版模型分组直接隐藏**，
不报错、不影响其余 23 个插件加载。

这是 0.7 起的行为变化：过去国内版会显示一份内置兜底模型列表，而**那些模型选了必然报错**；
现在宁可不给列表。因此本包即使带着这个插件发给没装 WorkBuddy 的用户，也不会多出任何启动噪声。

### 计费口径提醒

WorkBuddy 侧走的是**账号积分**，不是 API key 余额。所以本包的 `dsh-cost-meter` 与
`dsh-key-limits` 的费用数字和 WorkBuddy 实际扣减**口径不同**：cost-meter 按模型单价估算，
WorkBuddy 按倍率扣积分。两边数字都对，但不要互相换算。

## 兼容性核验

`dsh-workbuddy-connect@0.7.1` 声明的 `@deepseek-ai/dsh-*` peer **全部精确钉 `0.2.0-rc.2`**，
与本包基座逐一对上，`docs/compat-check.cjs` 门禁 7/7 ✅：

| peer | 要求 | 本包基座 |
|---|---|---|
| `@deepseek-ai/dsh-llm` | `0.2.0-rc.2` | ✅ 精确匹配 |
| `@deepseek-ai/dsh-llm-pi-ai` | `0.2.0-rc.2` | ✅ 精确匹配 |
| `@deepseek-ai/dsh-settings` | `0.2.0-rc.2` | ✅ 精确匹配 |
| `@deepseek-ai/dsh-attachment` | `0.2.0-rc.2` | ✅ 精确匹配 |
| `@deepseek-ai/dsh-home-paths` | `0.2.0-rc.2` | ✅ 精确匹配 |
| `@deepseek-ai/dsh-atomic-write` | `0.2.0-rc.2` | ✅ 精确匹配 |
| `@deepseek-ai/dsh-host-webserver` | `0.2.0-rc.2` | ✅ 精确匹配 |

非 `dsh-*` 的 host peer 由基座依赖树满足：

- `@deepseek-ai/cordis ^4.0.2` —— 宿主自带 cordis 4.0.4；
- `@deepseek-ai/schemastery ^3.18.2` —— `dsh-web-app` 带 `~3.18.4`；
- `@earendil-works/pi-ai ^0.87.1` —— **与本包同源，不会两代混用**：`dsh-llm-pi-ai@0.2.0-rc.2`
  自身的依赖范围就是 `^0.87.1`。上游 issue #69 / #74 记录的是「profile 里残留旧 `pi-ai@0.85.1`」
  的场景，`0.7.1` 已把 peer 从 `^0.85.1 || ^0.87.1` 收窄为 `^0.87.1` 来挡住它；本包是首次引入该插件，
  不存在历史残留；
- `react ^18.2.0` —— 与已真机实测的 `@michengai/dsh-codex-ui` 是同一 peer 要求。

> ⚠️ **版本必须对得上**：自 `0.7.0` 起插件**仅面向 0.2.0 内核**，`0.7.1` 只支持 `0.2.0-rc.2`。
> 仍在 DSH `0.1.x` 的用户需要 `0.6.5`。**不匹配的组合会导致 DSH 启动失败**（上游 issue #63 即插件被
> 宿主整体跳过的案例）。本包 `dshVersion` 精确锁在 `0.2.0-rc.2`，正是这个组合。

**尚未实跑的部分（如实标注）**：上游自述 `0.7.0` / `0.7.1` 已在 DSH `0.2.0-rc.2` 的 web 端真机实测
（加载、国内版与国际版目录、加密凭据、状态路由正常）。本包侧的全量 `pnpm install` 与
`dsh --dump-config` **本次未实跑**——打包环境无法访问 `registry.npmjs.org`（只有 npmmirror 可达），
与本包既往版本同一限制。首次在宿主上导入本版后，建议跑一次
`dsh --profile better-deepseek-harness-codex --dump-config` 确认 26 个 bundle 全部加载。

## 集成方式：为什么 patch 层没有新增条目

- provider 行由**插件自带的 bundle patch** 注册（`dsh.bundle.patch: ./cordis.patch.yml`，
  内容就是 `- insert: { id: llm-workbuddy, name: dsh-workbuddy-connect }`，且明确写了「不改变 profile
  当前默认模型」）。整合包的 `overrides/cordis.patch.yml` **不需要补任何东西**——这与 v2.6.0 的
  `dsh-computer-use` 相反，那个插件缺了 preset 行就完全不可见，所以必须补。
- **层栈位置**：插在 `@tencent-connect/dsh-qqbot` 之后、`@michengai/dsh-codex-ui` 之前，
  维持本包「codex-ui 永远排在最后接管插槽」的既有约定。
- **不抢 UI 插槽**：它只注册一行 provider，客户端侧向官方 model-selection / conversation / renderer
  等六个包注入内容，侧栏与设置页仍归 codex-ui。
- 该插件是 **web 平台注入**（`dsh.client.platform: "web"`），与本包的 web 基座匹配。若要把它单独装进
  **TUI** profile，需要 `@deepseek-harness-tui/dsh-tui` **≥ 0.10.0-beta.5**，更早版本装了会启动失败
  （报 `events is not iterable`）——本包不受影响。

## 依赖与安装

- 新增依赖（钉 npm 精确版本，**不是 fork、不是 git 依赖**）：
  ```json
  "dsh-workbuddy-connect": "0.7.1"
  ```
- `pnpm-workspace.yaml` 补录 `minimumReleaseAgeExclude: 'dsh-workbuddy-connect@0.7.1'`
  （0.7.1 发布于 2026-10-01，仍落在依赖新鲜度窗口内，避免安装被拦）。
- 已装旧版的用户：由启动器导入本版 `.dspack` 即可；或在对应 profile 下
  `dsh plugin --profile better-deepseek-harness-codex add dsh-workbuddy-connect@0.7.1`，
  然后**完全退出并重启实例**。
- 使用前提：本机安装并登录 WorkBuddy（国内版或 WorkBuddy AI 国际版均可）。没有登录只是看不到分组。

## 本版内容计数

| 项 | v2.6.0 | v2.7.0 |
|---|---|---|
| 插件 | 23 | **24** |
| bundles（含 2 个官方基座） | 25 | **26** |
| dependencies | 23 | **24** |
| 自带 skill | 49 | 49（不变） |
| 基座 DSH | 0.2.0-rc.2 | 0.2.0-rc.2（不变） |
| `overrides/cordis.patch.yml` 条目 | 3 条（MCP 路径修正 + im-qqbot 默认关闭 + `computer-use` preset） | **3 条，本次未新增** |

发行资产：`better-deepseek-harness-codex-2.7.0.dspack` 与同名 `.dspack.sha256`
（64 字节小写十六进制，无换行）。
