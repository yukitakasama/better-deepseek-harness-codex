# v3.2.0-pre.3 发布说明 / Release Notes

## 中文

### 摘要

- 基座 DSH 版本：0.2.2-rc.5。
- 整合包版本：3.2.0-pre.3。
- 实际挂载插件：21 个；在 v3.2.0-pre.2 的 20 个插件基础上新增 `@furongjun1999/dsh-memory@0.11.1`。
- 本版仅通过 PR CI 验证，不合并、不发布；stable/latest 不变。

### 新增：灵枢长期记忆

- 来源：npm `@furongjun1999/dsh-memory@0.11.1`，MIT；Node.js `>=22.19`。
- 上游 README 标注 DSH `0.2.2-rc.3` 已验证；本整合包基座为 `0.2.2-rc.5`，上游没有明确声明 rc.5，因此仍需针对目标版本做运行验证。
- 插件将对话自动沉淀为可读、可手改的 Markdown 认知图，并提供确定性记忆写入/召回流程。
- **遗忘是显式操作，不会按热度或时效自动淘汰**；删除/遗忘需要显式执行。它不满足“按热度自动遗忘”这一需求，但按用户指定加入整合包。

### 验证与发布状态

- PR CI 检查 manifest 兼容声明、双语发布说明、dspack 构建与归档元数据。
- CI 成功只证明仓库门禁与打包通过；不会替代 DSH `0.2.2-rc.5` 上的插件启动与运行验证。
- 这是预发布候选，不得标记为 stable/latest。

## English

### Summary

- Base DSH version: 0.2.2-rc.5.
- Modpack version: 3.2.0-pre.3.
- Mounted plugins: 21; adds `@furongjun1999/dsh-memory@0.11.1` to the 20 plugins in v3.2.0-pre.2.
- This change is for PR CI only; it is not merged or released, and stable/latest remains unchanged.

### Added: Lingshu long-term memory

- Source: npm `@furongjun1999/dsh-memory@0.11.1`, MIT; requires Node.js `>=22.19`.
- The upstream README reports verification on DSH `0.2.2-rc.3`. This pack targets `0.2.2-rc.5`, which upstream does not explicitly declare, so runtime validation on the target is still required.
- It automatically sediments conversations into human-readable, editable Markdown cognitive graphs and provides deterministic memory-write and recall flows.
- **Forgetting is explicit; memories are not automatically evicted by heat or age.** Deletion/forgetting requires an explicit operation. This does not satisfy the requested heat-based automatic forgetting, but is included at the user’s direction.

### Validation and Release Status

- PR CI checks manifest compatibility declarations, bilingual release notes, dspack build, and archive metadata.
- A passing CI run proves the repository gates and package build pass; it does not replace plugin startup/runtime validation on DSH `0.2.2-rc.5`.
- This is a prerelease candidate and must not be marked stable/latest.
