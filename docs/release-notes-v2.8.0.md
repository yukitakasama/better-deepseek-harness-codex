# better-deepseek-harness-codex v2.8.0 发行说明

> 功能版。在 v2.7.1 基础上**新增 dsh-ops 插件**（T-Auto/dsh-ops 0.3.0，npm registry 版本）。
> 基座 DSH 0.2.0-rc.2、其余 24 个插件、49 个自带 skill 的构成与 v2.7.1 **完全相同**，
> 除新增 dsh-ops 外无任何依赖版本变更。

## 新增：dsh-ops —— Rust 原生文件工具与命令执行器

上游 [T-Auto/dsh-ops](https://github.com/T-Auto/dsh-ops)，钉 npm `0.3.0`，**未做任何源码修改**。

### 为什么选 0.3.0 而不是 0.3.1

上游 0.3.1（`043c7ff`）只发了 GitHub Release（三个平台的 native worker zip），
**没有 `npm publish`**：registry 上 `latest` 仍是 0.3.0，`npm view dsh-ops@0.3.1` 返回 404。
本包的依赖管理走 pnpm / npm registry（其余插件同样如此），故取 registry 最新的 **0.3.0**，
它已包含 win32-x64 的 Rust worker 与全部 Windows 载荷。上游后续若补发 npm 版本，可平滑升级。

### 带来了什么

| 能力 | 说明 |
| --- | --- |
| `ops_inspect_local_file` | 有界 UTF-8 文本行读取，或 hex 视图；目录拒绝 |
| `ops_grep` | Rust 正则搜索，多文件 glob 过滤、计数 / 摘要 / 内容模式，支持跨行 |
| `ops_glob` | 多模式找路径（glob **数组**，`!` 前缀排除） |
| `ops_replace` | 跨文件**字面文本**批量替换；dry-run 只观察；read-only 拒绝 |
| `ops_bash` | 优先的通用命令执行器；短命令 `command`，长脚本 `script_path` |
| 宿主 `pwsh` | Windows 原生 cmdlet / 注册表 / 服务，执行期指向随包 PowerShell 7.6.6 |

四个文件工具由 Rust worker 经宿主 subprocess 执行**固定操作**，不运行模型代码；
读取与替换会登记到宿主的「先读后改」观测表，因此用 OPS 读过的文件可直接用宿主 `edit`。

### 组件开关（全部保持上游默认）

| 配置行 | 默认 | 本包行为 |
| --- | --- | --- |
| `dsh-ops/shell` | 开 | 保持开启，`overrides/cordis.patch.yml` 显式记录其配置值 |
| `dsh-ops/file` | 开 | 保持开启，同上 |
| `dsh-ops/ptc` | 关 | 不启用（仅纯 PTC 会话需要 `ops_batch` / `ops_result`） |
| `dsh-ops/tui` | 关 | 不启用（dsh-TUI 只读侧栏） |
| `dsh-ops/hide-official` | 关 | 0.3.0 的 bundle patch 未插入该行 |

### `overrides/cordis.patch.yml` 的两条新增

1. `dsh-ops-file` / `dsh-ops-shell`：只带 `config:` 的逐键覆盖，记录与上游 bundle patch 一致的
   默认值（`promptPolicy` / `publishBashTool` / `shellPolicy: advise` /
   `allowSystemShellFallback: false` / `required: false`），便于阅读与后续调整。
2. `pwsh-sandbox`：`disabled: !!js process.platform !== 'win32'`。该行是宿主自带的
   PowerShell 执行器，dsh-ops 只在 Windows 上解析随包 PowerShell 7；非 Windows 上若不显式
   关闭，插件会尝试把 `pwshPath` 指向一个不存在的可执行文件。

## 兼容性核查

- **peer**：`dsh-ops@0.3.0` 声明 `@deepseek-ai/dsh: ^0.2.0-rc.2`、`@deepseek-ai/cordis: ^4.0.4`，
  与本包基座精确匹配（均为 optional peer，缺失不阻断安装）。
- **Node**：`engines: ^22.19 || >=24`，本机 Node v24.15.0 通过。
- **平台**：npm 包的 `os: [win32]` / `cpu: [x64]`；worker 白名单为 win32-x64 / linux-x64 /
  darwin-arm64，本机 win32-x64 命中。
- **载荷体积**：三个可选依赖（`@dsh-ops/bash-win32-x64` 411 MB、
  `@dsh-ops/pwsh-win32-x64` 257 MB、`@dsh-ops/fastctx-win32-x64` 50 MB 解包后）
  随 profile 依赖管理；`.dspack` 本身不含它们（安装时由 pnpm 拉取）。

## 验证记录

全部在本机 Windows x64 / Node v24.15.0 / DSH 0.2.0-rc.2 上完成。

### 依赖解析与安装

- `pnpm install --lockfile-only`：通过，`dsh-ops@0.3.0` 与三个载荷包进入锁文件。
- `pnpm install`：通过，`node_modules/dsh-ops` 落地，
  `runtime/win32-x64/dsh-ops-worker.exe`（2,448,384 字节）+ `bash-ipc/{opsipc.dll,opsnt.dll}`
  + `provenance.json` 齐全。

### 组合树（`dsh --dump-config`）

- 隔离 profile（临时 `DSH_HOME` + 克隆仓库的 `package.json` / `cordis.patch.yml`）：
  exit 0，1400+ 行输出中 dsh-ops 出现 4 行 —— `dsh-ops-shell` / `dsh-ops-file` /
  `dsh-ops-background`（disabled 空操作桩）/ `dsh-ops-ptc`（disabled）。
- `dsh-ops-file` 行拿到了本包 patch 写入的 `config`（`promptPolicy: true`、`required: false`），
  证明逐键覆盖按预期生效。
- `pwsh-sandbox` 行带上了 `disabled: !!js process.platform !== 'win32'`。
- 官方 `web` profile 实装验证：`dsh plugin --profile web add dsh-ops@0.3.0` 成功，
  `--dump-config` 同样得到 4 行且无 patch 未命中告警；验证后已 `remove` 并逐字节还原
  `package.json` / `cordis.patch.yml`。

### 运行时

- `dsh web` 启动：**exit 0**，web 服务正常监听（`http://127.0.0.1:3080/`），
  日志仅既有的一条 otel 警告（基线同样存在），**无任何 dsh-ops 相关报错**。
- `dsh-ops ladder`：bash / pwsh / fastctx 三级全部 `available: true`，
  可执行文件均解析到 bundled 载荷。
- 插件 file 组件实载：`ops_inspect_local_file` / `ops_grep` / `ops_glob` / `ops_replace`
  四个工具全部注册，日志 `native Rust file worker ready; 4 tools.`
- Rust worker 直调（按 `lib/file/worker.js` 的协议构造请求）：
  `inspect_local_file` 返回 64 行 `package.json` 的分页内容；
  `glob ["*.json"]` 返回 2 个文件；`grep dsh-ops --count` 返回 4 个文件的命中计数。
- 载荷可执行：`bash.exe` 报 `GNU bash, version 5.3.15`；`pwsh.exe` 报 `7.6.6`。

### 未覆盖的部分（如实说明）

- **未跑通 headless 会话**：本机没有有效的 DeepSeek API key，
  `dsh headless` 停在认证阶段（`AUTH: Authentication Fails`），因此**没有**在真实模型回合里
  观察到 `ops_*` 工具的调用输出。工具注册、worker 执行、载荷运行均已单独验证。
- **未验证 PTC 组件**（`ops_batch` / `ops_result`）：该组件默认关闭，且只在纯 PTC 会话加载。
- **未验证 macOS / Linux**：本机为 Windows x64；上游 0.3.1 的 Linux / darwin worker 走
  GitHub Release，与本包选择的 registry 0.3.0 无关。

## 升级说明

从 v2.7.1 升级无破坏性变更：新增一个默认开启的插件，原有 24 个插件的配置与行为不变。
若不需要 dsh-ops，在 profile 的 `cordis.patch.yml` 里给 `dsh-ops-file` / `dsh-ops-shell`
补 `disabled: true`，或从 `package.json` 的 `dsh.profile.bundles` 与 `dependencies` 中移除。
