import fs from 'node:fs'

const file = new URL('../workflow/international-opportunity-agent.json', import.meta.url)
const workflow = JSON.parse(fs.readFileSync(file, 'utf8'))
const serialized = JSON.stringify(workflow)

const expectedName = 'Score freelance opportunities from RSS with OpenRouter and Gmail'
const requiredNodes = [
  'Configure opportunity agent',
  'Build feed list',
  'Process feeds one by one',
  'Read public RSS feed',
  'Score opportunities',
  'Priority opportunity?',
  'Draft with OpenRouter',
  'Prepare review email',
  'Send draft for human review',
]
const requiredStickies = [
  'Read me first',
  'Step 1 - Start and configure',
  'Step 2 - Read feeds',
  'Step 3 - Score and filter',
  'Step 4 - Draft and review',
]

if (workflow.name !== expectedName) throw new Error('Creator title and workflow name do not match')
for (const name of [...requiredNodes, ...requiredStickies]) {
  if (!workflow.nodes.some((node) => node.name === name)) throw new Error(`Missing node: ${name}`)
}

const mainSticky = workflow.nodes.find((node) => node.name === 'Read me first')
const mainWordCount = String(mainSticky?.parameters?.content || '').trim().split(/\s+/).length
if (mainWordCount < 200) throw new Error('Main sticky must contain at least 200 words')
if (!mainSticky?.parameters?.color) throw new Error('Main sticky must use a visible color')
if (workflow.active !== false) throw new Error('Public workflow must remain inactive')
if (workflow.nodes.some((node) => node.credentials)) {
  throw new Error('Credential references must not be exported')
}
if (/Bearer\s+(?!YOUR_OPENROUTER_API_KEY)[A-Za-z0-9_-]{20,}|@gmail\.com/i.test(serialized)) {
  throw new Error('Potential credential or personal email found in workflow export')
}

console.log(JSON.stringify({
  active: workflow.active,
  mainStickyWords: mainWordCount,
  name: workflow.name,
  nodeCount: workflow.nodes.length,
  sectionStickies: requiredStickies.length - 1,
}, null, 2))
