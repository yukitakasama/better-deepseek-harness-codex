---
name: upstream-pr-readiness
description: 向上游仓库（fork → 原仓库）提交 PR 前的标准核验与提交。当用户说「检查是否符合提 PR 的标准」「帮我开 PR / 开 draft PR / 转正式 PR」「推上游」时使用。核心是先读上游 CONTRIBUTING.md 与 PR 模板拿到权威标准，再逐项核验（非重复、可合并、门禁全绿），最后才提交。
agent_created: true
---

# 上游 PR 提交前的标准核验

## 核心原则

1. **标准以上游文件为准，不凭印象。** 先读 `CONTRIBUTING.md`（PR Guidelines / PR Checklist / Commit Convention / AI-Assisted Contributions）+ `.github/pull_request_template.md`。很多仓库对 AI 辅助贡献有硬性条款（要求本地实测、要求小而聚焦、无事先讨论的"路过式 PR"可被直接关闭）。
2. **所有计数在提交前必须重新算。** 归档文案里的「上游领先 N 提交」会随时间失效——开 PR 前先 `git fetch` 再刷新。
3. **commit ≠ push ≠ 开 PR**，是三件独立的事，各自需要明确授权。

## 步骤 1：拿到权威标准 + CI 触发条件

```bash
# 权威标准
ls CONTRIBUTING.md .github/CONTRIBUTING.md .github/pull_request_template.md .github/PULL_REQUEST_TEMPLATE.md
ls .github/workflows/          # 先看有哪些 workflow，别假定有 ci.yml
# CI 到底什么时候跑（决定"等 CI 全绿"这条门是否走得通）
sed -n '1,40p' .github/workflows/ci.yml
# CI 实际执行的命令（照着本地跑，而不是自己猜门禁）
grep -nE "^        run: |pnpm |cargo " .github/workflows/ci.yml | head -40
```

**三个文件可能都不存在**（小仓库、个人项目很常见，已实测 `jimmgreen/pulse` 就是这种：无 `CONTRIBUTING.md`、无 PR 模板、`.github/workflows/` 里只有 tag 触发的 `release.yml`）。
找不到时的降级顺序：`CONTRIBUTING.md` → 仓库根 `AGENTS.md` → `README.md`/`README.en.md` + `git log` 里既有提交的**前缀风格**（如 `release:` / `app:` / `sidebar:`）。
此时「PR 标准」只能从 AGENTS.md 的 PR 条款（行为、风险、实测结果、关联 issue、可见 UI 变更的 before/after 截图）与既有提交惯例里提取，**不要因为文件缺失就跳过这一步**。

## 步骤 2：核验"是否值得提 / 是否重复"

```bash
# 关联 issue 还开着吗
gh issue view <N> --repo <upstream> --json number,title,state,labels

# 已有人提过 PR 吗（同时查自己 fork 的分支）
gh pr list --repo <upstream> --search "<N>" --state all --limit 20
gh pr list --repo <upstream> --head <user>:<branch> --state all

# 上游是否已经自己修了（用你新增的符号名去 grep，最直接）
git grep -n "<你新增的函数名>" upstream/main -- src/ 2>/dev/null
```

**⚠️ diff 口径陷阱（最容易误判）**

`git diff --stat HEAD upstream/main` 会**把你自己的补丁反向算进去**，看起来像"上游大改了同一个文件"。
判断「上游改了哪些文件」必须用**只算上游自身改动**的口径：

```bash
MB=$(git merge-base HEAD upstream/main)
git diff --stat $MB upstream/main -- <你的文件列表>      # 上游自身改了多少
git log --oneline $MB..upstream/main -- <某个文件>        # 是哪个提交改的
git rev-list --count HEAD..upstream/main                  # 真的落后多少
```

## 步骤 3：核验可合并性（不改动当前分支）

```bash
# 文本层面：无输出冲突列表 = 干净
git merge-tree --write-tree --name-only HEAD upstream/main

# 真实重放：临时 worktree 试 cherry-pick，看重放出的 diff 是否与你原提交一致
rm -rf /tmp/verify && git worktree add -q --detach /tmp/verify upstream/main
cd /tmp/verify && git cherry-pick --no-commit <你的 commit>
git diff --cached --stat
# 完事一定要清理
git worktree remove --force /tmp/verify
```

自动合并干净 **不等于**语义上能编译。上游若改过你触及的**同一个函数**，只能靠编译/CI 证实——
报告时要说清"静态核对风险低，但不等于已验证"。

## 步骤 4：跑上游 CI 真正跑的那些门禁

照抄 `ci.yml` 的 `run:` 值，不要自己发明。常见组合：

```bash
pnpm typecheck && pnpm format:check && pnpm test:unit && pnpm build:renderer
cargo fmt --check && cargo clippy -- -D warnings && cargo test
```

**环境坑（Windows 本机）**

- `node_modules/.bin` 不存在 → `tsc` 会命中全局版本报 `TS5102 Option 'baseUrl' has been removed`、`prettier` 报"不是内部或外部命令"。
  **这是依赖没装完，不是 tsconfig 写错。** 修：`pnpm install`；若被 esbuild postinstall 的 `spawnSync <node.exe> EBUSY` 拦住 →
  `pnpm install --ignore-scripts`。
- 全量 `cargo test` 并行编译报 `os error 1455`（`ERROR_COMMITMENT_LIMIT`，提交内存/页面文件耗尽）→ 用 `-j 2 --no-fail-fast`。
- 失败数在多次运行间浮动 = 并行串扰/资源争抢，**不要拿被中断或高负载下的运行结果当基线**。
  隔离验证法：单独跑那个失败文件；**单跑通过 + 全量失败 = 本机抖动**，报告时如实写明并指出该文件是否被你改过。

## 步骤 5：fork PR 的 CI 现实（别把它当门）

**先分清两种仓库，别套错剧本：**

- **A. 有 `on: pull_request` 的 workflow** —— 下面三段适用。
- **B. 完全没有 PR 触发的 workflow**（只有 tag 触发的 release/打包流程，已实测 `jimmgreen/pulse`）—— 开 PR 后**一条 run 都不会有**，
  `gh api .../actions/runs?head_sha=<sha>` 的 `total_count` 是 **0**。这不是"还没跑"，是"结构上不会跑"。
  此时唯一能拿到自动化门禁的路径是**用 tag 触发上游/fork 的打包流水线**（注意 `workflow_dispatch` 常因"tag 必须匹配 version.txt"而必然失败），
  或者干脆以**本地实测**作为全部证据 —— 但必须在 PR 正文里显式写明"本仓库无 PR 触发的 CI，以下为本地实测"，
  否则评审者会把空白检查区误读成"CI 全绿"。

A 情况下的现实：

- `on: pull_request:[main]` / `push:[main]` → **push 到 fork 分支不触发任何 CI**。fork 的 Actions 运行数是 0，是"从未跑过"而非"全绿"。
- 开 PR 后上游 `CI` 状态是 **`action_required`**：fork PR 需**维护者点 "Approve and run workflows"** 才真正开跑。
- **已实测**：`gh pr edit`（改正文）与 `gh pr ready`（转正式）**都不会触发新的 CI 运行**，按 head SHA 查询始终只有创建时那几条 run。

```bash
gh api "repos/<upstream>/actions/runs?head_sha=$(git rev-parse HEAD)" \
  --jq '.total_count, (.workflow_runs[]? | "\(.name) | \(.event) | \(.status) | \(.conclusion)")'
```

→ 结论：在等维护者批准之前，只能靠**本地门禁 + 静态合并核对**作为证据，并把这一限制写进 PR 正文。

## 步骤 5b：在 fork 上跑 tag 触发的 release（已实测 `jimmgreen/pulse` → `yukitakasama/pulse`）

想用 fork 的打包流水线产出安装包时，**先确认 fork 的 Actions 真的启用了**。新建的 fork 常常处于"未启用"状态：
Actions 页面写着 **0 workflow runs**，`GET /actions/workflows` 返回 `total_count: 0`（哪怕 `main` 上确实有 `.github/workflows/release.yml`）。
这种状态下**推 tag 不会触发任何东西，而且没有任何报错** —— 纯静默失败，最容易误以为是"还在排队"。

```bash
# 症状：fork 上一个 workflow 都没注册
gh api repos/<owner>/<repo>/actions/workflows --jq '.total_count'   # 0
gh workflow list --repo <owner>/<repo> --all                        # 空

# 修复：显式开启。必须用 -F 让 gh 发布尔值；用 -f 会发字符串 → HTTP 422
#       "For 'properties/enabled', \"true\" is not a boolean."
gh api -X PUT repos/<owner>/<repo>/actions/permissions -F enabled=true
gh api repos/<owner>/<repo>/actions/workflows --jq '.total_count'   # 1 ✅ 已注册
```

其余要点：

- **`workflow_dispatch` 可以带 tag**：`gh workflow run <wf> --ref <tag>` 会让 `github.ref = refs/tags/<tag>`，
  于是"tag 必须等于 `v$(cat version.txt)`"这类校验**能通过** —— 不必删掉 tag 再重推。
- **⚠️ 但派发的 ref 上必须真有那个 workflow 文件。** GitHub 是从**该 ref 的树**里读文件来判断有没有
  `workflow_dispatch` 触发器的；文件不在上面就报 `HTTP 422: Workflow does not have 'workflow_dispatch' trigger`
  （**不是**"fallback 到默认分支"，这点极易搞错，已实测）。
  推论：**一旦把某个 workflow 文件从特性分支摘掉（为了不让它进上游 PR），就再也不能直接派发那个分支了。**
  想跑就得另建一个一次性分支 = 特性分支 commit + 那个文件，并把 `publish`/发布类 job 用 `if: false` 关掉
  （别让临时分支去动属于主干的滚动 release）—— 这个分支永远不要当 PR head。
- **release 脚本常把仓库名写死**（已实测 `publish_release.ps1` 里 `$repository = 'jimmgreen/pulse'`），
  加上 fork 没有 `secrets.*`（`gh secret list` 为空）→ **publish job 在 fork 上必然失败**，这是结构性的、不是配置疏漏。
  办法：只把 `build` job 当门禁，`gh run download` 取 artifact，再自己 `gh release create --repo <fork>` 组装 release，
  并在 release 说明里写清"缺签名清单 → 应用内自动更新不可用"。
- **tag 里的非数字后缀过不了校验**：`version.txt` 通常被要求 `^\d+\.\d+\.\d+$`，配套 tag 也得是 `v<x.y.z>`。
  想给构建起"日期 + pre"这类名字，把 `-pre` 放到 **Release 名称**（`--title`）而不是 tag 上 ——
  GitHub 的 Release 是「tag」+「名称」两栏，只有 tag 受校验。
- **日期版本用 `2026.10.4`，不要写 `2026.10.04`**：Pulse 的 `ParseVersion` 拒绝带前导零的分段（`04` 直接判非法）。

## 步骤 6：提交

```bash
# 正文写成文件（避免多行引号转义；长正文用 --body-file）
gh pr create --repo <upstream> --base main --head <user>:<branch> \
  --title "<conventional 标题>" --body-file "<body.md>" --draft

gh pr ready  <N> --repo <upstream>                                  # draft → 正式
gh pr edit   <N> --repo <upstream> --body-file "<body.md>"           # 改正文
```

`--body-file` 先写到**纯 ASCII 路径**（如 `/d/tmp/pull-body.md`）提交，成功后再复制一份进归档目录（归档路径常含中文），
可绕开部分环境对中文路径的转义问题。

**正文建议包含**：Summary / Related Issue（`Fixes #N`）/ Validation 表（逐条命令 + 结果，含失败项的真实原因）/
Relationship to current main（领先提交数、merge-tree 结果、非重复论证）/ Checklist / **未包含的内容**（明确划出本次不做的范围，省掉评审者追问）。
未做的验证（如无 Key 无法端到端、宿主环境不支持某些特性）**必须显式写明**——AI 辅助贡献条款下，隐瞒比缺失更致命。

**双语发布**：若上游要求或需要中文审阅，把英文段与中文段拼接成一份正文即可。
可拼接的前提是**两段的小节标题不重名**——英文标题写成双语形如 `## Summary / 概述`，中文段用纯中文 `## 概述`，
拼后不重名，就不必用 `<details>` 折叠。

## 步骤 6b：更新已开的 PR（draft）

**没有"刷新 PR"这个动作。** PR 的 head 是 `<user>:<branch>`，**往该分支 push，PR 自动跟到新 commit**。
`gh pr view <N> --json headRefOid,commits` 复核即可。改正文用 `gh pr edit --body-file`。

**评论与转正一律用 `gh`，不要上浏览器自动化**（2026-10-05 实测教训）：

```bash
gh pr comment <N> --repo <upstream> --body-file "<comment.md>"   # 发评论，返回 issuecomment 链接
gh pr ready   <N> --repo <upstream>                              # draft → 正式
gh pr view    <N> --json isDraft,state,mergeable,headRefOid      # 回读校验
```

`gh` 已持有登录态，一条命令即完成；而 Playwright / agent-browser 之类需要**单独复现 GitHub 登录态**，
极易卡在「独立 profile 未登录 → 空白页 → 残留状态报 `os error 10060`」上，纯属自找麻烦。
**除非用户明确要求"点界面"、或该操作确实没有 CLI 等价物，否则先问一句「能用 gh 吗」。**

**⚠️ 更新前必须先查「这次 commit 到底带了什么文件」——GUI 客户端最容易在这里出事。**

GitHub Desktop / 各 GUI 的 Changes 列表里，**未跟踪文件也是可勾选的**；用户习惯性"全选 + 提交"就会把
工作区噪音一起塞进 PR：`.workbuddy/` 之类的本地目录、审查稿、大二进制（几十 MB 的安装包）、
甚至 fork 专用的 workflow 文件。**这些一旦推上去就出现在 PR 的 Files changed 页面上，评审者直接可见。**

```bash
# 查某次提交实际含哪些文件（识破 GUI 全选误纳）
git show --name-only --format="" <sha>
gh pr view <N> --repo <upstream> --json files --jq '.files[].path'   # 上游看到的完整清单
```

**剔除方式二选一**：

| 方式 | 命令 | 代价 |
|---|---|---|
| 重做提交 + 强推（**首选**） | `git reset --soft HEAD~1` → `git restore --staged .` → 只 `git add <该提交的文件>` → `git commit -F <msg>` → `git push --force-with-lease <fork> <branch>` | 分支被改写，PR 上显示 force-pushed；但大二进制**不会留在历史里** |
| 追加删除提交 | `git rm --cached <paths>` + commit | 不改写历史；但二进制**永久留在分支历史**、`git clone` 永远要拉 |

用 `--force-with-lease` 而非 `--force`：本地引用与远端不一致时会拒绝，避免覆盖他人（或你自己另一台机器）的提交。

**预防（做一次，永久生效）**：把本地私有路径写进 **`.git/info/exclude`**（不是 `.gitignore`）——
`exclude` 不进版本库，因此**忽略规则本身不会成为 PR diff 的一部分**：

```bash
cat >> .git/info/exclude <<'EOF'
/.workbuddy/
/docs/<内部审查稿>.md
/.github/workflows/<fork 专用>.yml
EOF
```

写完 `git status --short` 应为空、`git status --ignored --short` 能看到被挡住的路径。
注意：`exclude` 对**已跟踪**文件无效——若某个文件已经被误提交，得先 `git rm --cached` 才会生效。

**分支名陷阱**：fork 工作流里，本地 `main` 常常跟踪的是 **上游 `origin/main`**，而承载 fork 自己
（如 fork 专用 workflow 文件）的分支叫 `workflow-main` 之类。**在 `main` 上提交推送 = 直接打到上游仓库。**
推之前永远先 `git branch --show-current` + `git rev-parse --abbrev-ref HEAD@{upstream}` 确认。

## 常见坑速查

| 坑 | 正确做法 |
|---|---|
| 靠印象判断 PR 标准 | 读 `CONTRIBUTING.md` + PR 模板 |
| `git diff HEAD upstream/main` 判断上游改动 | 用 `$(git merge-base HEAD upstream/main)` 作为基线 |
| 等 fork CI 全绿 | 结构上不可行；改为记录 `action_required` + 本地门禁 |
| `node_modules/.bin` 缺失当成代码问题 | `pnpm install --ignore-scripts` |
| `os error 1455` 当成缓存脏 | 是页面文件/提交内存不足，`-j 2`；`cargo clean` 治不好 |
| 归档文案数字过期 | 开 PR 前重新 fetch 并同步**所有副本**（PR 正文 / 计划文档 / REPORT / INDEX） |
| 自动合并干净就当验证过了 | 语义层面仍需编译/CI 证实，措辞要留余地 |
| 上游没有 `ci.yml`（只有 tag 触发的 release） | head_sha 的 runs `total_count=0` 是**结构性**的，不是"还没跑"；正文显式写明"本仓库无 PR 触发 CI，以下为本地实测" |
| 想把截图内联进 PR 正文但没有公开 URL | 本地文件引用不了；要么显式披露"截图本地留存、可按需补"，要么推一个**独立证据分支**再引 raw 链接（别往 feature 分支塞二进制） |
| 只捕获了 after、没有 before 截图 | AGENTS.md 类要求 before/after 时，如实写"before 需另建 worktree 编译上游 main，本次未捕获"，不要含糊成"已验证" |
| PR 标题语言与正文语言不一致 | 正文按用户要求用中文时，**标题仍建议匹配仓库 commit 前缀惯例**（如 `list:` / `app:`），避免破坏维护者的历史可读性 |
| fork 上推了 tag 却一条 run 都没有 | fork 的 Actions 未启用（`actions/workflows` total_count=0，**静默失败无报错**）→ `gh api -X PUT .../actions/permissions -F enabled=true` |
| `gh api -f enabled=true` 报 "is not a boolean" | 用大写 `-F`（typed field），小写 `-f` 发的是字符串 |
| 想用 `workflow_dispatch` 跑 tag 校验逻辑 | `gh workflow run <wf> --ref <tag>`：`github.ref` 就是 `refs/tags/<tag>`，校验可过，无需删 tag 重推 |
| 把 workflow 文件从特性分支摘掉后还想派发它 | **不行**：GitHub 从该 ref 的树里找文件判断有没有 `workflow_dispatch` → `HTTP 422: Workflow does not have 'workflow_dispatch' trigger`。另建一次性分支（特性分支 commit + 该文件、`publish.if: false`）来跑 |
| 用 `2026.10.04` 这类日期做版本号 | 前导零会被版本解析拒绝，写 `2026.10.4` |
| fork 的 publish job 必然失败 | 脚本写死上游仓库名 + fork 无签名 secret；只拿 `build` 的 artifact，自己 `gh release create` |
| 用 GUI 提交时"全选"把未跟踪文件带进 PR | 提交前 `git show --name-only --format="" <sha>` 核文件清单；把私有路径写进 `.git/info/exclude` 预防 |
| 误纳后想清理 | `git reset --soft HEAD~1` + 只 add 该提交的文件 + `--force-with-lease` 强推；别用追加删除提交（大二进制永久留在历史） |
| 想"刷新一下 PR" | 没有这个动作，push 到 head 分支即自动更新；改正文才用 `gh pr edit --body-file` |
| 想发 PR 评论 / 把 draft 转正，却去开浏览器自动化 | **用 `gh pr comment --body-file` / `gh pr ready`**。浏览器（Playwright/agent-browser）要单独复现登录态，常卡在"未登录/空白页/profile 残留 `os error 10060`"；`gh` 一步到位 |
| 在本地 `main` 上提交推送 | 先查 `git branch --show-current` + `HEAD@{upstream}`——fork 工作流里本地 `main` 常跟踪**上游**，在它上面推等于直接改上游 |
| 用 `pathlib.write_text()` 改仓库里的文本文件 | Windows 上默认文本模式把 LF 翻成 CRLF → `git diff` 显示整文件替换。改用 `read_bytes()/write_bytes()` 并显式 `replace(b"\r\n", b"\n")`；提交前看 `git diff --stat` 规模是否符合预期 |
