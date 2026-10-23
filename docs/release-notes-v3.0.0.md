# better-deepseek-harness-codex v3.0.0 发行说明（**破坏性更新 · 预发布 pre-release**）

> 基座 DSH `0.2.0-rc.2` → **`0.2.1-rc.2`**。本次按「上游是否**明确声明**适配 0.2.1-rc.2」重新划分插件：
> **11 个挂载**、**13 个随包安装但暂不挂载**。GitHub Release 标记为 **Pre-release**，不发布正式版。

## 目标版本口径（查询于 2026-10-23 22:05 UTC+8）

| 来源 | 结果 |
|---|---|
| npm `@deepseek-ai/dsh` dist-tags | `latest = 0.2.1-rc.2`（2026-10-17）、`next = 0.2.1-rc.3`（2026-10-23 07:54Z，仅 npm、无 GitHub Release）、`alpha = 0.2.1-alpha.5` |
| GitHub `deepseek-ai/deepseek-harness` 最新 Release | `v0.2.1-rc.2`（Pre-release，2026-10-17） |
| **本次核查/升级目标** | **`0.2.1-rc.2`**（双口径一致） |

## 一、判定规则

「明确声明适配 0.2.1-rc.2」= 满足下列任一条件（按优先级）：

1. `dsh.compatibility.dshReleases` 里直接写了 `"0.2.1-rc.2": "compatible"`；
2. `peerDependencies` 的 `@deepseek-ai/dsh-*` 写成**精确枚举**且包含 `0.2.1-rc.2`（这是 MichengAI 系插件的写法，本质是「已知 RC 白名单」）；
3. `dsh.engines.dsh` / `engines.dsh` 或 peer 写成**下限**且点名 `>=0.2.1-rc.2` / `>=0.2.1-rc.1`。

只用开区间（如 `>=0.1.7-rc.2`、`^0.2.0-rc.1`）覆盖到 rc.2、或干脆没有任何 dsh peer 声明的，**一律不算**明确声明 → 本版暂屏蔽。

## 二、挂载清单（11 个，含依据）

| 插件 | v3.0.0 | 上一版 | 声明依据 |
|---|---|---|---|
| `@michengai/dsh-codex-ui` | 1.1.47 | 1.1.25 | peer 矩阵精确枚举 rc.2（11 个 peer）；README：1.1.42 起显式支持 rc.1/rc.2，dev 依赖锁 rc.2 |
| `@michengai/dsh-code-review` | 1.0.1 | 0.1.9 | peer 矩阵精确枚举 rc.2（10 个）；README badge「DSH up to 0.2.1-rc.2」 |
| `@michengai/dsh-simplify` | 1.0.1 | 0.1.12 | peer 矩阵精确枚举 rc.2（5 个） |
| `@michengai/dsh-btw` | 1.0.4 | 0.1.15 | peer 矩阵精确枚举 rc.2（7 个）；README：1.0.0 起在 rc.1/rc.2 实测 |
| `dsh-cost-meter` | 1.9.30 | 1.7.47 | `dshReleases` 含 rc.1/rc.2；README「Adaptation target 0.2.1-rc.2」 |
| `dsh-context` | 0.74.0 | 0.63.0 | `dshReleases` 显式 `0.2.1-rc.2 = compatible` |
| `dsh-pet` | 0.3.8 | 0.3.8 | `dshReleases` 显式 rc.2 = compatible（版本无变化） |
| `@linxin666/dsh-client-ui-git-graph` | 0.4.8 | 0.4.4 | `dsh.engines.dsh >=0.2.1-rc.2` + peer `@deepseek-ai/dsh >=0.2.1-rc.2`；v0.4.7 release notes「cohort 推进到 0.2.1-rc.2」 |
| `@nanmicoder/dsh-agent-teams` | 0.1.26 | 0.1.22 | peer 矩阵精确枚举 rc.2（21 个）；README「推荐组合 DSH 0.2.1-rc.2 + AgentTeams 0.1.26」 |
| `dsh-plugin-subagent-director` | 0.6.0-beta.2 | 0.5.5 | `dshReleases` rc.1/rc.2 = compatible；README 声明 `engines.dsh >=0.2.1-rc.1`（**上游 latest 即 beta**） |
| `dsh-workbuddy-connect` | 0.7.9 | 0.7.1 | 6 个 peer **精确钉** `0.2.1-rc.2` |

## 三、暂屏蔽清单（13 个，含原因）

这些插件仍写在 `package.json` 的 `dependencies`（随包安装），但**已从 `dsh.profile.bundles` 移除**，
所以不会被加载；同时它们在 `overrides/cordis.patch.yml` 里的行也已 `disabled: true`（见第四节）。

| 插件 | 钉版本 | 屏蔽原因 | 若挂载会怎样 |
|---|---|---|---|
| `dsh-ops` | 0.3.0 | 上游 0.4.1 只以 peer `@deepseek-ai/dsh ^0.2.0-rc.2` 覆盖，未点名 rc.2 | 门禁能过，但 0.2.1 兼容门优先读 `engines.dsh`，实际行为未知 |
| `@goodandready/dsh-context-lens` | 0.1.28 | 仅 `^0.1.7-rc.2 \|\| ^0.2.0-rc.1` 覆盖 | 门禁能过，未验证 |
| `@goodandready/dsh-key-limits` | 0.2.19 | 无任何 `@deepseek-ai/dsh-*` peer | 门禁不拦（等于没有声明），风险不可评 |
| `dsh-plugin-wallpaper-engine` | 1.2.0 | 仅 `>=0.2.0-rc.1` 覆盖；且 1.4.0 已拆成 8 个包（结构性变更） | 门禁能过，未验证 |
| `@modusensus/dsh-mneme` | 0.8.13 | 仅 `>=0.2.0-rc.0 <0.3.0` 覆盖；0.9.4 新增非 dsh peer `dsh-better-sidebar` | 门禁能过，未验证 |
| `@mrweicodes/dsh-loop-guard` | 1.0.8 | 仅开区间覆盖；上游 2026-10-09 后无更新 | 门禁能过，未验证 |
| `dsh-computer-use-win` | 0.2.3 | 无任何 `@deepseek-ai/dsh-*` peer | 门禁不拦；本包 patch 层锚定它的 MCP 路径，升级/换版需重核 |
| `dsh-computer-use` | git `72f390a`（0.1.0） | peer 全为 `*`，无 compat 声明；上游 2026-09-15 后无提交 | 能加载，但 0.2.1 下未验证；preset 已一并关闭 |
| `dsh-prompt` | 0.3.0 | 仅 `engines.dsh >=0.2.0-rc.2`（README 讨论过 0.2.1 兼容门，但未点名 rc） | 门禁能过，未验证 |
| `@liustack/modlens` | 3.26.6 | 无任何 peer / engines 声明 | 无法评估 |
| `dsh-effort-slider` | 1.3.1 | 无任何兼容声明；上游 2026-09-26 后停更 | 无法评估（历史上曾被官方重构打挂过） |
| `dsh-agent-arena` | git fork `25e2c55`（0.6.0） | 上游 Tikzen 0.7.0 **精确钉 `0.2.0-rc.2`** → 未适配 | 上游原版会被门禁拒装；本包 fork 放开后能过，但上游无 0.2.1 版本 |
| `@tencent-connect/dsh-qqbot` | git fork `7e88006`（0.5.1） | 仅 `>=0.1.0-rc.6` 覆盖；上游 npm 已 0.5.2，同样未点名 rc.2 | 门禁能过，未验证 |

## 三·补、调研期间的新发现：`dsh-workbuddy-connect` 上游已停止维护

核对 npm 元数据时发现 `dsh-workbuddy-connect` 的 `deprecated` 字段为：
「因个人精力有限，本项目已停止维护，不再提供更新和支持。」（0.7.9 与更早版本均已标记）

- 处理：**仍挂载**。理由是本版只按「是否明确声明适配 0.2.1-rc.2」这条规则分组，而 0.7.9 的 6 个 peer
  **精确钉 `0.2.1-rc.2`**，是明确声明；功能本身在 0.2.1 线上没有已知问题。
- 风险：**今后不会再有更新**。若某次宿主升级后它掉队，只能本包自己 fork 或直接移除（它只影响模型分组，
  移除后 DSH 启动不受影响）。想立刻关掉它：把 `dsh-workbuddy-connect` 从 `bundles` 移出即可（它不带 patch 行，
  不用动 `overrides/cordis.patch.yml`）。

## 四、patch 层同步屏蔽（不这样做的话屏蔽会失效）

`overrides/cordis.patch.yml` 是**独立于 bundles 生效**的一层：只要里面有一行引用了被屏蔽插件的模块名，
那一行依旧会把模块拉起来。因此本版把这 5 行一并关闭：

| 行 id | 原作用 | v3.0.0 处理 |
|---|---|---|
| `computer-use`（HOST 平面） | 进程级桌面 sidecar（指针/覆盖层/截图/批准） | 由「非 Windows 才 disabled」改为**无条件** `disabled: true` |
| `preset-computer-use` | 把 13 个 window2 工具挂进独立 preset | 整个 preset `disabled: true` |
| `mcp-dsh-computer-use-win` | 修正 dsh-computer-use-win 的 MCP 路径并启动 sidecar | `disabled: true` |
| `dsh-ops-file` | 四个 Rust 文件工具的配置行 | `disabled: true` |
| `dsh-ops-shell` | `ops_bash` + 随包 PowerShell 7 的配置行 | `disabled: true` |

另：`im-qqbot` 行自 v2.4.0 起就是 `disabled: true`，本次不动。

## 五、计数

| 项 | v2.9.0 | v3.0.0 |
|---|---|---|
| 随包依赖（`dependencies`） | 24 | **24**（未删任何插件） |
| 挂载（`dsh.profile.bundles`） | 26（24 + 2 基座） | **13**（11 + 2 基座） |
| patch 层 active 条目 | 7 | 7（其中 5 条改为 disabled） |
| compat-check 门禁 | 13 个在装，13/13 | **挂载 11/11**；暂屏蔽 13 个单列（6 个无 peer 声明） |
| 自带 skill | 50 | 50（不变） |
| 基座 | 0.2.0-rc.2 | **0.2.1-rc.2** |

## 六、验证与未验证项（如实说明）

已验证：

- `node --check docs/compat-check.cjs` 通过；`node docs/compat-check.cjs` 退出码 0，**挂载 11/11 通过 peer 门禁**；
- 21 个 npm 钉版本**逐个在 registry 上核实存在**（含 `0.6.0-beta.2` 这类 beta 版本号）；3 个 git 钉提交不变；
- `package.json` / `manifest.json` 的 `dependencies`（24）与 `bundles`（13）集合逐一比对一致；README 中英表行与之一致；
- `overrides/cordis.patch.yml` 通过 YAML 解析，7 个条目结构正确，5 条已 disabled；
- `python scripts/build-dspack.py . .` 打包成功，包内含 50 个 skill、`manifest.version = 3.0.0`、`dshVersion = 0.2.1-rc.2`。

**未验证（本机无法完成，需要你在真机上确认）**：

- **没有在真实 DSH 0.2.1-rc.2 宿主上跑过 `dsh --dump-config` / 启动冒烟**：本机当前实例是 0.2.0-rc.2，且完整 `pnpm install` 需要拉 3 个 git 依赖（历史上有 EBUSY 失败记录）。装好后请先看 `dsh --profile <name> --dump-config` 的 stderr 是否为空、13 行 bundles 是否全在位。
- **未做功能回归**：MiChengAI 三件套（btw / code-review / simplify）都跨了大版本，`subagent-director` 是 beta，UI 与命令行为都可能变。
- `dsh-plugin-subagent-director@0.6.0-beta.2` 把 persona/toolFilter 迁进 Agent Preset —— 若你之前在旧版里配过这两项，需要在新版里重新配置。

## 七、升级说明

1. **新建 profile**：`dsh plugin --profile <新名字> add better-deepseek-harness-codex`（或由启动器导入 `.dspack`），不要原地覆盖 v2.x。
2. 首次启动会依次安装 24 个依赖（含 3 个 git 依赖，需要 GitHub 可达）。
3. 启动后确认：宠物出现、Codex 风格侧栏正常、`/review` 与 `/simplify` 可用、模型选择器里有 WorkBuddy 分组（本机未登录则隐藏）。
4. 想恢复某个被屏蔽的能力：加回 `bundles` + 删掉 patch 层对应的 `disabled: true`，然后**单独**验证它（一次只开一个，崩了容易定位）。

## 八、发行资产

`better-deepseek-harness-codex-3.0.0.dspack` 与同名 `.dspack.sha256`（64 字节十六进制，无换行）。
GitHub Release 标记为 **Pre-release**；`docs/prerelease-versions.txt` 已登记 `3.0.0`。
