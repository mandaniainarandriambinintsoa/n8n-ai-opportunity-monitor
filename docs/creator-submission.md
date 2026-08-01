# n8n Creator Hub submission

## Template title

Monitor and score RSS opportunities in Google Sheets with Gmail

## Short description

Monitor multiple RSS feeds for freelance, hiring, sales or partnership opportunities. Deduplicate entries, apply explainable keyword scoring, save results to Google Sheets and email a digest when high-priority items appear.

## Who is this for?

Freelancers, consultants, recruiters, sales teams and partnership managers who repeatedly scan RSS feeds and need a review queue without automating outreach.

## Problem

Relevant opportunities are easy to miss when they are spread across several feeds. Manual checking consumes time, duplicate listings create noise, and black-box AI scoring makes it difficult to understand why an item was prioritized.

## How it works

1. A manual or scheduled trigger starts the workflow.
2. A configuration node defines RSS feeds, keywords and the priority threshold.
3. Feeds are processed sequentially to control load.
4. Entries are normalized and deduplicated by URL for 90 days.
5. Deterministic rules calculate a score and preserve the reasons.
6. New items are appended to Google Sheets.
7. Gmail sends a digest only for opportunities above the threshold.
8. A person reviews every opportunity and decides whether to respond.

## Required credentials

- Google Sheets OAuth2
- Gmail OAuth2

## Required setup

- Add at least one public RSS URL in `Configure Searches & Scoring`.
- Create a sheet named `Opportunities` using the included CSV headers.
- Select the Google Sheet and Gmail recipient.
- Complete a manual test before activating the schedule.

## Suggested categories

- Sales
- HR
- Productivity
- Other

## Apps

- RSS Feed Read
- Google Sheets
- Gmail
- Code

## Creator profile URL

https://manda-ia.com/en/services/remote-n8n-automation-consultant?utm_source=n8n&utm_medium=creator_profile&utm_campaign=ai-opportunity-monitor

## Case study URL

https://manda-ia.com/en/projects/veille-codeur-automatisation-n8n?utm_source=n8n&utm_medium=template&utm_campaign=ai-opportunity-monitor

## Review checklist

- [ ] Import succeeds on the current n8n version.
- [ ] Sticky note explains every required setup step.
- [ ] No credential ID or private endpoint is present.
- [ ] Node names describe business actions.
- [ ] Manual execution succeeds with a test feed.
- [ ] Duplicate URLs are not re-added after activation.
- [ ] Google Sheet receives every expected field.
- [ ] Gmail sends only when the score reaches the threshold.
- [ ] The workflow remains inactive in the published export.
- [ ] Screenshot uses sample data only.
