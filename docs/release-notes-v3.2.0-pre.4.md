# v3.2.0-pre.4 发布说明 / Release Notes

## 中文

### 摘要

- 基座 DSH 版本：0.2.2-rc.5。
- 整合包版本：3.2.0-pre.4。
- 实际挂载插件：22 个；在 3.2.0-pre.3 候选基础上新增 `dsh-plugin-tool-management@0.22.8`。
- 本改动以独立 PR 提交；当前不合并、不发布，stable/latest 不变。

### 新增：工具管理面板

- 来源：npm `dsh-plugin-tool-management@0.22.8`，MIT；Node.js `>=24.9`。
- 包元数据声明 `engines.dsh: >=0.2.2-rc.2 <0.2.3`，覆盖本整合包基座 `0.2.2-rc.5`；上游 README 标注适配 DSH 0.2.2。
- 提供统一面板管理 MCP、技能、子智能体、提示词、记忆和归档会话；可用场景快速切换组合，并允许 Agent 通过工具管理配置。
- PR CI 验证 manifest 声明与整合包打包，不执行插件宿主内运行时测试。

### 验证与发布状态

- PR CI 检查插件兼容范围、双语发布说明、dspack 构建与归档元数据。
- Node.js 要求为 `>=24.9`；运行宿主需满足此版本下限。
- 这是预发布候选，不得标记为 stable/latest。

## English

### Summary

- Base DSH version: 0.2.2-rc.5.
- Modpack version: 3.2.0-pre.4.
- Mounted plugins: 22; adds `dsh-plugin-tool-management@0.22.8` on top of the v3.2.0-pre.3 candidate.
- Submitted as a separate PR; it is not merged or released, and stable/latest remains unchanged.

### Added: Tool management panel

- Source: npm `dsh-plugin-tool-management@0.22.8`, MIT; requires Node.js `>=24.9`.
- Package metadata declares `engines.dsh: >=0.2.2-rc.2 <0.2.3`, which includes this pack's DSH base `0.2.2-rc.5`; the upstream README marks it for DSH 0.2.2.
- Provides one panel for MCP, skills, subagents, prompts, memory and archived sessions; scenes switch configured combinations, and agent tools can operate the settings.
- PR CI validates manifest declarations and packaging; it does not run the plugin inside the host.

### Validation and Release Status

- PR CI checks the DSH range, bilingual release notes, dspack build, and archive metadata.
- The runtime host must satisfy Node.js `>=24.9`.
- This is a prerelease candidate and must not be marked stable/latest.
