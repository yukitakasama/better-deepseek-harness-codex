# better-deepseek-harness-codex v3.0.1

## 变更

v3.0.1 清理 v3.0.0 中“随包安装但不挂载”的插件。它们不再写入 `package.json` 或
`manifest.json` 的 `dependencies`，不再出现在 `dsh.profile.bundles`，也不再通过
`overrides/cordis.patch.yml` 注入。这样安装整合包时不会下载或解析这些插件。

实际挂载集仍为 11 个插件，基座仍为 DSH `0.2.1-rc.2`。`manifest.version` 升为
`3.0.1`，构建脚本统计的可打包 skill 目录为 49 个；与已移除 Computer Use 插件绑定的两个
skill 目录也一并删除，避免安装后暴露无法使用的能力说明。

## 因兼容性问题移除的插件

以下名单仅作记录，不属于本版安装内容。移除依据沿用 v3.0.0 的兼容性核查结果：
上游未明确声明适配 DSH `0.2.1-rc.2`、没有可评估的宿主声明，或已明确锁定旧基座。

| 插件 | 原钉版本 | 移除原因 |
|---|---|---|
| `dsh-ops` | `0.3.0` | 上游声明未明确覆盖 `0.2.1-rc.2`，运行时行为未验证 |
| `@goodandready/dsh-context-lens` | `0.1.28` | peer 只覆盖旧的 `0.1.7-rc.2` / `0.2.0-rc.1` 范围 |
| `@goodandready/dsh-key-limits` | `0.2.19` | 没有 `@deepseek-ai/dsh-*` peer，无法确认宿主兼容性 |
| `dsh-plugin-wallpaper-engine` | `1.2.0` | 只有宽范围声明，且后续版本发生结构性拆包，未验证 |
| `@modusensus/dsh-mneme` | `0.8.13` | 只有宽范围声明，未明确适配目标基座 |
| `@mrweicodes/dsh-loop-guard` | `1.0.8` | 只有开区间声明且上游长期未更新 |
| `dsh-computer-use-win` | `0.2.3` | 没有 `@deepseek-ai/dsh-*` peer，无法确认兼容性 |
| `dsh-computer-use` | git `72f390a` | peer 全为通配符、无兼容声明，上游长期未更新 |
| `dsh-prompt` | `0.3.0` | 仅覆盖旧的 `engines.dsh` 范围，未点名目标 RC |
| `@liustack/modlens` | `3.26.6` | 没有 peer 或 engines 宿主声明，无法评估 |
| `dsh-effort-slider` | `1.3.1` | 没有兼容声明，上游长期未更新 |
| `dsh-agent-arena` | git fork `25e2c55` | 上游精确锁定 DSH `0.2.0-rc.2`，未适配当前基座 |
| `@tencent-connect/dsh-qqbot` | git fork `7e88006` | 只有旧版本范围声明，未明确适配目标 RC |

后续只有在上游发布新的兼容声明并重新通过门禁、启动冒烟后，才应把单个插件重新
加入整合包。
