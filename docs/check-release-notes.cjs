#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));
const version = manifest.version;
const notesPath = path.join(root, "docs", "release-notes-v" + version + ".md");
if (!fs.existsSync(notesPath)) throw new Error("missing release notes for manifest version " + version);
const notes = fs.readFileSync(notesPath, "utf8");
for (const heading of ["中文", "English"]) {
  const marker = "## " + heading;
  const start = notes.indexOf(marker);
  if (start < 0) throw new Error("release notes must contain a top-level " + marker + " section");
  const body = notes.slice(start + marker.length).split(/^## /m, 1)[0].trim();
  if (body.length < 80) throw new Error("release notes section " + marker + " is too short");
}
console.log("validated bilingual release notes for " + version);
