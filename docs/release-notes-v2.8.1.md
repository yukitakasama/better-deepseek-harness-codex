# better-deepseek-harness-codex v2.8.1 发行说明

> 修复版。在 v2.8.0 基础上移除一个持续故障的插件。基座 DSH 0.2.0-rc.2、
> 49 个自带 skill、其余 24 个插件的版本与构成均与 v2.8.0 **完全相同**，
> 无任何版本升级，仅做减法。

## 变更内容

### 移除 `dsh-inline-figures@0.1.0`

**原因**：该插件提供的 `draw_figure` 工具返回通道持续故障，实测表现为
「spec 合法但工具返回 `draw_figure returned invalid output: value is not lossless JSON`」。
用最小 spec（单步 timeline）复现，确认故障与 spec 内容无关，属于工具绑定层缺陷；
无法通过配置规避，故整包移除。

**影响面**：

- `draw_figure` 工具不再出现在任何会话中；宿主不再注入内嵌图表的引导段与提醒；
- 绘图能力改由**自带 skill `chart-visualization`**（26 种图表，脚本生成图片）与
  宿主原生能力承担，不影响其余 48 个 skill；
- 本机 `profiles/better-deepseek-harness-codex/node_modules/dsh-inline-figures`
  为安装残留，重装本版后由 launcher 依赖收敛自动清理，也可手动删除。

**移除范围**（6 处，全部同步）：

| 文件 | 处理 |
| --- | --- |
| `package.json` | `dependencies` 与 `dsh.profile.bundles` 各删 1 行 |
| `manifest.json` | `dependencies` / `bundles` 各删 1 条；中英文 description 去掉该插件描述并追加 v2.8.1 变更说明；`version` 2.8.0 → 2.8.1 |
| `pnpm-workspace.yaml` | 删 `minimumReleaseAgeExclude` 中的 `dsh-inline-figures@0.1.0`（该版本发布于 2025-08-04，远超 1 天窗口，条目本就无效） |
| `docs/compat-check.cjs` | 删该插件的 peer 门禁条目（在装插件 13 → 12） |
| `README.md` | 特性条目、插件清单表行、致谢列表行各删 1 处；追加 v2.8.1 更新日志段 |
| `README.en.md` | 同上，一一对应 |

v2.3.0 历史变更记录中的该插件条目**保留**——那是已发布版本的历史事实。

## 计数口径

| 项 | v2.8.0 | v2.8.1 |
| --- | --- | --- |
| manifest `bundles` | 27（含 2 个官方基座） | 26 |
| manifest `dependencies` | 25 | 24 |
| README 主清单表行 | 23 | 24 |
| compat-check 在装插件 | 13 | 12 |
| 自带 skill | 49 | 49 |

> README 主清单表行与 manifest `dependencies` 条目数一致。
> manifest `bundles` 比 `dependencies` 多 2，是两个官方基座
> `@deepseek-ai/dsh-base` 与 `@deepseek-ai/dsh-web-app`。

**同时修正 v2.8.0 的一处遗漏**：远端 v2.8.0 提交把 `dsh-ops` 加进了
`manifest.json` 的 `dependencies` 与 `bundles`，但**漏加了 README 主清单表格行**
（表行 23 而 deps 24）。本版补上该行，表行与依赖重新对齐。

## 验证

- `node --check docs/compat-check.cjs` 语法通过；`node docs/compat-check.cjs`
  退出码 0，**在装插件 12/12 通过 peer 门禁 ✅**；
- `package.json` 与 `manifest.json` 的 `dependencies` / `bundles` 集合逐一比对一致；
- README 主清单表格 24 行，与 manifest `dependencies` 24 条逐项一致；
- 全仓检索 `inline-figures` 仅剩 manifest description 的 v2.8.1 变更说明、
  README 的 v2.8.1 / v2.3.0 变更记录与 v2.8.0 发行说明的历史记述。

## 升级说明

从 v2.8.0 直接覆盖安装即可；无需迁移，无配置变更。已装过旧版且手动装回
`dsh-inline-figures` 的用户，卸载该插件后重启即可恢复本版构成。

## 发行资产

`better-deepseek-harness-codex-2.8.1.dspack` 与同名 `.dspack.sha256`
（64 字节十六进制，无换行）。
