# better-deepseek-harness-codex v2.5.1 发行说明

> 修复版。插件组合与 v2.5.0 完全一致，唯一变化是 **QQ 机器人频道改为默认关闭**，
> 并切换到 fork 版依赖以消除「启动时卡在扫码」的阻塞行为。

## 核心变化：QQ 机器人不再拖住启动

**问题**：v2.4.0 起纳入的 `@tencent-connect/dsh-qqbot@0.5.0`，在凭据（AppID/AppSecret）
缺失时会于插件 `apply()` 阶段 `await` 一个扫码流程。该 Promise 只有在扫码成功或失败
时才 resolve，二维码过期只会不断刷新、没有超时；cordis 串行加载插件，于是**整个 dsh
实例永远停在「等待就绪」**——Web 服务始终不监听，启动器启动窗口一直转圈。

实测证据（dsh-launcher + 本整合包）：实例进程 00:48:15 拉起 → 00:59:28 用户手动取消，
中间 11 分钟无任何进展；实例日志 268 行里 30 次「二维码已过期，正在刷新…」，全程无
listen/端口输出。

**修复**：

- 整合包 `overrides/cordis.patch.yml` 新增 `- id: im-qqbot` + `disabled: true`，
  默认关闭、按需启用（与本包其他可选插件的写法一致）。
- 依赖从 `@tencent-connect/dsh-qqbot@0.5.0` 切到 fork 版
  `github:yukitakasama/dsh-qqbot#7e88006dff56447248301a282667ab7b63fd70f0`（0.5.1）：
  - 新增 `bindOnStart` 配置项（默认 `false`）——凭据缺失时打印一条 warn 后直接返回，
    不扫码、不阻塞，实例照常启动；
  - 新增 `dsh-qqbot-bind` 命令：扫码绑定从启动流程移到用户主动执行，首次出码时
    自动用默认浏览器打开扫码页（`--no-browser` 可关）；
  - 绑定成功后自动把该条目的 `disabled` 置为 `false`，写回前备份
    `cordis.patch.yml.bak`（`yaml.dump` 会丢注释）。
- fork 版把构建产物 `dist/` 提交入库：上游源码与 `@deepseek-ai/dsh-agent 0.1.0-rc.6`
  的 `CategorizedCommand` 类型不匹配，`tsc` 无法干净通过，若依赖 git 安装的 `prepare`
  构建会直接失败。

## 如何启用 QQ 机器人

凭据二选一，然后启用插件并**重启实例**（开关与环境变量只在进程启动时读取）：

1. **免扫码**：QQ 开放平台创建机器人 → 拿到 AppID/AppSecret → 启动器「实例 → 环境变量」
   填 `QQBOT_APPID` / `QQBOT_SECRET`。
2. **扫码**：在 profile 目录下跑 `npx dsh-qqbot-bind`，手机 QQ 扫码即可。

详见 README「QQ 机器人频道（im-qqbot）」章节。

> ⚠️ 未配置凭据时请不要启用该插件——那就是本次修复的问题现场。

## 其余内容

基座 DSH 0.2.0-rc.2、其余 23 个插件、47 个自带 skill 均与 v2.5.0 完全相同。
