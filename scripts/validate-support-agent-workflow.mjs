import fs from 'node:fs'

const file = new URL('../workflow/ai-customer-support-agent.json', import.meta.url)
const workflow = JSON.parse(fs.readFileSync(file, 'utf8'))
const serialized = JSON.stringify(workflow)

const expectedName = 'Build an AI customer support agent with OpenRouter, memory and Gmail'
const requiredNodes = [
  'When chat message received',
  'Configure support agent',
  'Customer Support Agent',
  'OpenRouter Chat Model',
  'Conversation Memory',
  'Search help center',
  'Look up fictional order',
  'Check return eligibility',
  'Escalate to human support',
]
const requiredStickies = [
  'Read me first',
  'Step 1 - Configure and chat',
  'Step 2 - Agent reasoning',
  'Step 3 - Safe support tools',
  'Step 4 - Human escalation',
]

if (workflow.name !== expectedName) throw new Error('Creator title and workflow name do not match')
for (const name of [...requiredNodes, ...requiredStickies]) {
  if (!workflow.nodes.some((node) => node.name === name)) throw new Error(`Missing node: ${name}`)
}

const guide = workflow.nodes.find((node) => node.name === 'Read me first')
const guideWords = String(guide?.parameters?.content || '').trim().split(/\s+/).length
if (guideWords < 200) throw new Error('Main sticky must contain at least 200 words')
if (!guide?.parameters?.color) throw new Error('Main sticky must use a visible color')
if (workflow.active !== false) throw new Error('Public workflow must remain inactive')
if (workflow.nodes.some((node) => node.credentials)) throw new Error('Credential references must not be exported')
if (/quick-flow|lovable\.app|teamia\.ai|@gmail\.com|Bearer\s+[A-Za-z0-9_-]{20,}/i.test(serialized)) {
  throw new Error('Private endpoint, personal email or credential found')
}

const gmailTool = workflow.nodes.find((node) => node.name === 'Escalate to human support')
if (!String(gmailTool?.parameters?.sendTo || '').includes('Configure support agent')) {
  throw new Error('Escalation recipient must come from the configuration node')
}

console.log(JSON.stringify({
  active: workflow.active,
  mainStickyWords: guideWords,
  name: workflow.name,
  nodeCount: workflow.nodes.length,
  tools: 4,
}, null, 2))
