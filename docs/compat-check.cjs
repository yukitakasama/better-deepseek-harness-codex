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
  // 复合范围（如 ">=0.2.0-alpha.1 <0.3.0"）：空格分隔的多个条件取 AND
  const parts = range.trim().split(/\s+/);
  if (parts.length > 1) return parts.every(p => satisfies(version, p));
  range = range.trim();
  if (range.startsWith(">=")) return compare(version, range.slice(2).trim()) >= 0;
  if (range.startsWith(">"))  return compare(version, range.slice(1).trim()) > 0;
  if (range.startsWith("<=")) return compare(version, range.slice(2).trim()) <= 0;
  if (range.startsWith("<"))  return compare(version, range.slice(1).trim()) < 0;
  if (range.startsWith("^")) {
    const [maj, min, pat] = range.slice(1).split("-")[0].split(".").map(Number);
    // 真实 semver：caret 上界是 <X.Y.0-0（排除下一个 minor/major 的预发布版）
    const upper = maj > 0 ? `${maj + 1}.0.0-0` : min > 0 ? `0.${min + 1}.0-0` : `0.0.${pat + 1}-0`;
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
    // ⚠️ 2026-10-05 实测修正：GitHub 源码 package.json 无 peer，但 npm 发布产物
    // 声明了 ^0.1.0-rc.6 peer → 0.2.0-rc.2 下被 runtime 拒装（dsh --dump-config stderr 实证）。
    // v2.1.0/v2.2.0 记录的「无 peer 约束」有误，v2.3.0 起移除本插件。
    peers: {
      "@deepseek-ai/dsh-agent": "^0.1.0-rc.6",
      "@deepseek-ai/dsh-typert-protocol": "^0.1.0-rc.6"
    }
  },
  "dsh-agent-arena@0.6.0 (fork: relax-peers-0.2.0-rc.2)": {
    peers: {
      "@deepseek-ai/dsh-agent": ">=0.1.7-rc.2",
      "@deepseek-ai/dsh-agent-default-model": ">=0.1.7-rc.2",
      "@deepseek-ai/dsh-host-webserver": ">=0.1.7-rc.2",
      "@deepseek-ai/dsh-llm": ">=0.1.7-rc.2",
      "@deepseek-ai/dsh-session": ">=0.1.7-rc.2",
      "@deepseek-ai/dsh-session-persistence": ">=0.1.7-rc.2",
      "@deepseek-ai/dsh-subagent": ">=0.1.7-rc.2",
      "@deepseek-ai/dsh-system-prompt": ">=0.1.7-rc.2",
      "@deepseek-ai/dsh-tools": ">=0.1.7-rc.2",
      "@deepseek-ai/dsh-workspace": ">=0.1.7-rc.2"
    }
  },

  // ---- v2.3.0 新增 7 个插件（peer 数据来自各自 repo/npm package.json，2026-10-05）----
  "@mrweicodes/dsh-loop-guard@1.0.8": {
    peers: {
      "@deepseek-ai/dsh-agent": ">=0.1.2-rc.1 <0.1.3 || >=0.1.3-alpha.2 <0.1.4 || >=0.1.5-alpha.1 <0.2.0 || >=0.1.6-alpha.1 <0.2.0 || >=0.1.7-alpha.1 <0.2.0 || >=0.2.0-alpha.1 <0.3.0",
      "@deepseek-ai/dsh-llm": ">=0.1.2-rc.1 <0.1.3 || >=0.1.3-alpha.2 <0.1.4 || >=0.1.5-alpha.1 <0.2.0 || >=0.1.6-alpha.1 <0.2.0 || >=0.1.7-alpha.1 <0.2.0 || >=0.2.0-alpha.1 <0.3.0"
    }
  },
  "@modusensus/dsh-mneme@0.8.13": {
    peers: {
      "@deepseek-ai/dsh-host-webserver": ">=0.1.0-rc.6 <0.2.0 || >=0.1.5-rc.0 <0.3.0 || >=0.2.0-rc.0 <0.3.0",
      "@deepseek-ai/dsh-llm": ">=0.1.0-rc.6 <0.2.0 || >=0.1.5-rc.0 <0.3.0 || >=0.2.0-rc.0 <0.3.0",
      "@deepseek-ai/dsh-system-prompt": ">=0.1.0-rc.6 <0.2.0 || >=0.1.5-rc.0 <0.3.0 || >=0.2.0-rc.0 <0.3.0"
    }
  },
  "@liustack/modlens@3.26.6": {
    peers: {} // 未声明 peer → 门禁不拦；引擎要求以实跑 dsh --dump-config 验证
  },
  "dsh-inline-figures@0.1.0": {
    peers: {
      "@deepseek-ai/dsh-llm": "0.2.0-rc.2",
      "@deepseek-ai/dsh-system-prompt": "0.2.0-rc.2",
      "@deepseek-ai/dsh-tools": "0.2.0-rc.2"
    }
  },
  "dsh-prompt@0.3.0": {
    peers: {}, // 无 peer；package.json dsh.engines 声明 ">=0.2.0-rc.2"，依赖按 0.2.0-rc.2 构建
    engines: ">=0.2.0-rc.2"
  },
  "dsh-plugin-wallpaper-engine@1.2.0": {
    peers: {
      "@deepseek-ai/dsh-client-runtime": ">=0.2.0-rc.1",
      "@deepseek-ai/dsh-host-webserver": ">=0.2.0-rc.1",
      "@deepseek-ai/dsh-client-ui-slots": ">=0.2.0-rc.1"
    }
  },
  "@goodandready/dsh-key-limits@0.2.19": {
    peers: {} // 仅 cordis/schemastery peer，与宿主版本无关
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
