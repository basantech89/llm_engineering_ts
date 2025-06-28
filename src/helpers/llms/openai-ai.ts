import OpenAI from 'openai'
import {
  ResponseCreateParamsBase,
  ResponseCreateParamsStreaming
} from 'openai/resources/responses/responses'

const apiKey = process.env.OPENAI_API_KEY

const openai = new OpenAI({ apiKey })

export function callGPT(
  systemPrompt: string,
  userPrompt?: string,
  args: Partial<ResponseCreateParamsBase> = {}
) {
  const input = []
  if (userPrompt) {
    input.push({ role: 'user', content: userPrompt })
  }

  return openai.responses.create({
    model: 'gpt-4.1-nano',
    instructions: systemPrompt,
    input,
    ...args,
    stream: false
  })
}

export async function* streamResponse(
  systemPrompt: string,
  userPrompt: string,
  args?: Partial<ResponseCreateParamsStreaming>
) {
  const input = []
  if (userPrompt) {
    input.push({ role: 'user', content: userPrompt })
  }

  const stream = await openai.responses.create({
    model: 'gpt-4.1-nano',
    instructions: systemPrompt,
    input,
    ...args,
    stream: true
  })

  for await (const chunk of stream) {
    if (chunk.type === 'response.output_text.delta') {
      yield chunk.delta
    }
  }
}
