# Build an AI customer support agent with OpenRouter, memory and Gmail

This public showcase workflow creates a conversational customer support agent inside n8n. It answers common questions, looks up fictional orders, checks return eligibility and escalates a structured case to a human support inbox only after the user explicitly confirms.

## Who it is for

Customer support teams, agencies and automation builders who want a safe starting point for an AI agent with tools without connecting a real order database during evaluation.

## How it works

1. A user starts a conversation through the n8n chat interface.
2. **Configure support agent** provides the company name, support address and policy settings.
3. The AI Agent uses OpenRouter and Simple Memory to understand follow-up messages.
4. Three deterministic Code Tools search a small help center, return fictional order statuses and evaluate return rules.
5. The Gmail tool sends a case to a human reviewer only after the user explicitly requests escalation and confirms the summary.

The workflow never sends refunds, changes orders or emails customers. It is a showcase with fictional order data.

## Setup

1. Import `workflow/ai-customer-support-agent.json` into n8n.
2. Open **Configure support agent** and replace the company name, support inbox, policy and support hours.
3. Connect an OpenRouter credential to **OpenRouter Chat Model**.
4. Connect Gmail OAuth to **Escalate to human support**.
5. Test with the manual chat before making the chat public or activating the workflow.

## Suggested tests

- `Where is order ORD-1042?`
- `Can I return an unopened item delivered 12 days ago?`
- `What is your warranty policy?`
- `Please escalate this to a human.`

All production integrations, identity checks and authorization rules must be added before adapting this showcase to real customer data.
