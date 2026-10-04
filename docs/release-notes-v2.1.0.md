# 更好的 deepseek harness（codex 风格）v2.1.0

基于 **DSH 0.2.0-rc.2** 的编码向整合包更新。

## 新增 4 个社区插件（全部 peer 兼容 0.2.0-rc.2，compat-check 通过）

- `@nanmicoder/dsh-agent-teams@0.1.22` — 多智能体协作（peer 显式含 0.2.0-rc.2，自带 compatibility.json 推荐宿主即 0.2.0-rc.2）
- `dsh-context@0.63.0` — 上下文可视化仪表盘（peer `>=0.1.5-rc.1`）
- `dsh-plugin-subagent-director@0.5.5` — 子代理独立选模型（peer `>=0.1.7-rc.1`）
- `dsh-edit-resend@0.1.0` — 消息编辑重发，补回早前移除的 edit-message 缺口（无 peer 约束，门禁通过；运行时建议先单独冒烟）

## 变更

- 插件总数 12 → 16，依赖 10 → 14，全部钉死精确版本。
- 同步更新中英文 description。
- 新增 `docs/`：插件调研报告、交互式选型器（plugin-selector.html）、兼容性测试脚本（compat-check.cjs）、兼容性测试结果。

## 兼容性说明

- 4 个插件经 `docs/compat-check.cjs`（复刻 DSH `semver.satisfies`）对 `@deepseek-ai/dsh-*` peer 在 `0.2.0-rc.2` 下求值，全部通过 peer 门禁。
- 真机安装 + `dsh --dump-config` 零 stderr 验证建议在运行 DSH 0.2.0-rc.2 的宿主上完成。
