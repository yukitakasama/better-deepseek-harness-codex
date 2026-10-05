---
name: gh-ci-failure-triage
description: 定位并修复 GitHub Actions CI 失败。当用户说「CI 挂了 / 测试没过 / 流水线红了」「帮我修一下 CI」、或给出某个 fork/仓库链接要求修复未通过的检查时使用。核心是先用 gh CLI 拿到真实失败 job/step，再本地复现，避免靠猜逐个跑检查。
agent_created: true
---

# GitHub CI 失败定位与修复

## 核心原则

**先拿真实日志，再动手。** CI 报错的 job 数量 ≠ 真实问题数量。

## 步骤 1：用 gh 定位真实失败点（不要本地盲跑）

```bash
# 最近几次运行的状态
gh run list --repo <owner>/<repo> --limit 8

# 某次运行各 job 的结论 —— 一眼看出到底哪几个 job 红
gh run view <run_id> --repo <owner>/<repo> \
  --json jobs --jq '.jobs[] | "\(.conclusion)\t\(.name)"'

# 直接看失败步骤的日志 —— 最省事的定位方式
gh run view <run_id> --repo <owner>/<repo> --log-failed
```

`gh` 已登录即可用；**`web_fetch` 访问不了 github.com**（被 harness 拦截），取 GitHub 内容一律走 `gh`。

## 步骤 1.5：先分清「跑挂了」还是「根本没跑」

**一眼判据：看 run 的显示名。**

| run 名字显示为 | 含义 |
| --- | --- |
| workflow 的 `name:`（如 `Quality gate and preview release`） | 文件解析成功 |
| **文件路径**（如 `.github/workflows/quality-and-preview.yml`） | **文件非法，GitHub 兜底用路径当名字** |

后者伴随 GitHub 页面上的一行 `This run likely failed because of a workflow file issue.`，
且 **`jobs` 数组为空（jobsCount = 0）**——一个 job 都没启动，日志里什么都看不到。

```bash
# 判定：jobsCount 为 0 且 run 名是文件路径 → 是 workflow 文件本身的问题，不是代码/测试
gh run view <run_id> --repo <owner>/<repo> --json name,status,conclusion,jobs \
  --jq '{name, jobsCount:(.jobs|length)}'
```

**为什么容易漏**：`gh run list` 里这种 run 也显示 `failure`，和「测试挂了」长得一模一样。
若不查 jobsCount 就去翻日志，会白跑一趟——**没有日志可翻**。

### 常见触发：`permissions:` 里写了非法 scope

GITHUB_TOKEN 的 `permissions` 只有固定的一批合法值（`actions` / `contents` / `checks` /
`issues` / `pull-requests` / `packages` / `statuses` / `id-token` / `attestations` 等）。
GitHub 的 workflow JSON Schema 是 `additionalProperties: false`，**多一个未知键 → 整个文件解析失败**，
表现为上面那种「0 job、run 名是路径」。

**头号陷阱：`workflows: write` 不存在。** 报错信息通常写作
`Unexpected value 'workflows'`。它常被误加来修这样的失败：

```
refusing to allow a GitHub App to create or update workflow
  '.github/workflows/xxx.yml' without `workflows` permission
```

即 job 里的 `git push` 要移动一个 **指向含该 workflow 文件的 commit** 的 tag/ref。
**这不是权限能解决的问题**：GITHUB_TOKEN 按设计禁止改动 `.github/workflows/` 下的任何东西，
`permissions:` 块怎么写都授不出来（平台硬边界）。正确修法只有 PAT：

1. 建 fine-grained PAT，勾 `Contents: Read and write` + **`Workflows: Read and write`** + `Metadata: Read`；
2. 存进 secret（如 `PREVIEW_TOKEN`）；
3. **把 `token: ${{ secrets.PREVIEW_TOKEN }}` 传给 `actions/checkout`**——
   只在 push 步骤设 `GH_TOKEN`/`GH_REPO` 是**无效**的，因为 checkout 早已把凭据写进 git config。

**在动手换 PAT 之前先试一次**：如果该 workflow 文件当时在默认分支上还不存在，那个 push 本来就会被拒；
等文件进了默认分支后，同样的 push 可能自己就通过了（失败前提消失了）。

**已实测确认**（`jimmgreen/pulse` → `yukitakasama/pulse`）：先误加 `workflows: write` → 整个 workflow 连续 3 次
0 job 静默失败；只删掉那一行后，同一个 push 步骤在 25 秒内成功，**根本不需要 PAT**。
先删非法行重跑，别直接上 PAT。

## 步骤 2：警惕「前置步骤失败屏蔽后续步骤」

job 内步骤默认串行短路：**第一步挂了，后面的步骤根本没执行**（日志里显示为 `-` 而非 `✓`/`X`）。

典型例子：Quality job 顺序是 `fmt → clippy → test → build`，`cargo fmt --check` 一挂，
clippy/tests/build 全被跳过，于是 3 个平台 job 同时红灯，**但真因只有 fmt 一项**。

所以：**被跳过的步骤必须本地补跑**，不能因为 CI 只报一项就认为后面没问题。

## 步骤 3：本地复现并修复

按 CI 配置里的命令原样跑一遍（读 `.github/workflows/*.yml` 取准确命令）。
修完后**重跑全部检查**，包括 CI 里被跳过那些。

## 步骤 4：提交推送 + 看 CI 转绿

```bash
git push origin <branch>
gh run list --repo <owner>/<repo> --limit 1      # 确认已触发
gh run view <run_id> --repo <owner>/<repo> \
  --json jobs --jq '.jobs[] | "\(.conclusion // "RUNNING")\t\(.name)"'
```

fork 仓库先确认 remote：`git remote -v`，`origin` = 自己的 fork，`upstream` = 上游。
**用户没要求时不要推 upstream，也不要开 PR。**

## 本机环境坑（Windows 沙盒）

| 现象 | 根因 | 绕法 |
|------|------|------|
| `rm -rf dist` 或 `pnpm build` / `vite build` 报 `SAFE_DELETE_BULK_CONFIRM_REQUIRED {count:178, threshold:50}` | 沙盒批量删除保护（单轮 >50 个文件）拦了删除；vite 的 `emptyOutDir` 也会触发，**不是代码问题** | **用 `mv dist /tmp/xxx` 移走**（dist 不存在时 vite 直接新建，零删除）。别硬删；`CODEBUDDY_SAFE_DELETE_ENABLED=0` 可整体关 shim，但没必要为一个可再生的构建目录关安全开关 |
| `wsl.exe` Permission denied / `PROGRAM BLOCKED BY SECURITY POLICY` | wsl 在沙盒程序黑名单 | 无法本地跑 Linux 复验，改为推 CI 验证；代码若无 `#[cfg(unix)]` 等平台分支则风险通常很低 |
| Rust 构建报 `E0107: struct takes 3 generic arguments`（schemars/indexmap） | autocfg `std` 探测在非交互环境静默失败 | `export RUSTFLAGS="--cfg has_std"` |
| CI 的 `Rust tests` 在 linux/macos 红、Windows 却绿，报错含 `numeric field was not a number ... when getting size for <某路径>` | 被测代码/测试夹具里构造的 tar 头**目录/符号链接条目漏了 `set_size(0)`**，`tar` 0.4.x（如 0.4.46，锁版本）严格解析 size 字段会拒收畸形头；Windows 常走 zip 分支或该测试模块是 `#[cfg(unix)]` 故未暴露 | 给 tar 夹具里**每个非文件条目（目录、symlink）显式 `set_size(0)` 再 `set_cksum`**；文件条目用 `set_size(data.len())`。此坑本机（Windows）跑不到，只能推 CI 实证 |

## 两个易错判断

1. **`git diff -w` 证明不了「纯格式化」**——`-w` 只忽略行内空白，而 rustfmt/prettier 是跨行合并/拆分，仍会出 diff。确认无语义变更要肉眼看 hunk，并以「lint + 测试仍全绿」交叉验证。
2. **本地全绿 ≠ CI 全绿**：unix/macOS 专属测试（`#[cfg(unix)]`）在本机跑不到。改动涉及平台分支时，grep 一遍 `#[cfg(unix/windows/target_os)]`，推上去靠 CI 实证。

## 本地构建并发布（Tauri 项目实战）

想绕开 CI 自己在本地出一个发行版时：

```bash
# 1) 打版本戳（复用项目自带脚本，别手改 manifest）
node ci/set-version.mjs 0.2.7-dev.<日期> && node ci/check-versions.mjs
# 2) 移走旧产物（不要用 rm -rf）
mv dist /tmp/dist-old-$(date +%s)
# 3) 构建，bundles 要与 CI matrix 保持一致（例：Windows 只 --bundles nsis，
#    MSI 在 dev 版本上被上游刻意禁用——WiX 不允许非数字预发布段）
RUSTFLAGS="--cfg has_std" pnpm tauri build --bundles nsis
# 4) 发布（不带 --prerelease 即为正式 release；源码归档由 GitHub 按 tag 自动生成）
gh release create v<版本> --target "$(git rev-parse HEAD)" --title "..." \
   --notes-file body.md <产物路径>
# 5) 还原版本戳（关键，dev 版本戳绝不能提交）
git checkout -- package.json src-tauri/tauri.conf.json src-tauri/Cargo.toml src-tauri/Cargo.lock
```

两个必知副作用：

- **打包器以 CI matrix 为准**，不要照 `tauri.conf.json` 的 `targets: "all"` 打包，那会带上上游禁用的目标（如 MSI）。
- **`gh release create` 建的 tag 会触发 `on: tags: ["v*"]` 的 CI**。若该仓库的发布脚本要求 tag 版本 == manifest 版本，dev tag 必然不匹配 → CI 必红。发完 `gh run list --limit 3` 看一眼，把误触发的 run `gh run cancel` 掉。

## 提交拆分建议

修 CI 的格式化改动与功能 WIP 混在工作区时，尽量拆成两个提交（`style:` + `feat:`）。
同一文件既含 fmt 又含功能改动时，无法非交互式拆 hunk（别用 `git add -p`），
把该文件整体归入功能提交即可——它本身已是格式化合规状态。
