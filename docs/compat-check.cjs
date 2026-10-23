// DSH 插件兼容性校验（复刻 DSH evaluatePluginCompatibility 的核心逻辑：
// v3.0.0 起宿主版本 = 0.2.1-rc.2；只对「已挂载」的插件计入门禁，
// 「暂屏蔽」的插件单列统计（它们不在 dsh.profile.bundles 里，不会被加载）。
// 对插件 peerDependencies 中的 @deepseek-ai/dsh-* 范围，判断宿主版本 0.2.0-rc.2 是否满足）
const HOST = "0.2.1-rc.2";

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

// ---- v3.0.0 插件表 ----
// mounted: true  → 在 dsh.profile.bundles 里，参与门禁（任一 peer 不满足即视为会崩，CI 应红）
// mounted: false → 已从 bundles 移出并「暂屏蔽」，此处仅记录其 peer 现状，不计入总判定
const MOUNTED = {
  "@michengai/dsh-codex-ui@1.1.47": {
    "mounted": true,
    "declaration": "peer 矩阵精确枚举 0.2.1-rc.2；README 称 1.1.42 起显式支持 rc.1/rc.2，dev 依赖锁 rc.2",
    "peers": {
      "@deepseek-ai/dsh-client-locale": "0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-rc.1 || 0.2.1-rc.2",
      "@deepseek-ai/dsh-client-ui-slots": "0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-rc.1 || 0.2.1-rc.2",
      "@deepseek-ai/dsh-client-ui-layout": "0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-rc.1 || 0.2.1-rc.2",
      "@deepseek-ai/dsh-client-connection": "0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-rc.1 || 0.2.1-rc.2",
      "@deepseek-ai/dsh-client-ui-sidebar": "0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-rc.1 || 0.2.1-rc.2",
      "@deepseek-ai/dsh-client-ui-settings": "0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-rc.1 || 0.2.1-rc.2",
      "@deepseek-ai/dsh-client-ui-workspace": "0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-rc.1 || 0.2.1-rc.2",
      "@deepseek-ai/dsh-client-ui-primitives": "0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-rc.1 || 0.2.1-rc.2",
      "@deepseek-ai/dsh-client-ui-conversation": "0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-rc.1 || 0.2.1-rc.2",
      "@deepseek-ai/dsh-client-ui-input-trigger": "0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-rc.1 || 0.2.1-rc.2",
      "@deepseek-ai/dsh-client-ui-settings-general": "0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-rc.1 || 0.2.1-rc.2"
    }
  },
  "@michengai/dsh-code-review@1.0.1": {
    "mounted": true,
    "declaration": "peer 矩阵精确枚举 0.2.1-rc.2；README badge「DSH up to 0.2.1-rc.2」",
    "peers": {
      "@deepseek-ai/dsh-llm": "0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-rc.1 || 0.2.1-rc.2",
      "@deepseek-ai/dsh-agent": "0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-rc.1 || 0.2.1-rc.2",
      "@deepseek-ai/dsh-tools": "0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-rc.1 || 0.2.1-rc.2",
      "@deepseek-ai/dsh-session": "0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-rc.1 || 0.2.1-rc.2",
      "@deepseek-ai/dsh-commands": "0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-rc.1 || 0.2.1-rc.2",
      "@deepseek-ai/dsh-settings": "0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-rc.1 || 0.2.1-rc.2",
      "@deepseek-ai/dsh-subagent": "0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-rc.1 || 0.2.1-rc.2",
      "@deepseek-ai/dsh-system-prompt": "0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-rc.1 || 0.2.1-rc.2",
      "@deepseek-ai/dsh-user-approval": "0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-rc.1 || 0.2.1-rc.2",
      "@deepseek-ai/dsh-user-questions": "0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-rc.1 || 0.2.1-rc.2"
    }
  },
  "@michengai/dsh-simplify@1.0.1": {
    "mounted": true,
    "declaration": "peer 矩阵精确枚举 0.2.1-rc.2",
    "peers": {
      "@deepseek-ai/dsh-llm": "0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-rc.1 || 0.2.1-rc.2",
      "@deepseek-ai/dsh-commands": "0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-rc.1 || 0.2.1-rc.2",
      "@deepseek-ai/dsh-subprocess": "0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-rc.1 || 0.2.1-rc.2",
      "@deepseek-ai/dsh-client-ui-commands": "0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-rc.1 || 0.2.1-rc.2",
      "@deepseek-ai/dsh-client-ui-primitives": "0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-rc.1 || 0.2.1-rc.2"
    }
  },
  "@michengai/dsh-btw@1.0.4": {
    "mounted": true,
    "declaration": "peer 矩阵精确枚举 0.2.1-rc.2；README 称 1.0.0 起在 rc.1/rc.2 实测",
    "peers": {
      "@deepseek-ai/dsh-tools": "0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-rc.1 || 0.2.1-rc.2",
      "@deepseek-ai/dsh-session": "0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-rc.1 || 0.2.1-rc.2",
      "@deepseek-ai/dsh-commands": "0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-rc.1 || 0.2.1-rc.2",
      "@deepseek-ai/dsh-subagent": "0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-rc.1 || 0.2.1-rc.2",
      "@deepseek-ai/dsh-system-prompt": "0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-rc.1 || 0.2.1-rc.2",
      "@deepseek-ai/dsh-client-ui-primitives": "0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-rc.1 || 0.2.1-rc.2",
      "@deepseek-ai/dsh-client-ui-input-trigger": "0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-rc.1 || 0.2.1-rc.2"
    }
  },
  "@nanmicoder/dsh-agent-teams@0.1.26": {
    "mounted": true,
    "declaration": "peer 矩阵精确枚举 0.2.1-rc.2（21 个 peer）；README 推荐「DSH 0.2.1-rc.2 + AgentTeams 0.1.26」",
    "peers": {
      "@deepseek-ai/dsh-llm": "0.2.1-rc.2 || 0.2.1-rc.1 || 0.2.0-rc.2 || 0.1.7-rc.2 || 0.1.5-rc.3 || 0.1.5-rc.2 || 0.1.5-rc.1 || 0.1.2-rc.1 || 0.1.2-alpha.5 || 0.1.2-alpha.2",
      "@deepseek-ai/dsh-agent": "0.2.1-rc.2 || 0.2.1-rc.1 || 0.2.0-rc.2 || 0.1.7-rc.2 || 0.1.5-rc.3 || 0.1.5-rc.2 || 0.1.5-rc.1 || 0.1.2-rc.1 || 0.1.2-alpha.5 || 0.1.2-alpha.2",
      "@deepseek-ai/dsh-tools": "0.2.1-rc.2 || 0.2.1-rc.1 || 0.2.0-rc.2 || 0.1.7-rc.2 || 0.1.5-rc.3 || 0.1.5-rc.2 || 0.1.5-rc.1 || 0.1.2-rc.1 || 0.1.2-alpha.5 || 0.1.2-alpha.2",
      "@deepseek-ai/dsh-session": "0.2.1-rc.2 || 0.2.1-rc.1 || 0.2.0-rc.2 || 0.1.7-rc.2 || 0.1.5-rc.3 || 0.1.5-rc.2 || 0.1.5-rc.1 || 0.1.2-rc.1 || 0.1.2-alpha.5 || 0.1.2-alpha.2",
      "@deepseek-ai/dsh-commands": "0.2.1-rc.2 || 0.2.1-rc.1 || 0.2.0-rc.2 || 0.1.7-rc.2 || 0.1.5-rc.3 || 0.1.5-rc.2 || 0.1.5-rc.1 || 0.1.2-rc.1 || 0.1.2-alpha.5 || 0.1.2-alpha.2",
      "@deepseek-ai/dsh-subagent": "0.2.1-rc.2 || 0.2.1-rc.1 || 0.2.0-rc.2 || 0.1.7-rc.2 || 0.1.5-rc.3 || 0.1.5-rc.2 || 0.1.5-rc.1 || 0.1.2-rc.1 || 0.1.2-alpha.5 || 0.1.2-alpha.2",
      "@deepseek-ai/dsh-util-values": "0.2.1-rc.2 || 0.2.1-rc.1 || 0.2.0-rc.2 || 0.1.7-rc.2 || 0.1.5-rc.3 || 0.1.5-rc.2 || 0.1.5-rc.1 || 0.1.2-rc.1 || 0.1.2-alpha.5 || 0.1.2-alpha.2",
      "@deepseek-ai/dsh-client-store": "0.2.1-rc.2 || 0.2.1-rc.1 || 0.2.0-rc.2 || 0.1.7-rc.2 || 0.1.5-rc.3 || 0.1.5-rc.2 || 0.1.5-rc.1 || 0.1.2-rc.1 || 0.1.2-alpha.5 || 0.1.2-alpha.2",
      "@deepseek-ai/dsh-client-locale": "0.2.1-rc.2 || 0.2.1-rc.1 || 0.2.0-rc.2 || 0.1.7-rc.2 || 0.1.5-rc.3 || 0.1.5-rc.2 || 0.1.5-rc.1 || 0.1.2-rc.1 || 0.1.2-alpha.5 || 0.1.2-alpha.2",
      "@deepseek-ai/dsh-system-prompt": "0.2.1-rc.2 || 0.2.1-rc.1 || 0.2.0-rc.2 || 0.1.7-rc.2 || 0.1.5-rc.3 || 0.1.5-rc.2 || 0.1.5-rc.1 || 0.1.2-rc.1 || 0.1.2-alpha.5 || 0.1.2-alpha.2",
      "@deepseek-ai/dsh-client-ui-chat": "0.2.1-rc.2 || 0.2.1-rc.1 || 0.2.0-rc.2 || 0.1.7-rc.2 || 0.1.5-rc.3 || 0.1.5-rc.2 || 0.1.5-rc.1 || 0.1.2-rc.1 || 0.1.2-alpha.5 || 0.1.2-alpha.2",
      "@deepseek-ai/dsh-client-ui-slots": "0.2.1-rc.2 || 0.2.1-rc.1 || 0.2.0-rc.2 || 0.1.7-rc.2 || 0.1.5-rc.3 || 0.1.5-rc.2 || 0.1.5-rc.1 || 0.1.2-rc.1 || 0.1.2-alpha.5 || 0.1.2-alpha.2",
      "@deepseek-ai/dsh-client-ui-layout": "0.2.1-rc.2 || 0.2.1-rc.1 || 0.2.0-rc.2 || 0.1.7-rc.2 || 0.1.5-rc.3 || 0.1.5-rc.2 || 0.1.5-rc.1 || 0.1.2-rc.1 || 0.1.2-alpha.5 || 0.1.2-alpha.2",
      "@deepseek-ai/dsh-client-connection": "0.2.1-rc.2 || 0.2.1-rc.1 || 0.2.0-rc.2 || 0.1.7-rc.2 || 0.1.5-rc.3 || 0.1.5-rc.2 || 0.1.5-rc.1 || 0.1.2-rc.1 || 0.1.2-alpha.5 || 0.1.2-alpha.2",
      "@deepseek-ai/dsh-client-ui-session": "0.2.1-rc.2 || 0.2.1-rc.1 || 0.2.0-rc.2 || 0.1.7-rc.2 || 0.1.5-rc.3 || 0.1.5-rc.2 || 0.1.5-rc.1 || 0.1.2-rc.1 || 0.1.2-alpha.5 || 0.1.2-alpha.2",
      "@deepseek-ai/dsh-client-ui-renderer": "0.2.1-rc.2 || 0.2.1-rc.1 || 0.2.0-rc.2 || 0.1.7-rc.2 || 0.1.5-rc.3 || 0.1.5-rc.2 || 0.1.5-rc.1 || 0.1.2-rc.1 || 0.1.2-alpha.5 || 0.1.2-alpha.2",
      "@deepseek-ai/dsh-session-projection": "0.2.1-rc.2 || 0.2.1-rc.1 || 0.2.0-rc.2 || 0.1.7-rc.2 || 0.1.5-rc.3 || 0.1.5-rc.2 || 0.1.5-rc.1 || 0.1.2-rc.1 || 0.1.2-alpha.5 || 0.1.2-alpha.2",
      "@deepseek-ai/dsh-client-ui-primitives": "0.2.1-rc.2 || 0.2.1-rc.1 || 0.2.0-rc.2 || 0.1.7-rc.2 || 0.1.5-rc.3 || 0.1.5-rc.2 || 0.1.5-rc.1 || 0.1.2-rc.1 || 0.1.2-alpha.5 || 0.1.2-alpha.2",
      "@deepseek-ai/dsh-api-session-controller": "0.2.1-rc.2 || 0.2.1-rc.1 || 0.2.0-rc.2 || 0.1.7-rc.2 || 0.1.5-rc.3 || 0.1.5-rc.2 || 0.1.5-rc.1 || 0.1.2-rc.1 || 0.1.2-alpha.5 || 0.1.2-alpha.2",
      "@deepseek-ai/dsh-client-ui-conversation": "0.2.1-rc.2 || 0.2.1-rc.1 || 0.2.0-rc.2 || 0.1.7-rc.2 || 0.1.5-rc.3 || 0.1.5-rc.2 || 0.1.5-rc.1 || 0.1.2-rc.1 || 0.1.2-alpha.5 || 0.1.2-alpha.2",
      "@deepseek-ai/dsh-client-ui-model-selection": "0.2.1-rc.2 || 0.2.1-rc.1 || 0.2.0-rc.2 || 0.1.7-rc.2 || 0.1.5-rc.3 || 0.1.5-rc.2 || 0.1.5-rc.1 || 0.1.2-rc.1 || 0.1.2-alpha.5 || 0.1.2-alpha.2"
    }
  },
  "dsh-plugin-subagent-director@0.6.0-beta.2": {
    "mounted": true,
    "declaration": "dshReleases 声明 0.2.1-rc.1/rc.2 = compatible；README 声明 engines.dsh >=0.2.1-rc.1（注意：上游 latest 即 beta）",
    "peers": {
      "@deepseek-ai/dsh-llm": ">=0.2.1-rc.1",
      "@deepseek-ai/dsh-agent": ">=0.2.1-rc.1",
      "@deepseek-ai/dsh-tools": ">=0.2.1-rc.1",
      "@deepseek-ai/dsh-session": ">=0.2.1-rc.1",
      "@deepseek-ai/dsh-settings": ">=0.2.1-rc.1",
      "@deepseek-ai/dsh-subagent": ">=0.2.1-rc.1",
      "@deepseek-ai/dsh-api-remotes": ">=0.2.1-rc.1",
      "@deepseek-ai/dsh-client-store": ">=0.2.1-rc.1",
      "@deepseek-ai/dsh-client-locale": ">=0.2.1-rc.1",
      "@deepseek-ai/dsh-system-prompt": ">=0.2.1-rc.1",
      "@deepseek-ai/dsh-client-ui-chat": ">=0.2.1-rc.1",
      "@deepseek-ai/dsh-client-ui-slots": ">=0.2.1-rc.1",
      "@deepseek-ai/dsh-client-connection": ">=0.2.1-rc.1",
      "@deepseek-ai/dsh-client-ui-session": ">=0.2.1-rc.1",
      "@deepseek-ai/dsh-client-ui-renderer": ">=0.2.1-rc.1",
      "@deepseek-ai/dsh-client-ui-settings": ">=0.2.1-rc.1",
      "@deepseek-ai/dsh-session-projection": ">=0.2.1-rc.1",
      "@deepseek-ai/dsh-api-session-controller": ">=0.2.1-rc.1",
      "@deepseek-ai/dsh-client-ui-conversation": ">=0.2.1-rc.1"
    }
  },
  "dsh-cost-meter@1.9.30": {
    "mounted": true,
    "declaration": "dshReleases 含 0.2.1-rc.1/rc.2；README「Adaptation target 0.2.1-rc.2」",
    "peers": {
      "@deepseek-ai/dsh-home-paths": ">=0.2.0-rc.1 <0.3.0-0 || >=0.2.1-0 <0.3.0-0",
      "@deepseek-ai/dsh-credentials": ">=0.2.0-rc.1 <0.3.0-0 || >=0.2.1-0 <0.3.0-0"
    }
  },
  "dsh-context@0.74.0": {
    "mounted": true,
    "declaration": "dshReleases 显式 0.2.1-rc.2 = compatible",
    "peers": {
      "@deepseek-ai/dsh-session": ">=0.1.7-rc.2",
      "@deepseek-ai/dsh-client-ui-primitives": ">=0.1.7-rc.2"
    }
  },
  "dsh-pet@0.3.8": {
    "mounted": true,
    "declaration": "dshReleases 显式 0.2.1-rc.2 = compatible",
    "peers": {
      "@deepseek-ai/dsh-llm": "^0.2.0-rc.1",
      "@deepseek-ai/dsh-commands": "^0.2.0-rc.1",
      "@deepseek-ai/dsh-home-paths": "^0.2.0-rc.1",
      "@deepseek-ai/dsh-credentials": "^0.2.0-rc.1",
      "@deepseek-ai/dsh-host-webserver": "^0.2.0-rc.1",
      "@deepseek-ai/dsh-client-ui-slots": "^0.2.0-rc.1",
      "@deepseek-ai/dsh-client-connection": "^0.2.0-rc.1",
      "@deepseek-ai/dsh-agent-default-model": "^0.2.0-rc.1",
      "@deepseek-ai/dsh-client-ui-primitives": "^0.2.0-rc.1"
    }
  },
  "@linxin666/dsh-client-ui-git-graph@0.4.8": {
    "mounted": true,
    "declaration": "dsh.engines.dsh >=0.2.1-rc.2 + peer @deepseek-ai/dsh >=0.2.1-rc.2；v0.4.7 发行说明「cohort 推进到 0.2.1-rc.2」",
    "peers": {
      "@deepseek-ai/dsh": ">=0.2.1-rc.2"
    }
  },
  "dsh-workbuddy-connect@0.7.9": {
    "mounted": true,
    "declaration": "6 个 peer 精确钉 0.2.1-rc.2",
    "peers": {
      "@deepseek-ai/dsh-llm": "0.2.1-rc.2",
      "@deepseek-ai/dsh-settings": "0.2.1-rc.2",
      "@deepseek-ai/dsh-llm-pi-ai": "0.2.1-rc.2",
      "@deepseek-ai/dsh-attachment": "0.2.1-rc.2",
      "@deepseek-ai/dsh-home-paths": "0.2.1-rc.2",
      "@deepseek-ai/dsh-host-webserver": "0.2.1-rc.2"
    }
  }
};

const SHELVED = {
  "dsh-ops@0.3.0": {
    "mounted": false,
    "reason": "仅范围覆盖（peer @deepseek-ai/dsh ^0.2.0-rc.2），上游未点名 rc.2",
    "peers": {
      "@deepseek-ai/dsh": "^0.2.0-rc.2"
    }
  },
  "@goodandready/dsh-context-lens@0.1.28": {
    "mounted": false,
    "reason": "仅范围覆盖（^0.1.7-rc.2 || ^0.2.0-rc.1），上游未点名 rc.2",
    "peers": {
      "@deepseek-ai/dsh-tools": "^0.1.7-rc.2 || ^0.2.0-rc.1",
      "@deepseek-ai/dsh-settings": "^0.1.7-rc.2 || ^0.2.0-rc.1"
    }
  },
  "@goodandready/dsh-key-limits@0.2.19": {
    "mounted": false,
    "reason": "无任何 @deepseek-ai/dsh-* peer / engines 声明 → 无法确认",
    "peers": {}
  },
  "dsh-plugin-wallpaper-engine@1.2.0": {
    "mounted": false,
    "reason": "仅范围覆盖（>=0.2.0-rc.1），上游未点名 rc.2",
    "peers": {
      "@deepseek-ai/dsh-client-runtime": ">=0.2.0-rc.1",
      "@deepseek-ai/dsh-host-webserver": ">=0.2.0-rc.1",
      "@deepseek-ai/dsh-client-ui-slots": ">=0.2.0-rc.1"
    }
  },
  "@modusensus/dsh-mneme@0.8.13": {
    "mounted": false,
    "reason": "仅范围覆盖（>=0.2.0-rc.0 <0.3.0），上游未点名 rc.2",
    "peers": {
      "@deepseek-ai/dsh-llm": ">=0.1.0-rc.6 <0.2.0 || >=0.1.5-rc.0 <0.3.0 || >=0.2.0-rc.0 <0.3.0",
      "@deepseek-ai/dsh-tools": ">=0.1.0-rc.6 <0.2.0 || >=0.1.5-rc.0 <0.3.0 || >=0.2.0-rc.0 <0.3.0",
      "@deepseek-ai/dsh-system-prompt": ">=0.1.0-rc.6 <0.2.0 || >=0.1.5-rc.0 <0.3.0 || >=0.2.0-rc.0 <0.3.0",
      "@deepseek-ai/dsh-host-webserver": ">=0.1.0-rc.6 <0.2.0 || >=0.1.5-rc.0 <0.3.0 || >=0.2.0-rc.0 <0.3.0"
    }
  },
  "@mrweicodes/dsh-loop-guard@1.0.8": {
    "mounted": false,
    "reason": "仅范围覆盖（>=0.2.0-alpha.1 <0.3.0）；上游 2026-10-09 后无更新",
    "peers": {
      "@deepseek-ai/dsh-llm": ">=0.1.2-rc.1 <0.1.3 || >=0.1.3-alpha.2 <0.1.4 || >=0.1.5-alpha.1 <0.2.0 || >=0.1.6-alpha.1 <0.2.0 || >=0.1.7-alpha.1 <0.2.0 || >=0.2.0-alpha.1 <0.3.0",
      "@deepseek-ai/dsh-agent": ">=0.1.2-rc.1 <0.1.3 || >=0.1.3-alpha.2 <0.1.4 || >=0.1.5-alpha.1 <0.2.0 || >=0.1.6-alpha.1 <0.2.0 || >=0.1.7-alpha.1 <0.2.0 || >=0.2.0-alpha.1 <0.3.0"
    }
  },
  "dsh-computer-use-win@0.2.3": {
    "mounted": false,
    "reason": "无任何 @deepseek-ai/dsh-* peer 声明 → 无法确认",
    "peers": {}
  },
  "dsh-prompt@0.3.0": {
    "mounted": false,
    "reason": "engines.dsh >=0.2.0-rc.2 属范围覆盖（README 讨论过 DSH 0.2.1 兼容门，但未点名具体 rc）",
    "peers": {}
  },
  "@liustack/modlens@3.26.6": {
    "mounted": false,
    "reason": "无任何 peer / engines 声明 → 无法确认",
    "peers": {}
  },
  "dsh-effort-slider@1.3.1": {
    "mounted": false,
    "reason": "无任何兼容声明；上游 2026-09-26 后停更 → 无法确认",
    "peers": {}
  },
  "dsh-computer-use@git 72f390a (0.1.0)": {
    "mounted": false,
    "reason": "peer 全为 * 通配、无 dsh.compatibility 声明；上游仓库最后提交即该钉提交（2026-09-15）→ 未适配且无法确认",
    "peers": {}
  },
  "dsh-agent-arena@git 25e2c55 (fork 0.6.0)": {
    "mounted": false,
    "reason": "上游 Tikzen 0.7.0 精确钉 0.2.0-rc.2 → 未适配；本包用自维护 fork，放开 peer 后仅范围覆盖",
    "peers": {
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
  "@tencent-connect/dsh-qqbot@git 7e88006 (fork 0.5.1)": {
    "mounted": false,
    "reason": "peer >=0.1.0-rc.6 仅范围覆盖；上游 npm 已发 0.5.2，同样未点名 rc.2",
    "peers": {
      "@deepseek-ai/dsh-agent": ">=0.1.0-rc.6",
      "@deepseek-ai/dsh-llm": ">=0.1.0-rc.6",
      "@deepseek-ai/dsh-session": ">=0.1.0-rc.6",
      "@deepseek-ai/dsh-user-approval": ">=0.1.0-rc.6"
    }
  }
};

function check(name, entry) {
  const peers = entry.peers || {};
  console.log(`\n=== ${name} ===`);
  if (entry.declaration) console.log(`  声明依据：${entry.declaration}`);
  if (entry.reason) console.log(`  屏蔽原因：${entry.reason}`);
  if (Object.keys(peers).length === 0) {
    console.log("  (无 @deepseek-ai/dsh* peer 约束 → 安装门禁 PASS，运行时需冒烟测试)");
    return true;
  }
  let ok = true;
  for (const [dep, range] of Object.entries(peers)) {
    const r = satisfies(HOST, range);
    if (!r) ok = false;
    console.log(`  ${r ? "✅" : "❌"} ${dep}  "${range}"  →  ${HOST} ${r ? "满足" : "不满足"}`);
  }
  console.log(`  >> ${ok ? "兼容 " + HOST : "不兼容！"}`);
  return ok;
}

let mountedTotal = 0, mountedFail = 0;
for (const [name, entry] of Object.entries(MOUNTED)) {
  mountedTotal++;
  if (!check(name, entry)) mountedFail++;
}

let shelvedTotal = 0, shelvedFail = 0, shelvedNoDecl = 0;
for (const [name, entry] of Object.entries(SHELVED)) {
  shelvedTotal++;
  if (Object.keys(entry.peers || {}).length === 0) shelvedNoDecl++;
  if (!check(name, entry)) shelvedFail++;
}

console.log(`\n==== 已挂载插件：${mountedTotal - mountedFail}/${mountedTotal} 通过 peer 门禁 ${mountedFail === 0 ? "✅" : "❌"} ====`);
console.log(`==== 暂屏蔽插件：${shelvedTotal} 个（不挂载，不计入门禁）====`);
console.log(`     其中 ${shelvedFail} 个连 peer 范围都不满足 ${HOST}；${shelvedNoDecl} 个根本没有 @deepseek-ai/dsh* peer 声明；`);
console.log('     其余仅靠开区间“范围覆盖”，上游并未点名适配 0.2.1-rc.2 —— 这是本版把它们移出 bundles 的原因。');
process.exitCode = mountedFail === 0 ? 0 : 1;
