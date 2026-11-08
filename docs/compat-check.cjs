// DSH plugin compatibility check for v3.1.0-pre.4.
// This mirrors dsh-app-boot@0.2.2-rc.1: engines.dsh takes precedence over
// DSH peer dependencies, and prereleases participate in range matching.
const HOST = "0.2.2-rc.1";

function parse(version) {
  const [core, prerelease = ""] = version.trim().split("-");
  return {
    numbers: core.split(".").map(Number),
    prerelease: prerelease ? prerelease.split(".") : []
  };
}

function comparePrerelease(left, right) {
  if (left.length === 0 && right.length === 0) return 0;
  if (left.length === 0) return 1;
  if (right.length === 0) return -1;
  for (let i = 0; i < Math.max(left.length, right.length); i++) {
    if (left[i] === undefined) return -1;
    if (right[i] === undefined) return 1;
    const leftNumeric = /^\d+$/.test(left[i]);
    const rightNumeric = /^\d+$/.test(right[i]);
    if (leftNumeric && rightNumeric && Number(left[i]) !== Number(right[i])) {
      return Number(left[i]) - Number(right[i]);
    }
    if (leftNumeric !== rightNumeric) return leftNumeric ? -1 : 1;
    if (left[i] !== right[i]) return left[i] < right[i] ? -1 : 1;
  }
  return 0;
}

function compare(left, right) {
  const a = parse(left);
  const b = parse(right);
  for (let i = 0; i < 3; i++) {
    if (a.numbers[i] !== b.numbers[i]) return a.numbers[i] - b.numbers[i];
  }
  return comparePrerelease(a.prerelease, b.prerelease);
}

function satisfies(version, range) {
  if (range.includes("||")) {
    return range.split("||").some((part) => satisfies(version, part.trim()));
  }
  const parts = range.trim().split(/\s+/).filter(Boolean);
  if (parts.length > 1) return parts.every((part) => satisfies(version, part));
  const term = parts[0] || "";
  if (term.startsWith(">=")) return compare(version, term.slice(2)) >= 0;
  if (term.startsWith(">")) return compare(version, term.slice(1)) > 0;
  if (term.startsWith("<=")) return compare(version, term.slice(2)) <= 0;
  if (term.startsWith("<")) return compare(version, term.slice(1)) < 0;
  if (term.startsWith("^")) {
    const base = term.slice(1);
    const [major, minor, patch] = base.split("-")[0].split(".").map(Number);
    const upper = major > 0
      ? `${major + 1}.0.0-0`
      : minor > 0
        ? `0.${minor + 1}.0-0`
        : `0.0.${patch + 1}-0`;
    return compare(version, base) >= 0 && compare(version, upper) < 0;
  }
  return compare(version, term) === 0;
}

const MOUNTED = [
  ["dsh-cost-meter", "1.9.58", { engines: ">=0.2.0-rc.1 <0.3.0-0" }],
  ["@linxin666/dsh-client-ui-git-graph", "0.4.14", {
    peers: { "@deepseek-ai/dsh": ">=0.2.1-rc.3" }
  }],
  ["dsh-pet", "0.4.5", {
    peers: {
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
  }],
  ["@michengai/dsh-btw", "1.3.5", { engines: ">=0.2.0-rc.1 <0.3.0-0" }],
  ["@michengai/dsh-simplify", "1.0.7", { engines: ">=0.2.0-rc.1 <0.3.0-0" }],
  ["@michengai/dsh-code-review", "1.0.8", { engines: ">=0.2.0-rc.1 <0.3.0-0" }],
  ["@michengai/dsh-codex-ui", "2.0.19", { engines: ">=0.2.0-rc.1 <0.3.0-0" }],
  ["@nanmicoder/dsh-agent-teams", "0.1.29", { engines: ">=0.1.2-alpha.2" }],
  ["dsh-context", "0.82.2", {
    engines: ">=0.2.0-rc.2 || >=0.2.1-rc.2 || >=0.2.2-rc.1"
  }],
  ["dsh-plugin-subagent-director", "0.6.0", { engines: ">=0.2.1-rc.1" }],
  ["billion-context", "0.1.212", {
    note: "no explicit engines.dsh or @deepseek-ai/dsh-* peer declaration"
  }],
  ["dshmarket", "1.73.14", {
    peers: {
      "@deepseek-ai/dsh-settings": "^0.1.0-rc.7 || ^0.1.1-rc.2 || ^0.1.2-alpha.2 || ^0.2.0-rc.1 || ^0.2.1-alpha.3 || ^0.2.1-rc.1"
    }
  }],
  ["dsh-rea", "github:Fanqi89/dsh-rea#5769b4e55246787cb7c09025725db8e34db93e81", {
    engines: ">=0.2.1-rc.2"
  }],
  ["dsh-deepseek-stack", "github:yukitakasama/dsh-deepseek-stack#ed2fb187e6c8eea1b74bba754c1b229d17c176ac", {
    engines: ">=0.2.2-rc.1 <0.3.0-0"
  }]
];

let failures = 0;
for (const [name, version, declaration] of MOUNTED) {
  const requirements = declaration.engines
    ? { "engines.dsh": declaration.engines }
    : declaration.peers || {};
  const unmet = Object.entries(requirements).filter(([, range]) => !satisfies(HOST, range));
  const status = unmet.length > 0 ? "incompatible" : declaration.note ? "unverified" : "compatible";
  if (unmet.length > 0) failures++;
  console.log(`\n=== ${name}@${version} ===`);
  for (const [field, range] of Object.entries(requirements)) {
    console.log(`  ${satisfies(HOST, range) ? "PASS" : "FAIL"} ${field}: ${range}`);
  }
  if (declaration.note) console.log(`  !! ${declaration.note}`);
  console.log(`  >> ${status} with ${HOST}`);
}

const unverified = MOUNTED.filter(([, , declaration]) => declaration.note).length;
console.log(`\n==== mounted plugins: ${MOUNTED.length - failures}/${MOUNTED.length} gate pass; ${unverified} unverified ====\n`);
process.exitCode = failures === 0 ? 0 : 1;
