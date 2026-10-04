# 兼容性排查：dsh-agent-arena 是否支持 DSH 0.2.0-rc.2

- 日期：2026-10-05
- 分类：调研 / 配置
- 任务来源：用户要求核对 `github.com/Tikzen/dsh-agent-arena` 是否兼容基座 `0.2.0-rc.2`，兼容则加入整合包并测试、推送。
- 结论：**不兼容，未加入、未测试、未推送。**

## 1. 本次工作的时间和任务
- 时间：2026-10-05 01:58 起（约 10 分钟，单轮核查）。
- 任务：核验 `Tikzen/dsh-agent-arena` 对 DSH `0.2.0-rc.2` 的兼容性，决定是否纳入 `better-deepseek-harness-codex` 整合包。
- 范围：`manifest.json`、`package.json`、`pnpm-workspace.yaml`、`overrides/cordis.patch.yml`、`docs/compat-check.cjs`；远端 `Tikzen/dsh-agent-arena` 仓库与 npm 上 `@deepseek-ai/dsh@0.2.0-rc.2` 的依赖树。

## 2. 实际完成的任务
- 读取整合包当前 manifest（version 2.1.0，基座 `0.2.0-rc.2`，16 个 bundle）。
- 通过 `gh api repos/Tikzen/dsh-agent-arena/contents/package.json` 取得目标插件 `package.json`：
  - 版本 `0.6.0`（最新 tag `v0.6.0`，release 标题即「Agent Arena for DSH 0.1.7-rc.2」）。
  - 全部核心 peer 精确锁定 `0.1.7-rc.2`：`@deepseek-ai/dsh-agent`、`dsh-agent-default-model`、`dsh-host-webserver`、`dsh-llm`、`dsh-session`、`dsh-session-persistence`、`dsh-subagent`、`dsh-system-prompt`、`dsh-tools`、`dsh-workspace`；另 `@deepseek-ai/cordis ^4.0.1`、`react ^18.2.0`。
  - 上述 peer 在 `peerDependenciesMeta` 中均标 `optional: true`。
- 通过 `gh api` 列出该仓库 tags/releases：最新为 `v0.6.0 (DSH 0.1.7-rc.2)`；次新 `v0.5.0-dsh015.1 (DSH 0.1.5-rc.2)`；其余 `v0.5.0/v0.4.0/v0.3.x` 均无 0.2.0-rc.2 目标。**没有任何 tag 面向 0.2.0-rc.2。**
- 通过 WebFetch 拉取 npm 上 `@deepseek-ai/dsh@0.2.0-rc.2` 真实 manifest（dist-tags.latest=0.2.0-rc.2），确认其 `dependencies` 中全部核心包（含 `@deepseek-ai/dsh-agent`、`dsh-subagent`、`dsh-llm`、`dsh-session` 等）均**精确固定为 `0.2.0-rc.2`**，而非 `0.1.7-rc.2`。
- 复用 `docs/compat-check.cjs` 的同款 `semver.satisfies` 逻辑，对 `dsh-agent-arena@0.6.0` 的 10 条核心 peer 在 HOST=0.2.0-rc.2 下求值：
  - 10/10 全部 FAIL（精确 `0.1.7-rc.2` ≠ 宿主 `0.2.0-rc.2`）。
- 产出物：本报告；上文 node 门禁输出作为可复现证据。

### 教训
- 判定「是否兼容某 harness 版本」时，必须核对该 harness 实际打包的核心 `@deepseek-ai/dsh-*` 版本，而不能只信插件声明或假设「rc 同线即兼容」。本例 `@deepseek-ai/dsh@0.2.0-rc.2` 把所有核心包钉在 `0.2.0-rc.2`，与插件的 `0.1.7-rc.2` 精确锁版冲突。
- 插件把 peer 标 `optional` 只意味着安装不硬失败，不等于运行时兼容：宿主提供的是 0.2.0-rc.2 API，插件按 0.1.7-rc.2 编写，跨 0.1.7→0.2.0 存在破坏性变更风险，沙箱无法真机 `dsh --dump-config` 验证，故不应纳入。

## 3. 是否还有需要完善的点
- 无（本任务为「不支持则停」的判定型核查，结论明确）。
- 后续可选路径（需用户决策，非本次执行）：
  1. 等插件作者发布面向 `0.2.0-rc.2` 的版本（关注 `Tikzen/dsh-agent-arena` releases）。
  2. 若坚持尝试，可 fork 该插件、将其核心 peer 范围放宽到 `>=0.1.7-rc.2`（含 0.2.0-rc.2）并在真机跑 `dsh --dump-config` 冒烟测试——属高风险实验，未获授权不执行。

## 4. 本次可复用的证据
- 目标插件 package.json（权威）：`gh api repos/Tikzen/dsh-agent-arena/contents/package.json`（经 base64 解码）。
- 宿主核心版本（权威）：`https://registry.npmjs.org/@deepseek-ai/dsh/0.2.0-rc.2` 的 `dependencies` 块，全部 `@deepseek-ai/dsh-*` 固定为 `0.2.0-rc.2`。
- 门禁逻辑：`D:/my-project/better-deepseek-harness-codex-main/docs/compat-check.cjs` 的 `satisfies(HOST, range)`；HOST=`0.2.0-rc.2`。
- 判定结论：`dsh-agent-arena@0.6.0` 全部核心 peer 精确锁 `0.1.7-rc.2` → 不兼容 `0.2.0-rc.2`。
