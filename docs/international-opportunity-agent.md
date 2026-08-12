# Score freelance opportunities from RSS with OpenRouter and Gmail

This public template monitors RSS feeds for international opportunities related to automation, n8n, APIs, AI agents and integrations. It uses deterministic scoring first, then asks OpenRouter to draft a concise response for high-scoring listings.

## Who it is for

Freelancers, consultants and small teams who want a review queue for relevant opportunities without scraping private platforms or sending applications automatically.

## How it works

1. Run manually or every six hours.
2. Configure public RSS feeds and keyword lists in **Configure opportunity agent**.
3. Read each feed sequentially.
4. Score listings with visible include, priority and exclusion keywords.
5. Send high-scoring listings to OpenRouter for a draft.
6. Send the draft and source link to Gmail for human review.

The workflow does not apply to jobs, send outreach, or invent contact details. The human decides whether and how to respond.

## Setup

1. Import `workflow/international-opportunity-agent.json` into n8n.
2. Replace the RSS URLs, keywords, score threshold, recipient email and profile context.
3. Create an n8n Header Auth credential named **OpenRouter API** with `Authorization: Bearer YOUR_OPENROUTER_API_KEY`.
4. Select an OpenRouter model available to your account.
5. Connect a Gmail OAuth credential named **Gmail account**.
6. Run manually first, inspect the review email, then activate the schedule.

## Requirements

- n8n Cloud or self-hosted n8n
- Public RSS feeds
- An OpenRouter API key
- A Gmail OAuth credential

The RSS content is external input. Review every generated draft before sending it anywhere.
