import ollama, { ChatRequest } from 'ollama'

export async function* streamResponse(
  systemPrompt: string,
  userPrompt: string,
  args?: Partial<ChatRequest>
) {
  const input = []
  if (userPrompt) {
    input.push({ role: 'user', content: userPrompt })
  }

  const stream = await ollama.chat({
    model: 'llama3.2',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    ...args,
    stream: true
  })

  for await (const chunk of stream) {
    if (chunk.message.content) {
      yield chunk.message.content
    }
  }
}
