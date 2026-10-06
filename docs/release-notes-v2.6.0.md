# better-deepseek-runtime-codex v2.6.0 发行说明

> 新增插件版。在 v2.5.1 基础上加入 **Codex 风格 Computer Use**
> （`dsh-computer-use`，来自 [wushi2333/dsh-computer-use_codex-style](https://github.com/wushi2333/dsh-computer-use_codex-style)），
> 并提供**一个独立的 `computer-use` agent preset**。其余插件与基座保持不变。

## 新增内容

### Codex 风格 Computer Use（`dsh-computer-use`）

上游 Codex `window2` 工具面的 DSH 实现：完全对齐的 13 个桌面方法
（`list_windows`、`get_window`、`list_apps`、`launch_app`、`get_window_state`、
`click`、`press_key`、`type_text`、`scroll`、`set_value`、`drag`、
`perform_secondary_action`、`activate_window`），外加 `batch_actions`、
`computer_use_health`、`computer_use_experience` 三个 DSH 扩展。

- **真实输入与真实截图** —— 输入走 `SendInput`，无障碍树走 UI Automation，
  截图走 `Windows.Graphics.Capture`（窗口被遮挡也能截）。
- **可见、可中断的覆盖层** —— 合成光标 + 状态药丸；药丸只在**截图那一瞬**被隐藏，
  所以模型读不到自己的状态，而操作者始终看得到。任何时候按 **Esc** 中断当前回合。
- **按应用授权** —— 首次操控某应用前会询问；`stealFocus`、`maxImageEdge`
  （截图降采样上限，0 = 不降采样）、`cursorScale`（合成光标大小）均可配。
- **本地上手经验层** —— 任务结束后把该应用的操作笔记写在本机，下次执行前作为参考回放。

### 独立的 `computer-use` preset

上游插件只自带 **HOST 平面**那一行（进程级桌面 sidecar）。它的 **13 个工具挂在
agent preset 里**，因此整合包补了一个 `computer-use` preset：

> **普通编码会话（standard / ptc）永远不会拿到鼠标**，只有显式选择「Computer Use」
> preset 新建的会话才有桌面工具。这与上游的设计意图一致。

### 两个随包 skill

`computer-use` 与 `computer-use-browser` 随整合包投递（安装时落入
`DSH_HOME/skills/`），自带 skill 总数 47 → **49**。

## 与 dsh-computer-use-win 的关系

两者**可以共存**（工具名与挂载方式都不同），但**不要在同一会话里同时驱动桌面** ——
两套指针与覆盖层会互相打架。日常桌面操控建议只用其中一个。

## 关于「适配 0.2.0」的验证结论

上游 v0.1.0 在 DSH 0.2.0-rc.2 上**无需修改即可运行**，因此本包直接钉上游提交、
不做 fork。验证方式与结果：

1. **行挂载测试** —— 用 0.2.0-rc.2 自带的真 cordis 4.0.4 与真 `@deepseek-ai/dsh-tools`
   挂载 preset 行：注册 **16 个工具**（13 window2 + `batch_actions` + `health` +
   `experience`），零报错。
2. **整包启动测试** —— 用真 DSH 0.2.0-rc.2 启动本包 profile 至 Web 服务监听，
   `dsh-computer-use` 与 preset 行均正常激活，**无启动失败日志**。

排查过程中出现过一次 `cannot get required service "tools" in inactive context`，
复现后确认只发生在 `link:`（把 `node_modules` 软链回源码目录）的临时测试环境里；
整合包用 pnpm 安装的是**真实副本**，不走软链解析，因此不受影响。

## 依赖与安装

- 新增依赖（按提交精确钉死，与包内既有的 `dsh-agent-arena`、`dsh-qqbot` 同一约定）：
  ```json
  "dsh-computer-use": "github:wushi2333/dsh-computer-use_codex-style#72f390ae076948968370510ea7f5b44dcf3e6015"
  ```
- **注意名称冲突**：npm 上的 `dsh-computer-use` 是**另一个项目**
  （[988hj7tczd-oss/dsh-computer-use](https://github.com/988hj7tczd-oss/dsh-computer-use)，
  虚拟鼠标 + 直读截图，与上游无关）。本包用 `github:` 指定仓库，避免误装。
- Windows 10/11 x64；预编译 Rust helper 随包分发，无需 Rust 工具链。
- 浏览器目录（`tab_*`）需要 Python 3.10+，桌面 13 个方法不需要。

## 其余内容

基座 DSH 0.2.0-rc.2、其余 23 个插件、原 47 个自带 skill 均与 v2.5.1 完全相同。
本版共 25 个 bundle、49 个自带 skill。
