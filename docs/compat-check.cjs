// DSH 插件兼容性校验（复刻 DSH evaluatePluginCompatibility 的核心逻辑：
// 对插件 peerDependencies 中的 @deepseek-ai/dsh-* 范围，判断宿主版本 0.2.0-rc.2 是否满足）
const HOST = "0.2.0-rc.2";

// ---- 最小 semver 实现（覆盖本项目用到的 >= / ^ / 精确 / || ）----
function parse(v) {
  const [core, pre] = v.split("-");
  const nums = core.split(".").map(Number);
  const prerelease = pre ? pre.split(".") : [];
  return { nums, prerelease };
}
function cmpPre(a, b) {
  if (a.length === 0 && b.length === 0) return 0;
  if (a.length === 0) return 1;   // 无预发布 > 有预发布
  if (b.length === 0) return -1;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    const an = /^\d+$/.test(a[i]), bn = /^\d+$/.test(b[i]);
    let r;
    if (an && bn) r = Number(a[i]) - Number(b[i]);
    else if (an && !bn) r = -1;
    else if (!an && bn) r = 1;
    else r = a[i] < b[i] ? -1 : a[i] > b[i] ? 1 : 0;
    if (r !== 0) return r;
  }
  return a.length - b.length;
}
function compare(a, b) {
  const x = parse(a), y = parse(b);
  for (let i = 0; i < 3; i++) {
    if (x.nums[i] !== y.nums[i]) return x.nums[i] - y.nums[i];
  }
  return cmpPre(x.prerelease, y.prerelease);
}
function satisfies(version, range) {
  if (range.includes("||")) return range.split("||").some(r => satisfies(version, r.trim()));
  range = range.trim();
  if (range.startsWith(">=")) return compare(version, range.slice(2).trim()) >= 0;
  if (range.startsWith(">"))  return compare(version, range.slice(1).trim()) > 0;
  if (range.startsWith("^")) {
    const [maj, min, pat] = range.slice(1).split("-")[0].split(".").map(Number);
    const upper = maj > 0 ? `${maj + 1}.0.0` : min > 0 ? `0.${min + 1}.0` : `0.0.${pat + 1}`;
    return compare(version, range.slice(1)) >= 0 && compare(version, upper) < 0;
  }
  return compare(version, range) === 0; // 精确
}

// ---- 4 个候选插件的 host 关键 peer（来自各自 package.json）----
const PLUGINS = {
  "@nanmicoder/dsh-agent-teams@0.1.22": {
    peers: { "@deepseek-ai/dsh-agent": "0.2.0-rc.2 || 0.1.7-rc.2 || 0.1.5-rc.3 || 0.1.5-rc.2 || 0.1.5-rc.1 || 0.1.2-rc.1 || 0.1.2-alpha.5 || 0.1.2-alpha.2" }
  },
  "dsh-context@0.63.0": {
    peers: { "@deepseek-ai/dsh-client-ui-primitives": ">=0.1.5-rc.1", "@deepseek-ai/dsh-session": ">=0.1.5-rc.1", "@deepseek-ai/dsh-settings": ">=0.1.5-rc.1" }
  },
  "dsh-plugin-subagent-director@0.5.5": {
    peers: { "@deepseek-ai/dsh-agent": ">=0.1.7-rc.1", "@deepseek-ai/dsh-subagent": ">=0.1.7-rc.1", "@deepseek-ai/dsh-session": ">=0.1.7-rc.1" }
  },
  "dsh-edit-resend@0.1.0": {
    peers: {} // 无 peer 约束 → 门禁不拦
  }
};

let allPass = true;
for (const [name, { peers }] of Object.entries(PLUGINS)) {
  console.log(`\n=== ${name} ===`);
  if (Object.keys(peers).length === 0) {
    console.log("  (无 @deepseek-ai/dsh-* peer 约束 → 安装门禁 PASS，运行时需冒烟测试)");
    continue;
  }
  let ok = true;
  for (const [dep, range] of Object.entries(peers)) {
    const r = satisfies(HOST, range);
    if (!r) ok = false;
    console.log(`  ${r ? "✅" : "❌"} ${dep}  "${range}"  →  0.2.0-rc.2 ${r ? "满足" : "不满足"}`);
  }
  if (!ok) allPass = false;
  console.log(`  >> ${ok ? "兼容 0.2.0-rc.2" : "不兼容！"}`);
}
console.log(`\n==== 总体：${allPass ? "全部通过 peer 门禁 ✅" : "存在不兼容 ❌"} ====`);
