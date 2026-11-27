# v3.2.0 Release Notes

## 中文

### 摘要

- 基座 DSH 版本：`0.2.2-rc.5`。
- 整合包版本：`3.2.0`；GitHub 标签：`v3.2.0`，稳定版并标记为 Latest。
- 挂载插件从 8 个增加到 10 个，新增 `dsh-ptc-python-win` 和 `dsh-flash-presets`。
- 更新插件依赖到当前 registry 最新版本或 GitHub 默认分支最新提交：
  - `dsh-cost-meter@1.9.94`
  - `dsh-context@0.87.2`
  - `dshmarket@1.85.0`
  - `dsh-rea@1.6.1`，commit `f0af7f9bec0d27880b678e116f00889a73c4d4d4`
  - `dsh-deepseek-stack@0.1.1`，最新 commit 仍为 `ed2fb187e6c8eea1b74bba754c1b229d17c176ac`
  - `dsh-live-compact@1.1.14`
  - `dsh-computer-use-ljl454@1.50.1`（当前最新版本，无需变更）
  - `dsh-bili-whale@1.0.2`，commit `10af44cd4b8249de064e4b662aa2b8e73fb0c58e`
  - `dsh-ptc-python-win@0.1.0`，commit `89847ecd72a9d9e4326332af67e2b87d2dba565c`
  - `dsh-flash-presets@0.3.4`，commit `40052db3d1561a030868a0b76a5141fb6e445dc5`

### 兼容性与验证

- `dsh-flash-presets` 声明的 DSH 范围覆盖 `0.2.2-rc.5`。
- `dsh-ptc-python-win` 未声明 DSH engine 或 peer 范围；`dsh-bili-whale` 也未声明 DSH 兼容范围。这两个插件兼容性未验证。
- GitHub 最新提交已固定到 manifest，npm 插件以精确版本固定。
- CI 静态检查与 dspack 归档验证不代表所有插件已完成目标环境运行时认证。

## English

### Summary

- Base DSH version: `0.2.2-rc.5`.
- Modpack version: `3.2.0`; GitHub tag: `v3.2.0`, stable and marked Latest.
- The pack grows from 8 to 10 plugins by adding `dsh-ptc-python-win` and `dsh-flash-presets`.
- Plugin dependencies now use the latest registry versions or latest default-branch commits:
  - `dsh-cost-meter@1.9.94`
  - `dsh-context@0.87.2`
  - `dshmarket@1.85.0`
  - `dsh-rea@1.6.1`, commit `f0af7f9bec0d27880b678e116f00889a73c4d4d4`
  - `dsh-deepseek-stack@0.1.1`; its latest commit remains `ed2fb187e6c8eea1b74bba754c1b229d17c176ac`
  - `dsh-live-compact@1.1.14`
  - `dsh-computer-use-ljl454@1.50.1` (already current)
  - `dsh-bili-whale@1.0.2`, commit `10af44cd4b8249de064e4b662aa2b8e73fb0c58e`
  - `dsh-ptc-python-win@0.1.0`, commit `89847ecd72a9d9e4326332af67e2b87d2dba565c`
  - `dsh-flash-presets@0.3.4`, commit `40052db3d1561a030868a0b76a5141fb6e445dc5`

### Compatibility and Validation

- `dsh-flash-presets` declares a DSH range that covers `0.2.2-rc.5`.
- `dsh-ptc-python-win` declares no DSH engine or peer range, and `dsh-bili-whale` has no DSH compatibility declaration. Compatibility for both remains unverified.
- GitHub sources are pinned to their latest commits, and npm plugins are pinned to exact versions.
- Passing static CI checks and dspack archive validation do not constitute runtime certification of every plugin in the target environment.
