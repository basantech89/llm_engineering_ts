import Anthropic, { APIPromise } from '@anthropic-ai/sdk'
import { Stream } from '@anthropic-ai/sdk/core/streaming'
import {
  Message,
  MessageCreateParamsNonStreaming,
  MessageCreateParamsStreaming,
  RawMessageStreamEvent
} from '@anthropic-ai/sdk/resources/messages'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ''
})

function callClaude(
  systemPrompt: string,
  userPrompt?: string,
  args?: Partial<MessageCreateParamsNonStreaming>
): APIPromise<Message>
function callClaude(
  systemPrompt: string,
  userPrompt?: string,
  args?: Partial<MessageCreateParamsStreaming>
): APIPromise<Stream<RawMessageStreamEvent>>
function callClaude(
  systemPrompt: string,
  userPrompt?: string,
  args?:
    | Partial<MessageCreateParamsNonStreaming>
    | Partial<MessageCreateParamsStreaming>
) {
  const messages = []
  if (userPrompt) {
    messages.push({ role: 'user', content: userPrompt })
  }

  return anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    system: systemPrompt,
    max_tokens: 500,
    messages,
    ...args
  })
}

export { callClaude }
