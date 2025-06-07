import 'dotenv/config'
import { callGPT } from 'src/helpers/llms'

const explainCode = async (code: string) => {
  const systemPrompt = `You are an AI assistant that explains code snippets in a simple, clear, and concise manner. \
Your explanations should be easy to understand for someone with basic programming knowledge. \
Focus on the purpose of the code, how it works, and any important details that a beginner should know.`

  const userPrompt = `Here is a code snippet:\n\n${code}\n\n\
Please explain what this code does, how it works, and any important details.`

  const stream = await callGPT(systemPrompt, userPrompt, { stream: true })
  for await (const chunk of stream) {
    const content = chunk.choices[0].delta.content
    if (content) {
      process.stdout.write(content)
    }
  }
}

explainCode('x.forEach((data) => { data.a = data.a.toFixed(3) });')
