import { ChatCompletionCreateParamsStreaming } from 'openai/resources/chat/completions'
import OpenAI from 'openai'

const openai = new OpenAI({ baseURL: 'http://127.0.0.1:1234/v1' })

export async function* streamResponse(
  systemPrompt: string,
  userPrompt: string,
  args: Partial<ChatCompletionCreateParamsStreaming> = {}
) {
  const stream = await openai.chat.completions.create({
    model: 'google/gemma-3-12b',
    stream: true,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    ...args
  })

  for await (const chunk of stream) {
    const data = chunk.choices[0].delta.content || ''
    yield data
  }
}
