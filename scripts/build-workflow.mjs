import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "workflow", "opportunity-monitor.json");

function buildWorkflow() {
  return {
  name: "Monitor and score RSS opportunities in Google Sheets with Gmail",
  nodes: [
    node("note", "Template Guide", "n8n-nodes-base.stickyNote", 1, [0, -560], {
      content: mainStickyContent,
      height: 500,
      width: 1180,
      color: 4,
    }),
    node("note-config", "Step 1 - Configuration", "n8n-nodes-base.stickyNote", 1, [260, 40], {
      content: "## 1. Configure\n\nSet the RSS feed URLs, scoring keywords, threshold, Google Sheet tab and notification recipient here.",
      height: 440,
      width: 520,
    }),
    node("note-process", "Step 2 - Processing", "n8n-nodes-base.stickyNote", 1, [800, 40], {
      content: "## 2. Process\n\nFeeds run sequentially. Entries are normalized, deduplicated for 90 days and scored with visible reasons.",
      height: 560,
      width: 1040,
    }),
    node("note-output", "Step 3 - Review Queue", "n8n-nodes-base.stickyNote", 1, [1860, 40], {
      content: "## 3. Store and notify\n\nEvery new item is stored in Google Sheets. Gmail only sends a digest when an item reaches the configured threshold.",
      height: 560,
      width: 1080,
    }),
    node("manual", "Run Manually", "n8n-nodes-base.manualTrigger", 1, [80, 180], {}),
    node("schedule", "Every 30 Minutes", "n8n-nodes-base.scheduleTrigger", 1.2, [80, 340], {
      rule: { interval: [{ field: "minutes", minutesInterval: 30 }] },
    }),
    node("fields", "Configure Template", "n8n-nodes-base.set", 3.4, [340, 260], {
      assignments: {
        assignments: [
          assignment("rssFeedUrls", "PASTE_ONE_OR_MORE_RSS_URLS_HERE", "string"),
          assignment("searchName", "AI automation opportunities", "string"),
          assignment("priorityThreshold", 75, "number"),
          assignment("includeKeywords", "n8n, automation, api, ai agent, claude, openai, next.js", "string"),
          assignment("highValueKeywords", "long term, ongoing, migration, self-hosted, production, architecture", "string"),
          assignment("excludeKeywords", "unpaid, commission only, exposure", "string"),
          assignment("googleSheetTab", "Opportunities", "string"),
          assignment("notificationEmail", "YOUR_EMAIL@example.com", "string"),
        ],
      },
      options: {},
    }),
    node("config", "Build Search Configuration", "n8n-nodes-base.code", 2, [600, 260], {
      mode: "runOnceForAllItems",
      language: "javaScript",
      jsCode: buildSearchConfigurationCode,
    }),
    node("loop", "Loop Over Searches", "n8n-nodes-base.splitInBatches", 3, [860, 260], {
      batchSize: 1,
      options: {},
    }),
    node("rss", "Read RSS Feed", "n8n-nodes-base.rssFeedRead", 1.2, [1120, 380], {
      url: "={{ $json.rssUrl }}",
    }, null, { alwaysOutputData: true }),
    node("score", "Normalize, Deduplicate & Score", "n8n-nodes-base.code", 2, [1380, 380], {
      mode: "runOnceForAllItems",
      language: "javaScript",
      jsCode: scoreCode,
    }),
    node("has-new", "Has New Opportunities?", "n8n-nodes-base.if", 2.3, [1640, 380], {
      conditions: { options: { caseSensitive: true, leftValue: "", typeValidation: "strict" }, conditions: [{ leftValue: "={{ $json.candidates.length }}", rightValue: 0, operator: { type: "number", operation: "gt" } }], combinator: "and" },
    }),
    node("expand", "Expand Opportunities", "n8n-nodes-base.code", 2, [1900, 300], {
      mode: "runOnceForAllItems",
      language: "javaScript",
      jsCode: "return ($input.first().json.candidates || []).map((candidate) => ({ json: candidate }));",
    }),
    node("sheets", "Save Opportunities", "n8n-nodes-base.googleSheets", 4.5, [2160, 300], {
      operation: "append",
      documentId: { __rl: true, mode: "url", value: "" },
      sheetName: { __rl: true, mode: "name", value: "={{ $('Configure Template').first().json.googleSheetTab }}" },
      columns: {
        mappingMode: "defineBelow",
        value: {
          detected_at: "={{ $json.detected_at }}",
          source_search: "={{ $json.source_search }}",
          title: "={{ $json.title }}",
          url: "={{ $json.url }}",
          published_at: "={{ $json.published_at }}",
          score: "={{ $json.score }}",
          score_reasons: "={{ $json.score_reasons }}",
          categories: "={{ $json.categories }}",
          budget_label: "={{ $json.budget_label }}",
          status: "={{ $json.status }}",
        },
        matchingColumns: [],
        schema: ["detected_at", "source_search", "title", "url", "published_at", "score", "score_reasons", "categories", "budget_label", "status"].map((id) => ({ id, displayName: id, type: id === "score" ? "number" : "string" })),
      },
      options: {},
    }),
    node("digest", "Build Priority Digest", "n8n-nodes-base.code", 2, [2420, 300], {
      mode: "runOnceForAllItems",
      language: "javaScript",
      jsCode: digestCode,
    }),
    node("has-priority", "Has Priority Opportunities?", "n8n-nodes-base.if", 2.3, [2680, 300], {
      conditions: { options: { caseSensitive: true, leftValue: "", typeValidation: "strict" }, conditions: [{ leftValue: "={{ $json.priorityCount }}", rightValue: 0, operator: { type: "number", operation: "gt" } }], combinator: "and" },
    }),
    node("gmail", "Send Priority Digest", "n8n-nodes-base.gmail", 2.1, [2940, 220], {
      sendTo: "={{ $('Configure Template').first().json.notificationEmail }}",
      subject: "={{ $json.subject }}",
      message: "={{ $json.message }}",
      options: {},
    }),
    node("wait", "Wait Before Next Search", "n8n-nodes-base.wait", 1.1, [3200, 380], {
      resume: "timeInterval",
      amount: 2,
      unit: "seconds",
      options: {},
    }),
    node("done", "Finished", "n8n-nodes-base.noOp", 1, [1120, 120], {}),
  ],
  connections: {
    "Run Manually": { main: [[{ node: "Configure Template", type: "main", index: 0 }]] },
    "Every 30 Minutes": { main: [[{ node: "Configure Template", type: "main", index: 0 }]] },
    "Configure Template": { main: [[{ node: "Build Search Configuration", type: "main", index: 0 }]] },
    "Build Search Configuration": { main: [[{ node: "Loop Over Searches", type: "main", index: 0 }]] },
    "Loop Over Searches": { main: [[{ node: "Finished", type: "main", index: 0 }], [{ node: "Read RSS Feed", type: "main", index: 0 }]] },
    "Read RSS Feed": { main: [[{ node: "Normalize, Deduplicate & Score", type: "main", index: 0 }]] },
    "Normalize, Deduplicate & Score": { main: [[{ node: "Has New Opportunities?", type: "main", index: 0 }]] },
    "Has New Opportunities?": { main: [[{ node: "Expand Opportunities", type: "main", index: 0 }], [{ node: "Wait Before Next Search", type: "main", index: 0 }]] },
    "Expand Opportunities": { main: [[{ node: "Save Opportunities", type: "main", index: 0 }]] },
    "Save Opportunities": { main: [[{ node: "Build Priority Digest", type: "main", index: 0 }]] },
    "Build Priority Digest": { main: [[{ node: "Has Priority Opportunities?", type: "main", index: 0 }]] },
    "Has Priority Opportunities?": { main: [[{ node: "Send Priority Digest", type: "main", index: 0 }], [{ node: "Wait Before Next Search", type: "main", index: 0 }]] },
    "Send Priority Digest": { main: [[{ node: "Wait Before Next Search", type: "main", index: 0 }]] },
    "Wait Before Next Search": { main: [[{ node: "Loop Over Searches", type: "main", index: 0 }]] },
  },
  settings: {
    executionOrder: "v1",
    timezone: "UTC",
    saveDataErrorExecution: "all",
    saveDataSuccessExecution: "none",
    saveManualExecutions: true,
    executionTimeout: 180,
  },
  active: false,
  };
}

function node(id, name, type, typeVersion, position, parameters, credentials, extra = {}) {
  return { id, name, type, typeVersion, position, parameters, ...(credentials ? { credentials } : {}), ...extra };
}

function assignment(name, value, type) {
  return { id: `config-${name}`, name, value, type };
}

const mainStickyContent = String.raw`
# Monitor and score RSS opportunities in Google Sheets with Gmail

## Who's it for
Freelancers, consultants, recruiters, sales teams and partnership managers who repeatedly scan RSS feeds and need a reliable review queue without automating outreach.

## How it works
The workflow checks one or more RSS feeds manually or every 30 minutes. It processes feeds sequentially, normalizes each entry, remembers URLs for 90 days and calculates an explainable score from editable positive, high-value and exclusion keywords. Every new opportunity is appended to Google Sheets. Gmail sends one digest only when an item reaches the configured priority threshold. Applications, proposals and outreach always remain under human control.

## How to set up
Open **Configure Template** and add RSS URLs, keywords, a threshold, the Google Sheet tab and your notification email. Create a sheet from the included CSV headers, select it in **Save Opportunities**, connect Google Sheets and Gmail credentials, then run the workflow manually before activating the schedule.

## Requirements
- n8n Cloud or self-hosted n8n
- One or more public RSS feeds
- Google Sheets OAuth2
- Gmail OAuth2 for notifications

## How to customize
Adjust keywords and weights in **Normalize, Deduplicate & Score**, change the schedule, or replace Gmail with Slack or another review channel. No paid AI API is required.
`.trim();

const buildSearchConfigurationCode = String.raw`
const config = $input.first().json;
const list = (value) => String(value || "").split(",").map((item) => item.trim().toLowerCase()).filter(Boolean);
const urls = String(config.rssFeedUrls || "").split(/\r?\n|,/).map((url) => url.trim()).filter((url) => /^https?:\/\//i.test(url));
const scoring = {
  priorityThreshold: Number(config.priorityThreshold || 75),
  includeKeywords: list(config.includeKeywords),
  highValueKeywords: list(config.highValueKeywords),
  excludeKeywords: list(config.excludeKeywords),
};

return urls.slice(0, 10).map((rssUrl, index) => ({
  json: {
    name: urls.length === 1 ? config.searchName : config.searchName + " " + (index + 1),
    rssUrl,
    scoring,
  },
}));
`.trim();

const scoreCode = String.raw`
const search = $("Loop Over Searches").item.json;
const entries = $input.all().slice(0, 50).map((item) => item.json || {});
const state = $getWorkflowStaticData("global");
state.seen = state.seen || {};
const now = Date.now();
const retentionMs = 90 * 24 * 60 * 60 * 1000;

for (const [key, seenAt] of Object.entries(state.seen)) {
  if (now - Number(seenAt) > retentionMs) delete state.seen[key];
}

const plain = (value) => String(value || "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const candidates = [];

for (const entry of entries) {
  const title = plain(entry.title);
  const url = plain(entry.link || entry.guid);
  if (!title || !/^https?:\/\//i.test(url) || state.seen[url]) continue;

  const description = plain(entry.contentSnippet || entry.description || entry.content);
  const haystack = (title + " " + description).toLowerCase();
  let score = 20;
  const reasons = [];

  for (const keyword of search.scoring.includeKeywords) {
    if (haystack.includes(keyword.toLowerCase())) { score += 8; reasons.push("match: " + keyword); }
  }
  for (const keyword of search.scoring.highValueKeywords) {
    if (haystack.includes(keyword.toLowerCase())) { score += 10; reasons.push("high value: " + keyword); }
  }
  for (const keyword of search.scoring.excludeKeywords) {
    if (haystack.includes(keyword.toLowerCase())) { score -= 30; reasons.push("risk: " + keyword); }
  }

  score = Math.max(0, Math.min(100, score));
  state.seen[url] = now;
  candidates.push({
    detected_at: new Date(now).toISOString(),
    source_search: search.name,
    title,
    url,
    published_at: entry.isoDate || entry.pubDate || "",
    score,
    score_reasons: reasons.join(" | ") || "No configured keyword matched",
    categories: (Array.isArray(entry.categories) ? entry.categories : [entry.category]).filter(Boolean).join(", "),
    budget_label: (haystack.match(/budget[^.\n]{0,80}/i) || [""])[0],
    status: score >= search.scoring.priorityThreshold ? "priority_review" : "to_review",
  });
}

return [{ json: { candidates, priorityThreshold: search.scoring.priorityThreshold } }];
`.trim();

const digestCode = String.raw`
const items = $input.all().map((item) => item.json || {});
const threshold = Number($("Configure Template").first().json.priorityThreshold || 75);
const priority = items.filter((item) => Number(item.score) >= threshold);
const lines = priority.map((item) => [
  "Score " + item.score + "/100 - " + item.title,
  item.url,
  item.score_reasons,
].join("\n"));

return [{ json: {
  priorityCount: priority.length,
  subject: priority.length + " priority automation opportunity" + (priority.length === 1 ? "" : "ies") + " to review",
  message: lines.join("\n\n---\n\n") || "No priority opportunity in this run.",
} }];
`.trim();

const workflow = buildWorkflow();
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(workflow, null, 2)}\n`);
console.log(`Built ${output}`);
