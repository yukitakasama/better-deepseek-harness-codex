# Release Notes — better-deepseek-harness-codex v2.3.0

- 发布日期：2026-10-05
- 基座：DSH 0.2.0-rc.2（不变）
- 构建产物：`better-deepseek-harness-codex-2.3.0.dspack`（5322 字节）
  - sha256：`8055b3206b2dbd3c3148b4c235963d195c482dd6a265d601d5b31331ec8a884a`
- 插件总数：15 → **21**（bundles 17 → 23 含 2 个官方基座；dependencies 15 → 21）

## 新增 7 个插件（用户经交互式选型器勾选）

| 插件 | 版本 | 作用 | peer 判定 |
|---|---|---|---|
| `@mrweicodes/dsh-loop-guard` | 1.0.8 | 思考循环守护：空转退化循环自动打断并注入纠正提示 | ✅ 明确覆盖 0.2.0 |
| `@modusensus/dsh-mneme` | 0.8.13 | 跨会话长期记忆（离线、Markdown 原生） | ✅ `>=0.2.0-rc.0 <0.3.0` |
| `@liustack/modlens` | 3.26.6 | 视觉桥与截图理解（4120★） | ⚠️ 未声明 peer，实跑通过 |
| `dsh-inline-figures` | 0.1.0 | 回答内嵌矢量图，「文字-图-文字」 | ✅ 精确钉 0.2.0-rc.2 |
| `dsh-prompt` | 0.3.0 | Prompt 模板工具箱（24 模板 + 智能推荐） | ✅ engines `>=0.2.0-rc.2` |
| `dsh-plugin-wallpaper-engine` | 1.2.0 | Wallpaper Engine 动态壁纸（WebGL 渲染） | ✅ `>=0.2.0-rc.1` |
| `@goodandready/dsh-key-limits` | 0.2.19 | API key / 订阅额度上限显示 | ✅ 仅 cordis/schemastery |

版本说明：
- `dsh-plugin-wallpaper-engine` 钉 **1.2.0**——repo 里是 1.3.0 但 npm 最新仅 1.2.0（1.3.0 未发布），以 npm 为准。
- `@goodandready/dsh-key-limits` 钉 **0.2.19**——npm 已领先 repo（0.2.15），取 npm 最新。

## 移除 dsh-edit-resend（v2.1.0 遗留问题的真机修正）

npm 发布产物声明 peer `@deepseek-ai/dsh-agent: ^0.1.0-rc.6` 与 `dsh-typert-protocol: ^0.1.0-rc.6`
（GitHub 源码 package.json 无此声明），在 0.2.0-rc.2 下被 runtime 拒装：

```
dsh: skipping profile bundle "dsh-edit-resend": Error: Plugin dsh-edit-resend@0.1.0 is
incompatible with dsh 0.2.0-rc.2 ...
```

v2.1.0 调研时按 GitHub 源码判定「无 peer 约束」有误。该插件在 0.2.0-rc.2 实际不可用，
v2.3.0 起移除；`docs/compat-check.cjs` 已按真实 peer 修正记录。如需恢复：等上游放宽，
或按 agent-arena 先例 fork 放宽（需另行授权）。

## 顺手修复

- 仓库 `package.json` 自 v2.1.0 起落后于 manifest（缺 agent-teams / dsh-context /
  subagent-director / edit-resend 四项），导致 v2.1.0/v2.2.0 的 dspack 内 package.json
  不含这 4 个依赖。本次全量重同步。
- manifest bundles 中 `@michengai/dsh-codex-ui` 重复出现两次，清理后保持层栈末位唯一。
- `pnpm-workspace.yaml` 补录 4 条 `minimumReleaseAgeExclude`（loop-guard / key-limits /
  inline-figures / prompt，均为新发布版本）。

## 验证记录（真机，DSH 0.2.0-rc.2）

| 测试 | 结果 |
|---|---|
| `docs/compat-check.cjs` peer 门禁 | 21/21 PASS（edit-resend 修正后判 ❌，已移除） |
| `pnpm install` 全量解析（含 git fork 依赖） | 成功，21/21 精确版本就位 |
| `dsh --dump-config`（隔离安装 @deepseek-ai/dsh@0.2.0-rc.2） | **exit 0，零 stderr**，23 bundle 全部加载 |
| 7 个新插件配置出现在 dump | 全部（loop-guard/mneme/modlens/inline-figures/prompt/wallpaper-engine/key-limits） |
| codex-ui 层栈末位、插槽接管 | 保持 |

注：`--dump-config` 验证配置装配层；各插件的运行时 UI/工具行为建议在日常使用中观察。
