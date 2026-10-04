# v2.2.0 — 新增 dsh-agent-arena（多智能体议事厅 / 提示词竞技场）

> 基座 DSH 0.2.0-rc.2。本版本在整合包中新增 `dsh-agent-arena` 插件。

## 新增

- **dsh-agent-arena**（多智能体议事厅与提示词竞技场）：交互式多 Agent 议会与 prompt arena，提供可调协作栏、渠道限流与自动接话控制。

## 兼容性处理（重要）

上游 `Tikzen/dsh-agent-arena@0.6.0` 把全部核心 peer 精确锁定在 `0.1.7-rc.2`，
而 `@deepseek-ai/dsh@0.2.0-rc.2` 把全部核心包钉在 `0.2.0-rc.2`，导致原版**无法**在
0.2.0-rc.2 下安装。经用户授权，本包采用 **fork 放宽** 方案：

- Fork 仓库：`github.com/yukitakasama/dsh-agent-arena`
- 分支：`feat/relax-peers-0.2.0-rc.2`（commit `25e2c55`）
- 改动：10 条核心 `@deepseek-ai/dsh-*` peer 由精确 `0.1.7-rc.2` 放宽为 `>=0.1.7-rc.2`
  （仍要求 0.1.7-rc.2 API 面，同时接受 0.2.0-rc.2）。`cordis ^4.0.1`、`react ^18.2.0` 不变。
- 整合包依赖精确钉到该 fork commit：`github:yukitakasama/dsh-agent-arena#25e2c55`

## 测试状态

- ✅ 项目 peer 门禁（`docs/compat-check.cjs`）全部通过，含 dsh-agent-arena 放宽后的 10 条 peer。
- ✅ `scripts/build-dspack.py` 正常产出 `better-deepseek-harness-codex-2.2.0.dspack`（5 文件结构正确）。
- ✅ 插件 `cordis.patch.yml` 仅 `insert` 唯一服务 `dsh-agent-arena`，与 overrides 层无冲突。
- ⏳ **真机运行时冒烟测试（安装 + `dsh --dump-config` 零 stderr + 启动加载）需在用户本机完成**；
  沙箱无 `dsh`、npm registry 被墙，无法实跑。重点核对：`dsh.client.inject` 引用的 4 个
  `@deepseek-ai/dsh-client-*` 包在 0.2.0-rc.2 下是否仍存在、API 是否兼容 0.1.7→0.2.0 变更。

## 已知风险 / 后续

- 本包以 **git fork 依赖** 形式发布，安装时需能访问 GitHub；fork 分支需长期保留。
- 若上游发布面向 0.2.0-rc.2 的官方版本，建议改回 npm registry 版本并移除此 fork 钉点。
