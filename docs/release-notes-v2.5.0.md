# better-deepseek-harness-codex v2.5.0 发行说明

> 面向 Coding 用户的 DSH 整合包（Codex 风格工作区）。本版本起，**整合包自带 47 个跨 harness 精选 skill**，安装即可用，无需逐台机器手动配置。

## 核心变化

- **自带 47 个跨 harness 精选 skill**：安装时由 dspack 内的 `home/skills/` 落到 `DSH_HOME/skills/`，导入即生效，不再依赖各 harness 本地目录。
- 基座仍为 **DSH 0.2.0-rc.2**，插件组合与 v2.4.0 完全一致（含 `@tencent-connect/dsh-qqbot@0.5.0`）。

## 自带的 47 个 skill（按用途分类）

| 类别 | skill |
|------|-------|
| 设计/前端 | frontend-design、frontend-skill、web-design-guidelines、apple-design、emil-design-eng、brand-guidelines、theme-factory、shadcn、figma、chart-visualization、algorithmic-art |
| 动效 | animation-vocabulary、improve-animations、find-animation-opportunities、review-animations |
| 数据分析 | data-analysis、consulting-analysis、report-generator-skill |
| 代码/开发 | code-reviewer、security-best-practices、refactorer、debugger、perf-optimizer、test-writer、architect、git-commit、mcp-builder、gh-ci-failure-triage、upstream-pr-readiness |
| 媒体/音视频 | explainer-video-pipeline、qwen-vl、screenshot、hook-analyzer-skill |
| 规划/效率 | brainstorming、executing-plans、translator、docs-writer、write-skill、find-skills |
| 打包/发布 | desktop-packaging-workflow |
| 办公文档（marketplace） | docx、pdf、pptx、xlsx、research |
| 浏览器（marketplace） | agent-browser |
| 新建 | qq-chat-style-miner（从 QQ 聊天记录提炼用户本人语言风格） |

> 选择标准：仅纳入「可广泛改善体验 / 省去麻烦」的通用 skill；项目级、纯本机自动化类 skill 已排除。

## 升级 / 安装

- 全新安装：导入本 dspack 后，47 个 skill 自动进入 `DSH_HOME/skills/`，开箱即用。
- 已装 v2.4.0：直接导入 v2.5.0 会叠加落入 skills。
- MCP 服务器本次**未**随整合包分发，按你既有的本机 `cordis.patch.yml` 配置使用即可；如需扩展，可在 DSH Launcher 的 MCP 管理页单独添加。

## 校验

- dspack 内含 `home/skills/` 共 47 个 skill 目录；`overrides/cordis.patch.yml` 维持原有 1 条 computer-use 修正（不含任何 MCP 条目）。
- 安装后 `ls $DSH_HOME/skills` 应能看到这 47 个目录；`dsh --profile better-deepseek-harness-codex --dump-config` 可核对 patch 层。
