# Monitor and score RSS opportunities in Google Sheets with Gmail

Monitor RSS feeds for relevant freelance, hiring, sales or partnership opportunities. The workflow normalizes each item, removes URLs already seen, applies explainable keyword scoring, stores every new opportunity in Google Sheets and emails a digest when a score reaches the review threshold.

This community edition is derived from a production opportunity-monitoring system. It contains no private API endpoint, credential identifier, client data or automatic outreach.

## What it does

1. Runs manually or every 30 minutes.
2. Reads up to 10 configurable RSS feeds sequentially.
3. Normalizes up to 50 entries per feed.
4. Deduplicates URLs for 90 days with n8n workflow static data.
5. Scores opportunities with visible positive, high-value and exclusion keywords.
6. Appends new items to Google Sheets.
7. Sends one Gmail digest for priority items.
8. Leaves every application, proposal and outreach decision to a human.

## Architecture

```text
Manual/Schedule Trigger
  -> Configure RSS searches and scoring
  -> Loop over feeds
  -> Read RSS
  -> Normalize, deduplicate and score
  -> Save new items to Google Sheets
  -> Build priority digest
  -> Gmail notification
  -> Human review
```

## Requirements

- n8n Cloud or a self-hosted n8n instance
- one or more public RSS feed URLs
- a Google account for Google Sheets
- a Gmail credential for optional notifications

No paid AI API is required. The scoring is deterministic and fully editable.

## Setup

1. Download [`workflow/opportunity-monitor.json`](workflow/opportunity-monitor.json).
2. Import it into n8n.
3. Open **Configure Template**.
4. Replace `PASTE_YOUR_RSS_FEED_URL_HERE` with your feed URL.
5. Adjust the include, high-value and exclusion keywords.
6. Create a Google Sheet and import [`templates/opportunities.csv`](templates/opportunities.csv).
7. Name the sheet tab `Opportunities`.
8. Select the document and Google credential in **Save Opportunities**.
9. Connect Gmail and replace `YOUR_EMAIL@example.com` in **Configure Template**.
10. Run the workflow manually and inspect the first rows.
11. Activate the schedule only after the manual run succeeds.

## Scoring

Every new item starts at 20 points:

- include keyword: `+8`
- high-value keyword: `+10`
- exclusion keyword: `-30`
- final score is limited to `0-100`
- default notification threshold: `75`

The Google Sheet stores the reasons behind every score. Change the weights and keywords to match your market instead of treating the default configuration as a universal model.

## Safety and limitations

- The workflow never sends applications or prospecting messages.
- RSS content is untrusted external input. Review it before acting.
- Workflow static data is convenient for a lightweight template, but a database is preferable for large teams or high-volume workloads.
- The first manual execution does not persist static workflow data in every n8n configuration. Test deduplication after activation with a low-frequency schedule.
- Respect the terms, rate limits and robots rules of every source you monitor.

## Production case study

The production version adds a dedicated database, configurable searches, an opportunity dashboard, stronger ingestion controls, cleanup rules and explicit human promotion into a commercial pipeline.

[Read the production case study](https://manda-ia.com/en/projects/veille-codeur-automatisation-n8n?utm_source=github&utm_medium=repository&utm_campaign=ai-opportunity-monitor)

## Development

```bash
npm run build
npm run check
```

The generated workflow is kept in version control so it can be inspected before import.

## License

MIT
