// Validate mounted plugins against the DSH version recorded in manifest.json.
// Compatibility declarations below are the checked package metadata snapshot.
const fs = require("node:fs");
const path = require("node:path");

const manifestPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(__dirname, "..", "manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const HOST = manifest.dshVersion || manifest.dshVersions?.[0];
const dependencies = manifest.dependencies && !Array.isArray(manifest.dependencies)
  ? manifest.dependencies
  : {};
const officialBundles = new Set([
  "@deepseek-ai/dsh-base",
  "@deepseek-ai/dsh-web-app"
]);
const bundleSet = new Set(manifest.bundles || []);

if (!HOST) {
  throw new Error("manifest does not declare dshVersion or dshVersions[0]");
}
if (!manifest.version || !manifest.name) {
  throw new Error("manifest is missing name or version");
}


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

const COMPATIBILITY = {
  "dsh-cost-meter": { engines: ">=0.2.0-rc.1 <0.3.0-0" },
  "@linxin666/dsh-client-ui-git-graph": {
    peers: { "@deepseek-ai/dsh": ">=0.2.1-rc.3" }
  },
  "dsh-pet": {
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
  },
  "@michengai/dsh-btw": { engines: ">=0.2.0-rc.1 <0.3.0-0" },
  "@michengai/dsh-simplify": { engines: ">=0.2.0-rc.1 <0.3.0-0" },
  "@michengai/dsh-code-review": { engines: ">=0.2.0-rc.1 <0.3.0-0" },
  "@michengai/dsh-codex-ui": { engines: ">=0.2.0-rc.1 <0.3.0-0" },
  "dsh-context": {
    engines: ">=0.2.0-rc.2 || >=0.2.1-rc.2 || >=0.2.2-rc.1"
  },
  "dshmarket": {
    peers: {
      "@deepseek-ai/dsh-settings": "^0.1.0-rc.7 || ^0.1.1-rc.2 || ^0.1.2-alpha.2 || ^0.2.0-rc.1 || ^0.2.1-alpha.3 || ^0.2.1-rc.1"
    }
  },
  "dsh-rea": { engines: ">=0.2.1-rc.2" },
  "dsh-deepseek-stack": { engines: ">=0.2.2-rc.1 <0.3.0-0" },
  "dsh-chief": { engines: ">=0.2.2-rc.2" },
  "dsh-deep-ptc-mode": { engines: ">=0.2.2-rc.1 <0.3.0" },
};

const mountedNames = Object.keys(dependencies);
const mountedBundles = [...bundleSet].filter((name) => !officialBundles.has(name));
let failures = 0;
const missingDependencies = mountedBundles.filter((name) => !dependencies[name]);
const extraDependencies = mountedNames.filter((name) => !bundleSet.has(name));
if (missingDependencies.length || extraDependencies.length) {
  failures++;
  console.error("\n!! manifest bundles/dependencies mismatch");
  if (missingDependencies.length) {
    console.error("  missing dependencies: " + missingDependencies.join(", "));
  }
  if (extraDependencies.length) {
    console.error("  dependencies not mounted: " + extraDependencies.join(", "));
  }
}

if (Array.isArray(manifest.dshVersions) && !manifest.dshVersions.includes(HOST)) {
  failures++;
  console.error("\n!! dshVersion is not included in dshVersions");
}

console.log("DSH host: " + HOST + " (manifest " + manifest.name + "@" + manifest.version + ")");
console.log("Manifest: " + manifestPath);
for (const name of mountedNames) {
  const version = dependencies[name];
  const declaration = COMPATIBILITY[name];
  console.log("\n=== " + name + "@" + version + " ===");
  if (!declaration) {
    failures++;
    console.log("  FAIL compatibility declaration: missing");
    continue;
  }
  const requirements = declaration.engines
    ? { "engines.dsh": declaration.engines }
    : declaration.peers || {};
  const unmet = Object.entries(requirements)
    .filter(([, range]) => !satisfies(HOST, range));
  if (unmet.length > 0) failures++;
  for (const [field, range] of Object.entries(requirements)) {
    console.log("  " + (satisfies(HOST, range) ? "PASS" : "FAIL") + " " + field + ": " + range);
  }
  console.log("  >> " + (unmet.length ? "incompatible" : "compatible") + " with " + HOST);
}

console.log("\n==== mounted plugins: " + (failures === 0 ? mountedNames.length : mountedNames.length - failures) + "/" + mountedNames.length + " gate pass; " + Object.keys(COMPATIBILITY).length + " declarations available ====\n");
process.exitCode = failures === 0 ? 0 : 1;
