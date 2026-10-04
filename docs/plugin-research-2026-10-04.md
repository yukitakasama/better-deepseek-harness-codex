# DSH 插件选型调研报告（better-deepseek-harness-codex 整合包扩展候选）

- 调研日期：2026-10-04
- 调研人：WorkBuddy（yukitakasama）
- 目标：在现有 10 个插件基础上，寻找**实用、兼容 DSH 0.2.0-rc.2、稳定**的社区插件，供作者决定是否纳入整合包
- 数据源：GitHub `topic:dsh-plugin`（按 star 排序，约 180+ 仓库）+ 逐仓库 `package.json` 的 `peerDependencies` 校验
- 排除项：独立桌面客户端（DSHDesktop / dsh-TUI 等另类前端）、纯 Skill 包、聚合/目录站（dsh-plugin.org、各类 awesome 列表）

---

## 1. 兼容性判定基准（本包现实）

- 本包 `dshVersion` 精确锁定 **0.2.0-rc.2**，基座 `@deepseek-ai/dsh-base` / `@deepseek-ai/dsh-web-app` 内部 `@deepseek-ai/dsh-*` 包均为 **0.2.0-rc.2**。
- DSH 用 `semver.satisfies(安装版本, peer范围, { includePrerelease: true })` 校验，与 README「选型说明」一致。
- 推论：
  - peer 范围含 **0.2.0-rc.2**、或下界为宽松 `>=0.1.x` 的插件 → 大概率过。
  - peer 钉死 **0.1.x 精确版本**（如 `0.1.5-rc.2` 三选一）、或上界 `<0.2.0` 的插件 → **硬失败**。
- 重要 caveat：peer 范围只是**准入门槛**。即便 peer 满足，插件调用的内部 API 仍可能在 0.1.x→0.2.x 之间破坏性变更，最终必须在本包 0.2.0-rc.2 实跑 `evaluatePluginCompatibility()` 才算数。

---

## 2. 生态现状（关键发现）

社区绝大多数 DSH 插件仍钉在 **0.1.x / 0.2.0-alpha 或 rc.1**；明确把 **0.2.0-rc.2** 写进 peer 范围（或列入 OR 集合）的仍是少数。

→ 这意味着「实用但暂时装不上」的插件不少，需要等上游放宽范围或本包降级基座。本报告据此把候选分成 **兼容 / 不兼容 / 未验证** 三档。

---

## 3. 候选清单与判定

### 3.1 ✅ 兼容 0.2.0-rc.2（可进入纳入评估）

| 插件（npm / 仓库） | 版本 | License | Star | 最近提交 | 功能 | 与现有 10 插件冲突 | 备注 |
|---|---|---|---|---|---|---|---|
| `dsh-context`（bowenliang123/dsh-context） | 0.63.0 | Apache-2.0 | 1844 | 2026-10-04 | 上下文洞察/可视化仪表盘（token、窗口、占比） | 与 `@goodandready/dsh-context-lens` 功能相邻（压缩 vs 洞察），非直接抢占插槽 | 互补而非替代；可作为 context-lens 的可视化补充 |
| `dsh-better-sidebar`（omdsh-dev/DSH-better-sidebar） | 0.24.1 | MIT | 3986 | 2026-10-04 | 开放侧栏底座，支持三方注册新侧栏页面（文件/终端/Git/子代理） | **❌ 与 `@michengai/dsh-codex-ui` 抢同一侧栏插槽**（README 已明确排除 better-sidebar） | 只能二选一；若要换侧栏底座才考虑，否则冲突 |
| `dshmarket`（dsh-market/dsh-market） | 1.66.8 | MIT | 5486 | 2026-10-03 | DSH 内插件市场，浏览/搜索/一键安装 | 无直接插槽冲突 | curated 整合包内嵌市场属冗余、增体积；实用但动机不符「精选包」定位 |
| `dsh-plugin-subagent-director`（SeverusZh/dsh-plugin-subagent-director） | 0.5.5 | MIT | 18 | 2026-09-29 | 每个子代理单独选模型/provider + 角色模板 | 与 `/review` 子代理互补 | 小众但实用，多模型编码场景有价值 |
| `@dsh-external/dsh-super-injector`（yjh051108/dsh-routing-suite） | 0.3.3 | BSD-3 | 7000 | 2026-09-18 | 注入器 + 路由标准套件（injector + router-standard） | 运行时注入，潜在冲突风险 | 强大但需严格实测；注入式改造稳定性存疑 |
| `@deepseek-harness-tui/dsh-tui`（ccch1mneyyy/dsh-TUI） | 0.13.0 | MIT | 4016 | 2026-10-04 | TUI 界面插件（官方首推 TUI） | 与 Web UI 范式冲突 | **不推荐进 web profile 整合包**（它是另一套前端） |
| `@nanmicoder/dsh-agent-teams`（NanmiCoder/dsh-agent-teams） | 0.1.22 | MIT | 1915 | 2026-09-29 | 多智能体协作 AgentTeams | 无直接插槽冲突 | 复杂编码强需求，兼容且稳定度尚可 |

### 3.2 ❌ 不兼容 0.2.0-rc.2（peer 钉死 0.1.x 或上界 <0.2.0 → 硬失败）

| 插件 | 版本 | License | Star | 卡点 | 功能 | 备注 |
|---|---|---|---|---|---|---|
| `dsh-searxng`（rogerdigital/dsh-searxng） | 0.4.0 | MIT | 7 | peer `@deepseek-ai/dsh-web >=0.1.0-rc.6 <0.2.0` | SearXNG 网页搜索 provider | **很实用**（编码 agent 需要联网检索），需上游把上界放宽到含 0.2.0 |
| `dsh-approve-for-me`（timeance/dsh-approve-for-me） | 0.3.1 | MIT | 18 | peer 钉死 `0.1.1-rc.2 \|\| 0.1.2-rc.1 \|\| 0.1.5-rc.2` | 规则门控的沙箱自动审批（可选 LLM 复核） | 编码自治很实用，等上游加 0.2.0-rc.2 |
| `dsh-shell-command`（CHplus0/dsh-shell-command） | 0.1.0 | MIT | 4 | peer `^0.1.0-rc.6` | `/!` 触发执行单条命令并分析输出 | 同上，需上游跟进 |
| `dsh-git-ui`（Julyves/dsh-git-ui） | 0.2.1 | MIT | 2 | peer `dsh-session >=0.0.1-rc.1 <0.2.0` | 会话头 Git 状态胶囊 | 既**不兼容**又与 `@linxin666/dsh-client-ui-git-graph` 重叠 → 双输 |

### 3.3 ⚠️ 未验证（未声明 peerDependencies，兼容性未知）

| 插件 | 版本 | License | Star | 功能 | 备注 |
|---|---|---|---|---|---|
| `dsh-edit-resend`（mbj733/dsh-edit-resend） | 0.1.0 | MIT | 4 | 编辑已发送消息并重发 | 正好填补本包移除的 `dsh-plugin-edit-message` 缺口，但**未声明 peer、成熟度低**，需实跑验证 |
| `dsh-undo`（23swccp/dsh-undo） | 0.1.0-rc.8 | MIT | 3 | Shadow Git 快照回滚对话 | 编码容错实用，但需实跑验证 |
| `dsh-anchored-standard`（xiaobright/dsh-anchored-standard） | 0.1.0 | MIT | 6178 | 两阶段预设（Minimal 引导 → 完整 Standard 工具） | star 高但提交较旧（2026-09-10），未声明 peer |
| `dsh-antibrow`（antibrow/dsh-antibrow） | 0.1.0 | MIT | 688 | 带持久身份的浏览器 | 未声明 peer，需实跑 |
| `dsh-bottom-info-bar`（songoao25/dsh-bottom-info-bar） | 1.20.13 | MIT | 42 | 替换输入框下方状态栏 | 既**未验证**又与 `dsh-cost-meter` 抢占同一区域 → 双输 |

---

## 4. 推荐结论

### 4.1 建议优先纳入评估（兼容 + 实用 + 低冲突）
1. **`@nanmicoder/dsh-agent-teams`** — 多智能体协作，复杂编码强需求；peer 含 0.2.0-rc.2，无插槽冲突，star 1915 且 MIT。
2. **`dsh-context`（bowenliang123）** — 上下文可视化洞察，与现有 context-lens（压缩）互补而非竞争，Apache-2.0、活跃。
3. **`dsh-plugin-subagent-director`（SeverusZh）** — 每个子代理单独选模型，与 `/review` 子代理协作场景契合。

### 4.2 谨慎评估（价值高但需先解决前置）
- **`@dsh-external/dsh-super-injector`（routing-suite）** — 7000 star、强大，但注入式运行时改造有稳定性风险，必须先在 0.2.0-rc.2 上严格实测。
- **`dshmarket`** — 内嵌市场方便，但 curated 整合包定位下偏冗余、增体积，建议**不纳入**。

### 4.3 冲突，需动现有插件才可考虑
- **`dsh-better-sidebar`** — 与 `@michengai/dsh-codex-ui` 抢侧栏。若未来决定换侧栏底座，再考虑；当前**排除**。

### 4.4 暂不可装，等上游更新到含 0.2.0-rc.2
- **`dsh-searxng`**、**`dsh-approve-for-me`**、**`dsh-shell-command`** — 三个都是编码场景很实用的工具类插件，但 peer 卡在 0.1.x。建议向各自上游提 issue/PR 放宽范围；或在 fork 内临时 patch peer 后实测（参考本包对 `dsh-computer-use-win` 的 MCP 路径补丁做法）。

### 4.5 需实跑验证后再定
- **`dsh-edit-resend`**、**`dsh-undo`** — 尤其 `dsh-edit-resend` 正好补 edit-message 空缺，值得在 0.2.0-rc.2 上优先验证。

---

## 5. 纳入前的验证门禁（必须遵守）
1. **npm 可装**：确认目标 npm 包名与版本真实存在（本沙箱无法访问 registry.npmjs.org，需在你本机 `npm view <pkg> version` 复核）。
2. **`evaluatePluginCompatibility()` 实测**：在 DSH 0.2.0-rc.2 环境下跑，10/10 无阻断才算过（沿用 README 验证表）。
3. **实跑启动 + 工具/MCP 自检**：`dsh --dump-config` 零 stderr，Web 服务正常监听，MCP self-test 通过。
4. **冲突复检**：新插件不得抢占 codex-ui 侧栏、cost-meter 状态栏、git-graph、桌宠浮层等既有插槽；同功能只留一个。
5. **钉死精确版本**：仿照现有 10 个插件，在 `manifest.json` / `package.json` 写死版本号，不跑浮动范围。
