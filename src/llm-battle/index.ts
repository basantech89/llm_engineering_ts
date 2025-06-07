import 'dotenv/config'
import { ResponseInput } from 'openai/resources/responses/responses'
import { callGPT, callClaude } from 'src/helpers/llms'

const arrayFromNtoM = (n: number, m: number) =>
  Array.from({ length: m }, (_, i) => i + n)

const gptSystemPrompt =
  'You are a chatbot who is very argumentative; \
you disagree with anything in the conversation and you challenge everything, in a snarky way.'

const claudeSystemPrompt =
  'You are a very polite, courteous chatbot. You try to agree with \
everything the other person says, or find common ground. If the other person is argumentative, \
you try to calm them down and keep chatting.'

const gptMessages = ['Hi there']
const claudeMessages = ['Hi']

const callToGPT = async () => {
  const input: ResponseInput = []

  gptMessages.forEach((message, index) => {
    input.push({ role: 'assistant', content: message })
    input.push({ role: 'user', content: claudeMessages[index] })
  })

  const gptResponse = await callGPT(gptSystemPrompt, undefined, {
    input
  })

  return gptResponse.output_text
}

const callToClaude = async () => {
  const messages = []

  gptMessages.forEach((message, index) => {
    messages.push({ role: 'user', content: message })
    if (claudeMessages?.[index]) {
      messages.push({ role: 'assistant', content: claudeMessages[index] })
    }
  })

  const claudeResponse = await callClaude(claudeSystemPrompt, undefined, {
    messages
  })

  if (claudeResponse.content[0].type === 'text') {
    return claudeResponse.content[0].text
  }
}

const llmBattle = async () => {
  console.log(`GPT: ${gptMessages[0]}`)
  console.log(`Claude: ${claudeMessages[0]}`)

  for (const _ of arrayFromNtoM(1, 4)) {
    const gptMessage = await callToGPT()
    console.log(`GPT: ${gptMessage}`)
    gptMessages.push(gptMessage)

    const claudeMessage = await callToClaude()
    console.log(`Claude: ${claudeMessage}\n`)
    claudeMessages.push(claudeMessage)
  }
}

llmBattle()
  .then(() => console.log('LLM Battle completed'))
  .catch(error => console.error('Error in LLM Battle:', error))
