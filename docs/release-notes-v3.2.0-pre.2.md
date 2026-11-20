# v3.2.0-pre.2 发布说明 / Release Notes

## 中文

### 摘要

- 基座 DSH 版本：0.2.2-rc.5。
- 整合包版本：3.2.0-pre.2。
- 实际挂载插件：20 个（v3.2.0-pre.1 的 13 个，加上本轮 7 个 CI 候选）。
- 这是预发布验证版本，不会替换 stable/latest 正式版。

### 为 CI 验证加入的插件

以下候选按本轮请求加入，兼容性由 PR CI 和后续实际运行继续验证：

| 包 | 版本 | 来源 | 兼容性状态 |
|---|---:|---|---|
| dsh-live-compact | 1.1.12 | npm | 已声明范围，仍需针对 rc.5 做 CI/运行时验证 |
| dsh-drawai | 0.4.8 | npm | peer 范围，仍需针对 rc.5 做 CI/运行时验证 |
| dsh-computer-use-ljl454 | 1.50.1 | npm | 面向桌面/Windows，仍需 CI/运行时验证 |
| dsh-research | 0.1.0 | Git commit d3827723b242555aed558b7ec02130fd3a2a3f85 | 没有 DSH engine/peer 声明，未验证 |
| @hxhxh/dsh-tray-restart | 0.3.1 | npm | Windows 包且没有 DSH engine/peer 声明，未验证 |
| @dsh-packforge/dsh-pack-plugin | 0.3.5 | npm | 没有 DSH engine/peer 声明，未验证 |
| dsh-bili-whale | 1.0.1 | Git commit f1847ff9e1eca4fc27edadd41847fb3d9e6ec668 | 没有 DSH engine/peer 声明，未验证 |

GitHub 依赖固定到 commit，因为对应来源没有可用的 npm 发布版本，或本身就是 Git 来源。

### 兼容性检查说明

检查器从 manifest.json 读取宿主版本，并验证已声明的 engines/peers。没有 DSH engine/peer 声明的包会保留用于结构和构建 CI，但会输出 INFO no DSH engine/peer declaration: compatibility unverified；仅仅成功打包不代表运行时兼容。

宽泛的 prerelease 范围也需要实际 CI 和运行时确认。npm prerelease 语义不能用一个通用的 0.2.x 范围证明对每个 rc 候选都兼容。

### 验证与发布状态

- PR CI 必须执行 manifest 兼容性检查和 dspack 构建/检查。
- 本版本已通过兼容性、构建和资产校验。
- 这是预发布版本，不得标记为 stable/latest。

## English

### Summary

- Base DSH version: 0.2.2-rc.5.
- Modpack version: 3.2.0-pre.2.
- Mounted plugins: 20 total (13 from v3.2.0-pre.1 plus seven CI candidates).
- This is a prerelease validation build and must not replace the stable/latest release.

### Plugins Added for CI Validation

The following candidates were added for this request; compatibility remains subject to PR CI and runtime validation:

| Package | Version | Source | Compatibility status |
|---|---:|---|---|
| dsh-live-compact | 1.1.12 | npm | Declared range; CI/runtime validation for rc.5 remains required |
| dsh-drawai | 0.4.8 | npm | Peer range; CI/runtime validation for rc.5 remains required |
| dsh-computer-use-ljl454 | 1.50.1 | npm | Desktop/Windows-oriented; CI/runtime validation required |
| dsh-research | 0.1.0 | Git commit d3827723b242555aed558b7ec02130fd3a2a3f85 | No DSH engine/peer declaration; unverified |
| @hxhxh/dsh-tray-restart | 0.3.1 | npm | Windows package with no DSH engine/peer declaration; unverified |
| @dsh-packforge/dsh-pack-plugin | 0.3.5 | npm | No DSH engine/peer declaration; unverified |
| dsh-bili-whale | 1.0.1 | Git commit f1847ff9e1eca4fc27edadd41847fb3d9e6ec668 | No DSH engine/peer declaration; unverified |

GitHub dependencies are pinned to commits because npm publication was unavailable for those sources, or the source is Git-based by design.

### Compatibility Checker Behavior

The checker reads the host version from manifest.json and validates declared engines/peers. Packages without a DSH engine/peer declaration remain available for structural and build CI but print INFO no DSH engine/peer declaration: compatibility unverified; a successful archive build alone does not establish runtime compatibility.

Broad prerelease ranges also require actual CI and runtime confirmation. npm prerelease semantics do not allow a generic 0.2.x range to prove compatibility with every rc candidate.

### Validation and Release Status

- PR CI must run the manifest compatibility and dspack build/inspection checks.
- This version passed compatibility, build, and asset validation.
- This is a prerelease and must not be marked stable/latest.
