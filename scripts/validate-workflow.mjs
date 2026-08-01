import fs from "node:fs";

const file = new URL("../workflow/opportunity-monitor.json", import.meta.url);
const workflow = JSON.parse(fs.readFileSync(file, "utf8"));
const serialized = JSON.stringify(workflow);

const requiredNodes = [
  "Configure Template",
  "Build Search Configuration",
  "Read RSS Feed",
  "Normalize, Deduplicate & Score",
  "Save Opportunities",
  "Send Priority Digest",
];

for (const name of requiredNodes) {
  if (!workflow.nodes.some((node) => node.name === name)) throw new Error(`Missing node: ${name}`);
}

const mainSticky = workflow.nodes.find((node) => node.name === "Template Guide");
if (!mainSticky) throw new Error("Main template sticky note is missing");
if (!mainSticky.parameters?.color) throw new Error("Main template sticky note must have a color");
if (String(mainSticky.parameters?.content || "").trim().split(/\s+/).length < 180) {
  throw new Error("Main template sticky note must contain the full description");
}

if (workflow.active !== false) throw new Error("Public workflow must be inactive");
if (/manda-prospection\.vercel\.app|N8N_API_KEY|NEON_CONNECTION_STRING|APP_SESSION_SECRET/.test(serialized)) {
  throw new Error("Private endpoint or secret name found in public workflow");
}
if (workflow.nodes.some((node) => node.credentials)) throw new Error("Credential references must not be exported");

console.log(JSON.stringify({ name: workflow.name, nodeCount: workflow.nodes.length, active: workflow.active, privateReferences: false }, null, 2));
