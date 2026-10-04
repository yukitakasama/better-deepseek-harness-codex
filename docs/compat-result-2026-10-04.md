# DSH 插件兼容性测试报告（基于 selection JSON）

- **任务时间**：2026-10-04 21:16 → 21:30（约 14 分钟）
- **任务来源**：用户从 `docs/plugin-selector.html` 导出 `dsh-plugins-selection-2026-10-04T13-15-27-783Z.json`，要求按导出内容添加并做兼容性测试
- **基座**：DSH `0.2.0-rc.2`（manifest `dshVersion`）；本机 `dsh` 启动器版本为 `0.1.5-rc.3`（启动器 ≠ 内置 dsh 包版本，详见末尾风险）
- **涉及文件**：`manifest.json`（已改）、`docs/plugin-selector.html`（生成器）、`docs/compat-check.cjs`（测试脚本）

## 一、选中清单（4 个）

| # | 插件 | npm 包名 | 版本 | 状态 | 来源 repo |
|---|---|---|---|---|---|
| 1 | DSH Agent Teams | `@nanmicoder/dsh-agent-teams` | 0.1.22 (MIT) | 兼容 | NanmiCoder/dsh-agent-teams |
| 2 | DSH Context 仪表盘 | `dsh-context` | 0.63.0 (Apache-2.0) | 兼容 | bowenliang123/dsh-context |
| 3 | Subagent Director | `dsh-plugin-subagent-director` | 0.5.5 (MIT) | 兼容 | SeverusZh/dsh-plugin-subagent-director |
| 4 | Edit & Resend | `dsh-edit-resend` | 0.1.0 (MIT) | 未验证 | mbj733/dsh-edit-resend |

## 二、测试方法

1. **来源核验**：经 npm registry 在本沙箱被墙（HTTP 000），改用 `gh api` 直读各 repo 根 `package.json`（权威源）取真实 `version` / `peerDependencies` / `license`。
2. **静态 peer 校验**：复刻 DSH `evaluatePluginCompatibility()` 的 `semver.satisfies` 逻辑（`docs/compat-check.cjs`），对 4 个插件的 `@deepseek-ai/dsh-*` peer 范围在 `0.2.0-rc.2` 下逐个求值。
3. **代码/补丁核查**：对未验证项 `edit-resend` 额外读取 `cordis.patch.yml` 与 `src`，确认其接入方式（双端插件，注册 id `edit-resend`，零依赖零 peer）。
4. **冲突分析**：对照 manifest 现有 10 个插件检查功能重叠。

## 三、逐项结果

### ✅ 1. @nanmicoder/dsh-agent-teams@0.1.22
- peer 中 `@deepseek-ai/dsh-agent` 等全部为 `"0.2.0-rc.2 || 0.1.7-rc.2 || …"` → **0.2.0-rc.2 显式命中**。
- 自带 `compatibility.json`：`recommendedHost: 0.2.0-rc.2`，`supportedHosts` 含 `0.2.0-rc.2 (recommended)`。
- cordis `^4.0.2`、schemastery `^3.18.2`、react `^18.2.0`（宿主 0.2.0-rc.2 均满足）。
- **结论：完全兼容，优先推荐。**

### ✅ 2. dsh-context@0.63.0
- peer：`@deepseek-ai/dsh-client-ui-primitives` / `dsh-session` / `dsh-settings` 均为 `>=0.1.5-rc.1` → 0.2.0-rc.2 高于 0.1.5，**满足**。
- 与现有 `@goodandready/dsh-context-lens`（压缩/预算守卫）功能互补（仪表盘 vs 压缩），低冲突；两者可能都挂 UI 面板，运行时观察是否视觉重叠。
- **结论：兼容。**

### ✅ 3. dsh-plugin-subagent-director@0.5.5
- peer：所有 `@deepseek-ai/dsh-*` 为 `>=0.1.7-rc.1` → 0.2.0-rc.2 满足。
- 与 `/review` 子代理（`@michengai/dsh-code-review`）机制互补（导演为各子代理单独指定模型/参数），低冲突。
- **结论：兼容。**

### ⚠️ 4. dsh-edit-resend@0.1.0
- **无 `peerDependencies`、无 `dependencies`** → DSH peer 门禁不拦截；但这意味着它不声明宿主版本约束，**无法靠静态判定运行时兼容**。
- `cordis.patch.yml`：`- insert: { id: edit-resend, name: dsh-edit-resend }`，双端插件（`index.mjs` host + `client.js` browser），关键字 `message-edit/resend/reroll/retry/timeline` —— 正好补上整合包早前移除的 edit-message 缺口。
- 运行时风险：依赖宿主提供 cordis，若其调用的 DSH API 在 0.2.0 有改名/移除则会在加载或使用时报错。**需真机冒烟测试**（发一条消息→编辑重发）。
- **结论：安装门禁 PASS；运行时待验证，建议先单独冒烟再依赖。**

## 四、冲突与重叠核查（对照现有 10 插件）

- 未选中已知硬冲突项 `dsh-better-sidebar`（与 `@michengai/dsh-codex-ui` 抢侧栏），规避了冲突。
- `dsh-context` 与 `dsh-context-lens`：互补，非重叠。
- `subagent-director` 与 `dsh-code-review`/`dsh-simplify`：子代理机制互补。
- `edit-resend` 与现有插件无功能重叠。
- 总体：4 个之间及与现有 10 个之间**无已知硬冲突**。

## 五、已执行动作

- `manifest.json`：`bundles` 由 12 → 16，`dependencies` 由 10 → 14，新增并钉死：
  - `@nanmicoder/dsh-agent-teams: 0.1.22`
  - `dsh-context: 0.63.0`
  - `dsh-plugin-subagent-director: 0.5.5`
  - `dsh-edit-resend: 0.1.0`
- 同步更新 `manifest.json` 中英文 `description`，补述 4 项新能力。
- 校验 `manifest.json` 仍为合法 JSON（node 解析通过）。

## 六、待办 / 风险（用户侧必须完成）

1. **真机安装验证（本沙箱无法进行）**：npm registry 被墙，无法 `npm/pnpm install`；需你本机执行：
   - `pnpm install`（或 `dsh plugin --profile <name> add <pkg>`）
   - `dsh --dump-config` 确认 **零 stderr**；
   - 启动后逐个验证：agent-teams 能否起多代理、context 仪表盘是否渲染、subagent-director 能否给子代理选模型、**edit-resend 编辑重发是否可用**。
2. **版本戳真实性**：本沙箱无法 `npm view` 复核 npm 上确切发布版本；上述版本取自各 repo 根 `package.json` 的 `version` 字段（通常即发布版），但请在安装时确认 npm 上确实存在对应版本（尤其 `dsh-edit-resend@0.1.0`）。
3. **启动器版本差异**：本机 `dsh` 启动器为 `0.1.5-rc.3`，与整合包目标 `0.2.0-rc.2` 不一致。请确认真机使用 `0.2.0-rc.2` 启动器做验证，否则 `dump-config` 结果不代表目标环境。
4. **提交前**：按规则，commit 前需先把提交信息发你审核，未批准不提交、不推送。

## 七、可复用证据

- 兼容性测试脚本：`docs/compat-check.cjs`（运行：`node docs/compat-check.cjs`）。
- 选择器生成器：`docs/plugin-selector.html`。
- 原始选择：`D:/浏览器/dsh-plugins-selection-2026-10-04T13-15-27-783Z.json`。
- peer 取值方式：`gh api repos/<owner>/<repo>/contents/package.json`（base64 解码）。
- 关键约束：DSH 用 `semver.satisfies(hostVersion, peerRange)` 校验；`>=0.1.x` 类范围对更高的 `0.2.0-rc.2` 均满足；无 peer 的插件安装时不拦截但需运行时验证。
