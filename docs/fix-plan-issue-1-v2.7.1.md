# 修复规划 · Issue #1：6 个 skill 嵌套重复目录 + dsh-computer-use 非 Windows import 崩溃

> Issue: https://github.com/yukitakasama/better-deepseek-harness-codex/issues/1
> 报告环境：Android arm64 / proot Ubuntu，DSH 0.2.0-rc.2，`DSH_HOME=/root/.dsh`
> 针对版本：v2.7.0（dspack sha256 `e16568c8…`）
> 计划版本：**v2.7.1**（patch）

---

## 0. Issue 摘要

| # | 问题 | 级别 |
|---|------|------|
| Bug 1 | 6 个 skill 目录内嵌套了 `home/skills/<name>/`，安装后落入 `$DSH_HOME/skills/<name>/home/skills/<name>/`，被 skill 加载器忽略 | 功能缺陷 |
| Bug 2 | `dsh-computer-use` 的 Python sidecar 在非 Windows 平台启动即崩（`win_dpi.py:13` 顶层 `ctypes.WinDLL`），每次启动刷 Traceback | 体验缺陷 |
| 参考 | `dsh-computer-use-win` / `dsh-plugin-wallpaper-engine` / `dsh-workbuddy-connect` 的平台限定行为属"平台边界"，不在本计划修复 | 不修 |

报告者已完成安装验证（`pnpm install`、`--dump-config` 210 条目无重复 id、24/24 启动项、客户端 combo 请求 200、boot 套餐 19 项），两个 bug 均为独立数据/代码问题，不涉及插件组合冲突。

---

## 1. 本地核实（已在源码树确认）

### Bug 1：嵌套 skill 目录 —— 确认存在

```
home/skills/agent-browser/home/skills/agent-browser/SKILL.md
home/skills/docx/home/skills/docx/SKILL.md
home/skills/pdf/home/skills/pdf/SKILL.md
home/skills/pptx/home/skills/pptx/SKILL.md
home/skills/research/home/skills/research/SKILL.md
home/skills/xlsx/home/skills/xlsx/SKILL.md
```

- 嵌套 SKILL.md 与顶层逐字节相同（agent-browser 两侧 md5 均为 `6e0ec2f8…`），可安全删除嵌套副本。
- 引入提交：`fafc9e8`（v2.5.0 "整合包自带 47 个跨 harness 精选 skill"）。推测当时收录这 6 个 skill 时把上游仓库的 `home/` 宿主前缀一并复制了进来。
- 打包脚本 `scripts/build-dspack.py` 的 `collect_home_entries()` 用 `rglob("*")` 无过滤递归收集 `home/`，嵌套目录被原样打进 dspack。
- 当前 skill 目录总数 49 = 43 正常 + 6 嵌套，与 issue 描述一致。
- 影响：launcher 导入时把 `home/` 递归复制到 `DSH_HOME` 根 → 嵌套副本落到 `$DSH_HOME/skills/<name>/home/skills/<name>/`；`dsh-skill-filesystem` 只扫描 `<root>/<name>/SKILL.md` 一层，嵌套副本成为死数据（顶层 skill 本身仍可用，**但 6 个 skill 目录被污染**，且打包体积、安装清单均含垃圾条目）。

### Bug 2：dsh-computer-use 非 Windows 崩溃 —— 根因确认

- 依赖 pin：`github:wushi2333/dsh-computer-use_codex-style#72f390ae`（第三方 fork，非本仓库代码）。
- 崩溃栈：`computer_use/cli.py:51` → `from computer_use.win_dpi import enable_dpi_awareness` → `win_dpi.py:13` 模块顶层 `ctypes.WinDLL("user32", …)`。Linux/Android 的 `ctypes` 无 `WinDLL`，import 即 `AttributeError`。
- 该 sidecar 由 dsh-computer-use 自带 bundle patch 提供的 HOST 平面 `computer-use` 行拉起，`failOnStartupError: false` 保证不影响启动，但每次启动必刷 Traceback。

---

## 2. 修复方案

### Bug 1：两处修复（数据清理 + 构建防回归）

**A. 源码清理（治标）** — 删除 6 个嵌套目录：

```bash
git rm -r home/skills/agent-browser/home home/skills/docx/home \
         home/skills/pdf/home home/skills/pptx/home \
         home/skills/research/home home/skills/xlsx/home
```

顶层文件不动（md5 已核实嵌套副本无独有内容）。

**B. 构建脚本防回归（治本）** — `collect_home_entries()` 内增加失败即停（fail-fast）校验：任何 arcname 形如 `home/**/home/**` 的条目直接 `raise SystemExit` 并列出污染路径。理由：嵌套 `home/` 意味着数据污染，静默跳过会掩盖上游收集错误；打包中断是最明确的信号。

**C.（可选，低成本）** GitHub Actions 加一步 lint：checkout 后断言 `find home -mindepth 2 -type d -name home` 输出为空。

### Bug 2：两层修复（包内守卫立即可发布 + 上游 PR 治本）

**A. 包内配置守卫（v2.7.1 随包生效，零 fork 成本）**

非 Windows 平台本就无法使用该 sidecar，守卫让它"安静地不可用"，与 preset 里 `tool-pwsh` 的既有模式完全一致（`disabled: !!js process.platform !== 'win32'`）：

1. **PRESET 平面**（我们自己的 insert，改源头无 patch 语义风险）：`overrides/cordis.patch.yml` 中 `preset-computer-use` → `tool-computer-use` 行追加 `disabled: !!js process.platform !== 'win32'`。
2. **HOST 平面**（上游插件自带行，用 patch 覆盖）：

   ```yaml
   - id: computer-use
     disabled: !!js process.platform !== 'win32'
   ```

   patch 语义注意：对已存在条目是逐键覆盖，只写 `disabled` 不会清掉该行其余配置；Windows 上表达式求值为 `false`，行为不变。

   ⚠️ 实施前必须先跑 `dsh --dump-config` 确认 HOST 行 id 确为 `computer-use`（依据 overrides 既有注释，实施时以 dump 输出为准）。

**B. 上游修复（治本）**

- 给 `wushi2333/dsh-computer-use_codex-style` 提 issue + 最小 diff PR：
  - `cli.py` 的 `main()` 开头加平台短路（`sys.platform != "win32"` 时打印一行提示后 `return 0`）；
  - `win_dpi.py` 顶层 import 收进 `if sys.platform == "win32":` 分支。
- 合并前如需立即用上源码级修复，可 fork + pin 自己的 commit（与包内 dsh-qqbot / dsh-agent-arena 同模式）；上游合并后把 `manifest.json` 的 pin 切回。

---

## 3. 实施步骤

1. `git rm -r` 清理 6 个嵌套目录（§2.Bug1.A）。
2. 修改 `scripts/build-dspack.py`：`collect_home_entries()` 增加嵌套 `home/` 检测，命中即抛错并列出路径（§2.Bug1.B）。
3. 修改 `overrides/cordis.patch.yml`：HOST 行平台守卫 + preset insert 源头加 `tool-computer-use` 守卫（§2.Bug2.A，先 dump-config 核对行 id）。
4. `manifest.json`：`version` → `2.7.1`；描述补一句"v2.7.1 修复 skill 嵌套与非 Windows 下 computer-use 启动噪音"。
5. 新增 `docs/release-notes-v2.7.1.md`；`README.md` / `README.en.md` 相应增补。
6. 向上游提 issue + PR（§2.Bug2.B，可随包发布并行进行）。
7. 打包：`python scripts/build-dspack.py . build/` → 产出 `better-deepseek-harness-codex-2.7.1.dspack` + `.sha256`。
8. 提交（建议单 commit：`fix(v2.7.1): 清理 6 个 skill 嵌套 home 目录，构建防回归，computer-use 非 Windows 平台守卫`）并打 tag。

---

## 4. 验证清单

| 项 | 方法 | 期望 |
|----|------|------|
| dspack 无嵌套条目 | `python -c "import zipfile; z=zipfile.ZipFile('build/better-deepseek-harness-codex-2.7.1.dspack'); bad=[n for n in z.namelist() if n.startswith('home/skills/') and '/home/' in n[len('home/skills/'):]]; assert not bad, bad"` | 断言通过 |
| skill 目录计数 | 同脚本统计 `{n.split('/')[2] for n in … if n.startswith('home/skills/')}` | 49 |
| 构建防回归生效 | 临时造一个 `home/skills/_t/home/skills/_t/x` 文件再跑打包 | 打包报错 |
| sha256 sidecar | `sha256sum` 与 `.sha256` 文件一致 | 一致，64 字节无换行 |
| 配置收敛 | `dsh --dump-config` | 无重复 id、stderr 干净、Windows 上 computer-use 行 enabled |
| 非 Windows 噪音消失 | Android/proot 环境（或 WSL）启动 | 无 Traceback |
| 安装落点 | 安装后检查 `$DSH_HOME/skills/` | 仅 `<name>/SKILL.md` 一层，无 `home/` 残留 |

---

## 5. 风险与回滚

- **patch 语义**：`disabled` 键整体替换现值。上游 HOST 行当前未写 `disabled`（默认 enabled），覆盖为平台条件值在 Windows 上等价于维持现状。实施时 dump-config 前后各跑一次比对。
- **非 Windows 行为变化**：`tool-computer-use` / HOST 行变为显式 disabled —— 该能力在非 Windows 本就因 import 崩溃不可用，此变化只是把"崩溃 + 刷屏"变成"安静跳过"，无功能回退。
- **依赖 pin 不动**：Bug 2 源码修复走上游 PR，本次发布不改任何依赖版本，pnpm lockfile 无影响。
- **回滚**：所有改动集中在单 commit，`git revert` 即可；dspack 为纯新增文件，无覆盖风险。

## 6. 后续（不在本版）

- 上游 PR 合并后，`manifest.json` 的 `dsh-computer-use` pin 切回上游主线，发 v2.7.2。
- 考虑在收录外部 skill 的流程中加"剥离宿主 `home/` 前缀"的归一化脚本，杜绝 Bug 1 复发源头。
