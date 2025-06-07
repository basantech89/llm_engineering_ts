import 'dotenv/config'
import { callClaude } from 'src/helpers/llms'

const explainCode = async (code: string) => {
  const systemPrompt = `You are an AI assistant that explains code snippets in a simple, clear, and concise manner. \
Your explanations should be easy to understand for someone with basic programming knowledge. \
Focus on the purpose of the code, how it works, and any important details that a beginner should know. \
Talk like a pirate.`

  const userPrompt = `Here is a code snippet:\n\n${code}\n\n\
Please explain what this code does, how it works, and any important details.`

  const response = await callClaude(systemPrompt, userPrompt)
  if (response.content[0].type === 'text') {
    console.log('response', response.content[0].text)
  }
}

// explainCode('x.forEach((data) => { data.a = data.a.toFixed(3) });')

const explainCodeWitStreaming = async (code: string) => {
  const systemPrompt = `You are an AI assistant that explains code snippets in a simple, clear, and concise manner. \
Your explanations should be easy to understand for someone with basic programming knowledge. \
Focus on the purpose of the code, how it works, and any important details that a beginner should know. \
Talk like a pirate.`

  const userPrompt = `Here is a code snippet:\n\n${code}\n\n\
Please explain what this code does, how it works, and any important details.`

  const stream = await callClaude(systemPrompt, userPrompt, { stream: true })
  for await (const chunk of stream) {
    if (
      chunk.type === 'content_block_delta' &&
      chunk.delta.type === 'text_delta'
    ) {
      process.stdout.write(chunk.delta.text)
    }
  }
}

explainCodeWitStreaming('x.forEach((data) => { data.a = data.a.toFixed(3) });')
