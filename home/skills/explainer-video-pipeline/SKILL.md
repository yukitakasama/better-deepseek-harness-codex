---
name: explainer-video-pipeline
description: 用本机流水线制作「HTML 动效幻灯片 + 中文女声 TTS + 器乐 BGM + 硬字幕」的解说/宣传短视频（mp4）。当用户要求做介绍片、解说视频、宣传片、产品更新速览、动画 PPT 式的横屏短片，或提到 Edge TTS 配音、逐帧渲染、配乐/BGM、ffmpeg 封装成片时使用。内含本机 Node 子进程 EBUSY、批量删除护栏、外部音频素材下载截断三大致命坑及其解法。
agent_created: true
---

# 本机解说视频流水线（Edge TTS + Playwright 逐帧 + FFmpeg）

## 何时用

用户要做**横屏讲解/宣传/更新速览短片**（不是数字人、不是生成式 AI 视频），需要：动画幻灯片 + 中文旁白 + 字幕。典型触发：「做一支介绍视频」「更新内容解说」「动画 PPT」「配个中文女声旁白」。

## 先决条件（本机实测台账，不要重新探查）

| 项 | 值 |
|---|---|
| Node（**必须用 Windows Node**，WSL/托管版不行） | `C:/Users/yuki/.node/node-v24.15.0-win-x64/node.exe` |
| ffmpeg / ffprobe | `D:/ffmpeg/ffmpeg-2026-07-02-git-95a888b9ca-essentials_build/bin/` |
| Python（解析 JSON 用） | `C:/Users/yuki/.workbuddy/binaries/python/versions/3.13.12/python.exe` |
| 浏览器 | 系统 Chrome，Playwright `chromium.launch({ channel:'chrome' })` |
| TTS | `msedge-tts@2.0.7`（npm，免费微软云语音），中文女声 `zh-CN-XiaoxiaoNeural` |
| **BGM 素材** | `D:/my-project/DSH/better-deepseek-harness-update-promo/assets/bgm/`（CC0 器乐，可直接复用）；新的去 **OpenGameArt** 的 `sites/default/files/...` 直链抓（见下「配乐」节） |

**可直接复用的完整流水线（优先复制，不要从零写）**：
- `D:/my-project/DSH/dsh-wsl-preset-promo/` —— **node_modules 是真实目录、链接完好**，且含 `qa-geometry/qa-audit/qa-verify/qa-probe` 全套 QA。**首选基座。**
- `D:/my-project/DSH/better-deepseek-harness-promo/` —— 更新版 engine/render（场景边界自动推导）。但**它的 `node_modules` 顶层符号链接已断裂**（指向不存在的 `D:\DSH\...`），不要直接用它的依赖。

正确做法：从 `dsh-wsl-preset-promo` 复制（含 node_modules，约 18MB），再把 `better-deepseek-harness-promo/src/{engine.js,render.mjs,build.mjs}` 覆盖进来。

---

## ⚠️ 第一个坑（不解决就跑不动）：Node 子进程一律 EBUSY

**现象**：本机 Node 生成任何子进程（ffprobe/ffmpeg/node/cmd）报
`Error: spawnSync ... EBUSY, errno: -4082`（= Windows `ERROR_PIPE_BUSY`）。与沙盒无关，禁用沙盒也一样。

**实测矩阵**：

| 调用方式 | 结果 |
|---|---|
| `execFileSync(cmd, args, {encoding:'utf-8'})` | ❌ EBUSY |
| `execFileSync(..., {windowsHide:true})` | ❌ EBUSY |
| `execFileSync(process.execPath, ['-v'])` | ❌ EBUSY |
| `spawnSync(cmd, args, {shell:true})` | ❌ EBUSY |
| `spawnSync(cmd, args, {stdio:'inherit'})` | ❌ EBUSY |
| **`spawnSync(cmd, args, {encoding:'utf-8', stdio:['ignore','pipe','pipe']})`** | ✅ **OK** |

**根因**：stdin 被当管道继承导致 BUSY。**把 stdin 设为 `ignore` 即通。**

```js
import { spawnSync } from 'node:child_process'
// 要捕获输出
const r = spawnSync(cmd, args, { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'] })
if (r.error) throw r.error
if (r.status !== 0) throw new Error(`exit ${r.status}: ${r.stderr}`)
const out = r.stdout
// 要实时进度透传
spawnSync(cmd, args, { stdio: ['ignore', 'inherit', 'inherit'] })
```

> 复制来的脚本里凡是 `execFileSync` 或 `stdio:'inherit'` 都要改掉。
> Playwright 启 Chrome / 截图**不受影响**，无需改动。

**第二个坑**：`FFMPEG_DIR` 必须显式导出，否则脚本用裸 `ffprobe`（Node 子进程里 PATH 不可靠）会 ENOENT：
```bash
export FFMPEG_DIR="D:/ffmpeg/ffmpeg-2026-07-02-git-95a888b9ca-essentials_build/bin"
```

---

## 流水线四步

```bash
cd <项目目录>
export FFMPEG_DIR="D:/ffmpeg/ffmpeg-2026-07-02-git-95a888b9ca-essentials_build/bin"
NODE="C:/Users/yuki/.node/node-v24.15.0-win-x64/node.exe"

"$NODE" src/tts.mjs zh-CN-XiaoxiaoNeural +8%   # ① 逐句合成 → out/audio/ + assets/raw/narration.json
"$NODE" src/render.mjs --preview               # ② 提案帧（9 张关键帧，先验收版式！）
"$NODE" src/qa-geometry.mjs                    # ③ 版式越界检查（需先有 out/timeline.json）
rm -rf out/frames                              # ④ 整片重渲前**必须**先清空（否则撞批量删除护栏，见坑三）
"$NODE" src/render.mjs                         # ⑤ 整片渲染（约 110ms/帧；92s 片 ≈ 5 分钟，用后台任务）
"$NODE" src/build.mjs                          # ⑥ 拼旁白 + BGM（裁切/滤波/侧链避让）+ 封装 MP4 + 封面
```

- **一定要先出提案帧再整片渲染**：9 帧 + QA 只要几十秒，避免版式没定稿就重渲 6 分钟。
- `REUSE=1` 可复用已合成的句子，只补新句/改动句。**改语速则必须先删 `out/audio/<VOICE>-N*`**，
  否则会被当成品复用导致语速不一致。
- **语速标定（实测，411 字中文稿）**：
  - `rate -4%` → 97.42s ≈ **4.22 字/秒**（听感偏慢，除非用户要求更慢，否则别默认用这个）
  - `rate +8%` → 86.54s ≈ **4.75 字/秒**（信息式解说的**推荐默认值**）
  - 要 N 秒成片：旁白字数 ≈ (N − 首尾留白 − 句间留白) × 4.7（rate +8%）
  留白默认 `LEAD 0.60 / GAP 0.35 / TAIL 2.00`（在 `render.mjs` 顶部）。
- **改语速=全片重做**：场景边界由旁白实测时长推导，语速一变帧序列全变，必须重渲整个帧序列
  （画面层可以完全不动）。

---

## 配乐（BGM）——别用程序化蜂鸣糊弄

**教训**：用 ffmpeg `sine` 源 + tremolo/echo 拼低频铺底，频谱上"有信号"、`volumedetect` 也测得到，
但人耳听不出来 —— 用户会直接判定「**没有 BGM**」。要做配乐就用**真实器乐素材**。

### 去哪找（本机网络可达性实测，2026-10-05）

| 站点 | 状态 |
|---|---|
| **`opengameart.org`**（含 `sites/default/files/...` 直链） | ✅ **首选**，CC0/CC-BY 素材多，直链可下 |
| `cdn.pixabay.com`（音频 CDN 直链） | ✅ 可下（但 `pixabay.com` 搜索页 403，不易拿 ID） |
| `incompetech.com` | ⚠️ 通，但免费路径只给 **约 10 秒试听片段**，不是全曲 |
| `freemusicarchive.org` | ⚠️ 首页 200，但 `files.freemusicarchive.org` **403** |
| `archive.org`（advancedsearch / download / metadata） | ❌ 完全不通 |
| `commons.wikimedia.org/w/api.php` | ❌ 不通 |
| PyPI（`pip install numpy` 等） | ❌ 不通 → 本机**无法**用 Python 库做音频合成 |
| 本机 MIDI 渲染 | ❌ 无 `fluidsynth` / `timidity` / soundfont → **MIDI 自生成这条路走不通** |

→ 结论：**优先 OpenGameArt 直链**。挑曲子看**频谱图**（`showspectrumpic`）而不是靠猜：
要「织体稀疏、能量集中低频、中高频留白多」的，人声频段（300 Hz–3.4 kHz）才不被遮蔽。

### 下载必须校验（**极易踩**）

```bash
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36"
U="https://opengameart.org/sites/default/files/<file>.mp3"
curl -s -I -L --max-time 30 -A "$UA" "$U" | grep -i content-length   # ① 先拿真实长度
curl -s -L --max-time 180 -A "$UA" -o bgm.mp3 "$U"
stat -c%s bgm.mp3                                                    # ② 比对字节数
"$FFMPEG_DIR/ffmpeg.exe" -hide_banner -loglevel error -i bgm.mp3 -c:a pcm_s16le -ar 48000 -ac 2 -y d.wav
"$FFMPEG_DIR/ffprobe.exe" -v error -show_entries format=duration -of csv=p=0 d.wav   # ③ 解码后时长=唯一可信长度
```

⚠️ **mp3 头部会撒谎**：实测下到 34% 的残文件（933 569 B / 真值 2 755 237 B），
`ffprobe format=duration` 照样报 131.72s，只有转成 wav 才发现实际仅 44.11s
（ffmpeg 会顺带警告 `invalid new backstep -1`）。**后果：成片配乐播到一半就静音，而校验"看起来正常"。**

### 混音配方（`src/build.mjs`）

```js
// ① BGM 预处理：裁到片长 → 滤波 → 淡入淡出 → 定铺底电平
ffmpeg -ss 0 -i assets/bgm/<track>.mp3 -t <TOTAL> \
  -af "highpass=f=50,lowpass=f=9500,afade=t=in:st=0:d=2.5,afade=t=out:st=<TOTAL-4.5>:d=4.5,volume=-7dB" \
  -c:a pcm_s16le -ar 48000 -ac 2 -y out/audio/bgm.wav
```
- `highpass=f=50` 去隆隆声给人声让下盘；`lowpass=f=9500` 让高频退后、长时间不刺耳。
- **素材比片长时不要循环拼接**（接缝听得出来）；裁一刀即可。
- 电平标定：源 −19.3 LUFS → `volume=-7dB` 落到 **−26.3 LUFS**（比旁白低约 10 dB，是合适的铺底）。

```js
// ② 混音：旁白做侧链键，说话时 BGM 自动退让
const mixGraph = [
  '[0:a][1:a]sidechaincompress=threshold=0.05:ratio=5:attack=20:release=420:makeup=1[bgmduck]',
  '[2:a][bgmduck]amix=inputs=2:normalize=0:dropout_transition=0[mixed]',
  '[mixed]loudnorm=I=-16:TP=-1.5:LRA=11,alimiter=limit=0.95[out]',
].join(';')
// ffmpeg -i bgm.wav -i narration.wav -i narration.wav -filter_complex <graph> -map [out] ...
```
实测效果：说话时 BGM 退到约 −35 dB，句间空隙回升到 −24 ~ −25 dB，空隙处**明确可闻**。

### 验收 BGM 有没有真的在响

```bash
# 在「句间空隙」取样（旁白已停、只有配乐）——这才是配乐真实电平
"$FFMPEG_DIR/ffmpeg.exe" -hide_banner -nostats -ss <空隙起点> -t 0.28 -i out/*.mp4 -af volumedetect -f null -
# 期望 −24 ~ −26 dB。若显示 −91 dB（数字静音）说明配乐没铺到那一段。
# 再出频谱图目视确认贯穿全片：
"$FFMPEG_DIR/ffmpeg.exe" -hide_banner -loglevel error -i out/*.mp4 -lavfi "showspectrumpic=s=1200x300:legend=0:scale=log" -y spec.png
```
> 只用 `volumedetect` 测全片会被旁白掩盖，**必须挑"纯配乐"的时间窗**测。

---

## ⚠️ 坑三：批量删除护栏（整片重渲会撞上）

Node 里 `rmSync(dir, {recursive:true})` 删除**超过 50 个文件**的目录会抛：
```
[safe-delete][SAFE_DELETE_BULK_CONFIRM_REQUIRED] {"count":3084,"threshold":50,...}
```
`render.mjs` 的整片重渲开头就要清空 `out/frames`（几千张 PNG），因此**第二次重渲必然失败**
（首轮能过只是因为那目录还不存在）。bash 的 `rm -rf` 走同一套护栏，且可能"静默不删还继续执行"。

**解法**：把清空动作**单独**放到一次需要用户确认的提权调用里，再跑脚本（此时目录已空，脚本内的 `rmSync` 不触发阈值）：
```bash
rm -rf out/frames && mkdir -p out/frames && echo "cleared -> $(ls out/frames | wc -l) files remain"
# 这一步会要求用户批准；批准后照常跑 node src/render.mjs
```
> 同理，制作过程中产生的临时素材目录（如 `_bgm_tmp/`）文件数不多，可以直接 `rm -rf` 清掉。

---

## ⚠️ 坑四：Edge TTS websocket 会中途断流

偶发报 `Stream closed before the synthesis completed (no turn.end received)`，
并留下**半截 mp3**；半截文件不被删掉就会被后续步骤当成品用。
**`tts.mjs` 必须带退避重试 + 时长下限校验**（已落到本流水线）：

```js
async function synthesize(dir, text, id) {
  const target = join(dir, 'audio.mp3')
  let lastErr
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const tts = new MsEdgeTTS()
      await tts.setMetadata(VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3)
      await tts.toFile(dir, text, { rate: RATE })
      if (!existsSync(target)) throw new Error('合成结束但没有产出 audio.mp3')
      return
    } catch (e) {
      lastErr = e
      rmSync(target, { force: true })          // ← 关键：半截文件必须删
      await new Promise((r) => setTimeout(r, 1500 * attempt))
    }
  }
  throw new Error(`${id} 连续 4 次合成失败：${lastErr && lastErr.message}`)
}
// 之后还要校验 probeDuration(target) > 0.3，否则判定截断
```

---

## 画面层契约（改幻灯片时必须遵守）

- **唯一渲染入口 `window.renderAt(t)`**，全部动效**确定性求值**（任意 t 可复现同一帧）。
  **禁止 CSS transition / animation**（逐帧截图必需），进度/滚动/滑块都用 `t` 算。
- 元素靠属性声明动效（`data-at` 为**场景内相对秒**，引擎按最近祖先 `.scene` 的 `data-from` 换算）：
  `data-in`（淡入+位移）/ `data-at` / `data-dur` / `data-from`（位移 px）/ `data-stagger` + `data-step`（错峰）/ `data-type` + `data-cps`（打字机）。
- 引擎必需的 DOM id：`#stage` `#brand` `#scene-tag` `#progress` `#progress-wrap` `#subs` `#sub-text`；每个 `.scene` 内要有 `.scene-title`（供右上角场景标签，CSS 里隐藏）。
- 场景边界由 `render.mjs` 从**旁白实测时长自动推导**并写入 `.scene[data-from]/.scene[data-to]`。
  **注入后必须再调一次 `window.Engine.init()`**，否则引擎仍按 HTML 里的占位时间求值（引擎在页面加载时就 collect 过一次）。
  ```js
  await page.evaluate((sc) => { /* 写 dataset.from/to */ }, scenes)
  await page.evaluate(() => window.Engine.init())   // ← 关键，别漏
  ```
  同理 `qa-*.mjs` 里也要先注入再 init。
- **帧数取整必须统一**：`render.mjs` 用 `Math.round(total*FPS)`，必须与 `build.mjs` 的
  `Math.round(TOTAL*FPS)` 校验一致。用 `Math.ceil` 会多出 1 帧，`build.mjs` 直接抛「帧数不符」白跑一轮。
- 字幕条配色要跟主题走：**浅底主题用深色字幕条 + 浅字**（浅底+浅字不可读）。

## 成片校验

```bash
"$FFMPEG_DIR/ffprobe.exe" -v error \
  -show_entries format=duration,size -show_entries stream=codec_name,width,height,r_frame_rate,channels \
  -of default=noprint_wrappers=1 out/*.mp4
"$FFMPEG_DIR/ffmpeg.exe" -hide_banner -i out/*.mp4 -af volumedetect -f null -   # mean/max_volume，确认有声不削波
```
期望：1920×1080 / 30fps / h264 + aac / 整合响度 ≈ **−15.5 LUFS**（目标 −16）/ 无削波。
嘈杂环境里只有 `volumedetect` 的全片 mean 会被旁白掩盖 —— **判断配乐是否存在要挑"纯配乐"窗口**（见配乐节）。

## 内容层从哪来（事实准确性）

做「某仓库/产品的更新解说」时，**不要照抄 Release Note 正文的数字**——经常与仓库实际不符。
一律取权威源：

```bash
cd <仓库>
for R in v1.0.0 v1.1.0 v2.0.0; do echo "== $R =="; git show "$R:manifest.json" | <python> -c "import sys,json;m=json.load(sys.stdin);print(m.get('version'),len(m.get('dependencies',{})));[print(' -',k,'@',v) for k,v in m.get('dependencies',{}).items()]"; done
```
版本号常有跳变（如 1.1.0 直接跳 2.0.0，中间从未发布）——**画面要用小字主动说明**，否则观众以为漏了版本。

## 交付与归档

- 产物：`out/<name>-1080p.mp4` + `out/cover.png`（封面用 `build.mjs` 里动态取某一镜的一帧，别写死秒数）+ 独立 `out/*.srt`。
- 用 `present_files` 把 mp4 与封面一起给用户。
- 按全局规则写 `C:/Users/yuki/docs/<date>/<HHmm>_内容创作_<任务>/REPORT.md` 并更新 `docs/INDEX.md`。
- BGM 素材要与代码一起留档，并在 `assets/bgm/ATTRIBUTION.md` 记明**曲名/作者/授权/来源直链/字节数/SHA-256**。
- `out/frames/` 约 1 GB，保留可免重渲重封装；不需要时**单独一次提权调用**整目录删（见坑三）。
- 制作期的临时素材目录（`_bgm_tmp/` 之类）收尾时清掉。
