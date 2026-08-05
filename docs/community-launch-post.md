# I built a no-AI-cost RSS opportunity monitor with Google Sheets and Gmail

I wanted a simple way to monitor several RSS feeds for freelance, hiring, sales, or partnership opportunities without paying for an LLM call on every feed item.

The workflow I built follows this pipeline:

1. Run manually or every 30 minutes.
2. Read up to 10 public RSS feeds one by one.
3. Normalize the latest entries and deduplicate URLs for 90 days.
4. Score each new item from configurable include, high-value, and exclusion keywords.
5. Append every new opportunity and its scoring reasons to Google Sheets.
6. Send a Gmail digest only when an item reaches the review threshold.

I deliberately kept the scoring deterministic. The weights and matching reasons are visible, there is no AI API cost, and users can adapt the rules to their own market. It also avoids sending untrusted RSS content directly into a model.

The workflow never sends an application or outreach message. Gmail is used only for the review digest, so a person still decides what deserves a response.

The official template is available here:

https://n8n.io/workflows/17715-score-rss-opportunities-to-google-sheets-and-send-priority-digests-with-gmail/?utm_source=n8n&utm_medium=community&utm_campaign=ai-opportunity-monitor

The sanitized workflow JSON, setup guide, and sample Google Sheet structure are also on GitHub:

https://github.com/mandaniainarandriambinintsoa/n8n-ai-opportunity-monitor?utm_source=n8n&utm_medium=community&utm_campaign=ai-opportunity-monitor

I would especially value feedback on two choices: using workflow static data for lightweight deduplication, and keeping keyword scoring instead of adding an LLM. What would you change for a reusable community edition?

Suggested tags: `workflow-building`, `google-sheets`, `gmail`, `rss`
