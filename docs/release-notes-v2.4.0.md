# 更好的 deepseek harness（codex 风格）v2.4.0

基于 **DSH 0.2.0-rc.2** 的编码向整合包更新。

## 新增 1 个插件（腾讯官方，peer 门禁通过）

- **@tencent-connect/dsh-qqbot**（QQ 机器人频道，0.5.0）：把 QQ Bot 接入 DSH，支持私聊 / 群聊对话、图片与文件理解、流式回复、主动提问与操作确认、/preset 切换预设、/compact 压缩会话、/bot-ping 网络检测。需配置 `QQBOT_APPID` / `QQBOT_SECRET` 环境变量启用（未配置时插件加载但不连接，不影响其它插件）。

## 兼容性处理（重要）

`dsh-qqbot@0.5.0` 的 peer 范围：

- `@deepseek-ai/dsh-agent` / `dsh-llm` / `dsh-session` / `dsh-user-approval`：`>=0.1.0-rc.6`
- `@deepseek-ai/cordis`：`>=4.0.1`
- `@deepseek-ai/schemastery`：`>=3.18.1`
- `@tencent-connect/qqbot-connector`：`1.2.0`

全部 `@deepseek-ai/dsh-*` peer 在 `0.2.0-rc.2` 下均满足；`cordis >=4.0.1` 与 DSH 0.2.0-rc.2 的 cordis 4.x 基线一致（同本包已在用的 agent-arena fork 基线）。**判定：适配 0.2.0，无需 fork**，直接钉 npm 发布的 `0.5.0` 精确版本。该插件自带 `cordis.patch.yml`，由 dsh 启动时自动加载，无需在 profile 层额外补丁。

## 资产说明

| 资产 | 说明 |
|---|---|
| `better-deepseek-harness-codex-2.4.0.dspack` | 整合包本体（format v3，内含 `dspack.json` / `manifest.json` / `package.json` / `pnpm-workspace.yaml` / `overrides/cordis.patch.yml` 共 5 个文件） |
| `better-deepseek-harness-codex-2.4.0.dspack.sha256` | 上者的 SHA-256 校验值（64 位十六进制，无换行） |

## 测试状态

- ✅ 项目 peer 门禁（`docs/compat-check.cjs`）：新增 `dsh-qqbot@0.5.0` 的 4 条 `@deepseek-ai/dsh-*` peer 全部满足 0.2.0-rc.2（注：`compat-check.cjs` 中刻意保留的 `dsh-edit-resend@0.1.0` 记录项仍判 ❌——那是 v2.3.0 已移除插件的文档性留存，非本次回归）。
- ✅ `npm install @tencent-connect/dsh-qqbot@0.5.0`：可从 npm 下载，自带 `cordis.patch.yml`（bundle 自动加载），传递依赖 `qqbot-connector` / `qqbot-nodejs` / `js-yaml` 就位。
- ⏳ **全量 `pnpm install` + `dsh --dump-config` 真机运行时冒烟测试需在用户 0.2.0-rc.2 宿主完成**：沙箱环境无法经 git 克隆本包的 git fork 依赖（`github.com` TLS 校验失败），且无 0.2.0-rc.2 的 dsh 二进制，故本次未能在本环境实跑。该限制与本包既往版本（如 v2.2.0）同因；基于 peer 范围判定 dsh-qqbot 适配 0.2.0。dsh 对单一 bundle 加载失败采取「跳过该 bundle」策略，即便 QQ 频道有运行时问题也不会拖垮其余 21 个插件。

## 资产验证

```bash
sha256sum -c better-deepseek-harness-codex-2.4.0.dspack.sha256
```

**安装**：

```bash
dsh --profile better-deepseek-harness-codex
```

或由 DSH 启动器导入 `.dspack`。QQ 机器人启用需先在 profile 环境配置 `QQBOT_APPID` / `QQBOT_SECRET`。

---

**Full Changelog**: https://github.com/yukitakasama/better-deepseek-harness-codex/compare/v2.3.0...v2.4.0
