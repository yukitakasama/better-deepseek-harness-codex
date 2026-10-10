# better-deepseek-harness-codex v2.7.1 发行说明

> 修复版。在 v2.7.0 基础上处理 issue #1 的两个问题：**6 个自带 skill 的嵌套
> `home/` 死数据** 与 **`dsh-computer-use` sidecar 在非 Windows 平台启动刷
> Traceback**。基座、24 个插件、49 个自带 skill 的构成与 v2.7.0 **完全相同**，
> 无任何依赖版本变更。

Issue: https://github.com/yukitakasama/better-deepseek-harness-codex/issues/1
（报告环境：Android arm64 / proot Ubuntu，DSH 0.2.0-rc.2，`DSH_HOME=/root/.dsh`）

## 修复内容

### Bug 1 · 6 个 skill 嵌套 `home/` 目录（数据修复 + 构建防回归）

**现象**：v2.5.0 收录自带 skill 时（引入提交 `fafc9e8`），6 个 skill
（agent-browser / docx / pdf / pptx / research / xlsx）把上游仓库的宿主 `home/`
前缀一并复制了进来，仓库里出现 `home/skills/<name>/home/skills/<name>/SKILL.md`
形态的嵌套目录（嵌套 SKILL.md 与顶层逐字节相同）。

**影响**：安装时 launcher 把 `home/` 递归映射到 DSH_HOME 根，嵌套副本落在
`$DSH_HOME/skills/<name>/home/skills/<name>/`，而 `dsh-skill-filesystem` 只扫描
`<root>/<name>/SKILL.md` 一层 —— 嵌套副本是永远读不到的死数据（43 个可用 skill
本身的加载不受影响，但打包清单、安装体积均含垃圾条目）。

**修复**：

1. `git rm -r` 清理全部 6 个嵌套子树（185 个文件，顶层 skill 完好，skill 目录数
   维持 49）；
2. `scripts/build-dspack.py` 增加打包期防回归：payload 中任何 `home/**/home/**`
   形态的条目会让构建**报错中断**并列出污染路径（先收集校验、后写包，不留半成品）；
3. CI（`release.yml`）加同款守卫步：checkout 后断言 `find home -mindepth 2 -type d -name home`
   为空，拦截同类污染进入发布产物。

### Bug 2 · `dsh-computer-use` sidecar 非 Windows 启动即崩（平台守卫）

**现象**：该插件（钉上游提交 `72f390a`）的 Python sidecar 入口 `cli.py:51` 无条件
`from computer_use.win_dpi import enable_dpi_awareness`，而 `win_dpi.py:13` 在
**模块顶层**执行 `ctypes.WinDLL("user32", …)` —— 该属性仅 Windows 的 ctypes 才有，
非 Windows 上 import 即 `AttributeError: module 'ctypes' has no attribute 'WinDLL'`。
由于 `failOnStartupError: false` 启动不受影响，但每次启动都打印一整段 Traceback。

**修复（profile 层，包内立即可用）**：`overrides/cordis.patch.yml` 给两处加
`disabled: !!js process.platform !== 'win32'`（与 `preset-computer-use` 里既有
`tool-pwsh` 守卫同一模式）：

- HOST 平面 `computer-use` 行（上游插件自带 patch 以 `insert:` 创建的 sidecar 行，
  行 id 已对照钉死的上游提交 `72f390a` 的 `cordis.patch.yml` 核实）；
- `preset-computer-use` 内的 `tool-computer-use` 行（13 个 window2 工具）。

两个平面同开同关：非 Windows 上「安静地不可用」，Windows 上表达式求值为 `false`、
行为与上游完全一致。逐键覆盖语义只写 `disabled`，不触碰 backend / surface 等其余键。

**源码级修复（治本，另行推进）**：向上游 `wushi2333/dsh-computer-use_codex-style`
提 issue + 最小 diff PR（`cli.py` 平台短路 + `win_dpi.py` 顶层 import 收进平台分支）；
上游合并后把 `manifest.json` 的 pin 切回主线再发后续版本。规划见
`docs/fix-plan-issue-1-v2.7.1.md`。

## 清理遗留

按 v2.7.0 更新日志的事后溯源承诺，移除 `pnpm-workspace.yaml` 中其实不需要的
`dsh-workbuddy-connect@0.7.1` `minimumReleaseAgeExclude`（该版本发布于 2026-10-01，
远超 pnpm 11 的 1 天 `minimumReleaseAge` 窗口，exclude 从未生效过）。

## 不修的（平台边界，非 bug）

issue #1 同时提到的 `dsh-computer-use-win`（MCP server 面向 Windows）、
`dsh-plugin-wallpaper-engine`（Windows/Steam 路径）、`dsh-workbuddy-connect`
（WorkBuddy 桌面 App 登录态）在非 Windows 上不可用属**平台边界**：它们在
Windows 上工作正常，本版不做改动。

## 验证

- `dsh --dump-config`：无重复 id、stderr 干净（Windows 上 computer-use 行保持 enabled）；
- dspack 内嵌套条目断言通过、skill 目录计数 49、sha256 sidecar 一致；
- 非 Windows 端（Android / proot Ubuntu）启动不再出现
  `dsh-computer-use:python` Traceback（HOST 行显式 disabled）。

## 升级说明

从 v2.7.0 直接覆盖安装即可；插件组合、依赖版本、基座均无变化，无需迁移。
已在 v2.7.0 及之前版本安装过的用户，重装本版后 `$DSH_HOME/skills/` 下历史遗留的
`<name>/home/` 残留目录可手动删除（新版安装不再产生）。

## 发行资产

`better-deepseek-harness-codex-2.7.1.dspack` 与同名 `.dspack.sha256`
（64 字节十六进制，无换行）。
