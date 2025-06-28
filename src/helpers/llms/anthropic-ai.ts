import Anthropic from '@anthropic-ai/sdk'
import { MessageCreateParamsBase } from '@anthropic-ai/sdk/resources/messages'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ''
})

export async function* streamResponse(
  systemPrompt: string,
  userPrompt?: string,
  args?: Partial<MessageCreateParamsBase>
) {
  const messages = []
  if (userPrompt) {
    messages.push({ role: 'user', content: userPrompt })
  }

  const stream = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    system: systemPrompt,
    max_tokens: 500,
    messages,
    ...args,
    stream: true
  })

  for await (const chunk of stream) {
    if (
      chunk.type === 'content_block_delta' &&
      chunk.delta.type === 'text_delta'
    ) {
      yield chunk.delta.text
    }
  }
}
