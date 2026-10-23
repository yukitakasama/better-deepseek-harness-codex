# better-deepseek-harness-codex v2.9.0 发行说明（**预发布 pre-release**）

> 功能版，但**不走正式版**：版本号按常规推进一个小版本（2.8.1 → 2.9.0），
> GitHub Release 以 **Pre-release** 形式发布。基座 DSH 0.2.0-rc.2 不变。
>
> 本版做两件事：**桌宠换装**（鲸鱼娘 → dsh-pet）与**新增 ego-lite 浏览器自动化**。

## 变更内容

### 1. 桌宠换装：`dsh-whale-girl-pet@0.3.7` → `dsh-pet@0.3.8`

上游：[PC2005-cloud/dsh-pet](https://github.com/PC2005-cloud/dsh-pet)（npm `dsh-pet@0.3.8`，
registry 最新版，2026-10-22 发布），**未做任何源码修改**。

- **形态**：蓝色大肥鱼。97 段透明动画无缝衔接（打瞌睡 / 玩魔方 / 写代码 / 吃火锅……）、待机呼吸、
  左右转向、屏幕漫游、点击 Q 弹、拖拽甩抛反弹、右键点播动作、余额动画 + 头顶联想气泡、
  偶尔碎碎念与对话（可配表情包）。
- **可多开同屏**；也能把宠物落到**桌面**（透明置顶小窗）——宿主首次找不到本机 Electron 时会自己
  下载一份 runtime 到 `~\.dsh/electron`（同版本只下一次，进度打在 DSH 控制台）。
  下载失败或不想用只影响桌面模式，**浏览器端零配置照常可用**；设置页「显示位置」可在
  「仅浏览器 / 仅桌面 / 两者」之间切换。
- **落位**：行标识 `dsh-pet`，由插件自带 `cordis.patch.yml` `- insert:` 提供；设置分区走
  `settings.section`（`pet-config`），宠物本体是 `position: fixed` 浮层，**不占侧栏槽位**，
  因此与 `@michengai/dsh-codex-ui` 的侧栏改造无冲突 —— `overrides/cordis.patch.yml`
  **本版未新增任何条目**，只把两处注释里的包名同步为 `dsh-pet`。

**兼容性判定**（`semver.satisfies(0.2.0-rc.2, peer, { includePrerelease: true })` 口径）：

| 项 | 值 | 结论 |
| --- | --- | --- |
| 9 个 `@deepseek-ai/dsh-*` peer | `^0.2.0-rc.1`（agent-default-model / client-connection / client-ui-primitives / client-ui-slots / commands / credentials / home-paths / host-webserver / llm） | 0.2.0-rc.2 全满足 ✅ |
| 插件自带 `dsh.compatibility.dshReleases` | `0.1.7-rc.2: incompatible`、`0.2.0-rc.1 / 0.2.0-rc.2 / 0.2.1-rc.2: compatible` | 声明兼容 ✅ |
| 非 `dsh-*` peer | cordis `^4.0.4`（宿主 4.0.4）、react / react-dom `^18.2.0` | 与既有插件同基线 ✅ |
| 平台 | `dsh.client.platform: web`、client 注入 `@deepseek-ai/dsh-client-connection` | 与 web 基座匹配 ✅ |

### 2. 新增 ego-lite（`ego-browser` skill）

上游：[citrolabs/ego-lite](https://github.com/citrolabs/ego-lite) v2.1.0（tag `v2.1.0`，
commit `4cf7935`）。ego-lite 是给 AI agent 用的 Chromium：agent 复用用户**已登录**的浏览器状态
开网页、填表、点击、截图、取数据，不另起空白浏览器、不打断用户操作。

**为什么投递 skill 而不是插件依赖**（本版关键技术判断）：

1. 上游为 DSH 准备的入口是 `plugins/ego`，包名 `@citrolabs/ego`，其 `dsh/src/index.js`
   只做一件事——把随包的 `ego-browser` Skill 注册成 skill provider（`ctx.skills.registerProvider`），
   没有任何 UI 或工具注册；
2. 该入口的 `skills/ego-browser` 在 git 里是**软链**（`git tree` 里是 blob 120000，指回仓库根的
   `skills/ego-browser`）。npm/pnpm 打包 git 依赖时会丢掉软链；
3. **实测**：`pnpm add github:citrolabs/ego-lite#path:/plugins/ego` 能装上 `@citrolabs/ego@2.1.0`，
   但包内没有 `skills/` 目录，`import('@citrolabs/ego/dsh')` 抛
   `ENOENT ... @citrolabs/ego/skills/ego-browser/SKILL.md`（模块在顶层 `readFileSync`，导入即死）；
4. 上游 README 亦写明「npm omits the linked Skill when packing the source directly」，其官方
   DSH 分发物 `@citrolabs/ego-deepseek-harness` **未发布到 npm**（registry 404），只存在于其
   打包脚本产物 `ego-deepseek-harness-v2.1.0.tgz` 里，安装方式是本地解包后
   `dsh plugin add <dir>` —— 无法表达成 dspack 的依赖项（dspack 只携带 manifest / package.json /
   pnpm-workspace.yaml / patch 层 / `home/`）。

因此本包直接把**同一份** `skills/ego-browser/`（22 个文件：`SKILL.md`、`references/`、
`scripts/install.sh`、`learnings/`、`assets/`、`agents/`，约 90 KB）随 `home/skills/` 投递到
`DSH_HOME/skills/ego-browser/`。效果与装该插件等价（插件本身只是 Skill provider），且不依赖 git
打包行为，也不引入安装期网络依赖。**等上游把 `@citrolabs/ego-deepseek-harness` 发上 npm 后，
本包可改回插件依赖形态。**

**使用前提**：`ego-browser` 命令由 ego lite 桌面 App 提供。macOS 可用 skill 自带的
`scripts/install.sh`（步骤见 `references/install.md`）；**Windows 没有安装脚本**，需到
<https://lite.ego.app/> 下载安装包手动安装，完成一次性 onboarding 后才会把 `ego-browser` 写进
PATH，且只有 onboarding 之后**新开的终端**才认得该命令。本包只投递 Skill 文本与小图，
不含浏览器二进制。

## 计数口径

| 项 | v2.8.1 | v2.9.0 |
| --- | --- | --- |
| 插件 | 24 | **24**（1:1 换装） |
| manifest `bundles` | 26（含 2 个官方基座） | 26 |
| manifest `dependencies` | 24 | 24 |
| README 主清单表行 | 24 | 24 |
| compat-check 在装插件 | 12 | **13**（新增 `dsh-pet@0.3.8` 条目） |
| 自带 skill | 49 | **50**（新增 `ego-browser`） |

## 发行通道（本版新增机制）

`.github/workflows/release.yml` 新增发布通道判定：读取 `docs/prerelease-versions.txt`，
若当前 `manifest.version` 被逐行列在其中，则 `gh release create` 追加 `--prerelease`。
本次已在其中登记 `2.9.0`。后续版本想发正式版，只要不放进去即可；想再发预发布，追加版本号。

## 验证

- `node --check docs/compat-check.cjs` 通过；`node docs/compat-check.cjs` 退出码 0，
  **在装插件 13/13 通过 peer 门禁 ✅**（候选池 1 个不兼容条目 `dsh-edit-resend` 不计入）；
- `package.json` 与 `manifest.json` 的 `dependencies` / `bundles` 集合一致（24 / 26）；
- README 主清单表 24 行，与 `dependencies` 24 条逐项一致；
- `python scripts/build-dspack.py . .` 打包成功，dspack 内 `home/skills/ego-browser/` 条目齐全，
  打包期的 `home/**/home/**` 嵌套守卫未触发；
- 全仓检索 `whale` 仅剩 README / README.en 的 v2.0.0 历史变更表与本次变更记录。

## 升级说明

覆盖安装即可：桌宠由 `dsh-whale-girl-pet` 换成 `dsh-pet`，旧包的 pet 配置（`$DSH_HOME` 下
whale-girl 相关目录）不再被读取，可手动删除；`dsh-pet` 的配置首次启动时自动初始化。
新增的 `ego-browser` skill 只是文件投递，无需额外操作；想用浏览器自动化时先装 ego lite 本体。

## 发行资产

`better-deepseek-harness-codex-2.9.0.dspack` 与同名 `.dspack.sha256`
（64 字节十六进制，无换行）。GitHub Release 标记为 **Pre-release**。
