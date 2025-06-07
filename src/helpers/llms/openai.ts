import {
  ChatCompletion,
  ChatCompletionChunk,
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionCreateParamsStreaming
} from 'openai/resources/chat/completions'
import { Stream } from 'openai/core/streaming'
import OpenAI, { APIPromise } from 'openai'
import {
  Response,
  ResponseCreateParamsNonStreaming,
  ResponseCreateParamsStreaming,
  ResponseStreamEvent
} from 'openai/resources/responses/responses'

const apiKey = process.env.OPENAI_API_KEY

const openAIClient = new OpenAI({ apiKey })

function callGPTCompletions(
  systemPrompt: string,
  userPrompt: string,
  args: Partial<ChatCompletionCreateParamsNonStreaming>
): APIPromise<ChatCompletion>
function callGPTCompletions(
  systemPrompt: string,
  userPrompt: string,
  args: Partial<ChatCompletionCreateParamsStreaming>
): APIPromise<Stream<ChatCompletionChunk>>
function callGPTCompletions(
  systemPrompt: string,
  userPrompt: string,
  args: Partial<
    ChatCompletionCreateParamsStreaming | ChatCompletionCreateParamsNonStreaming
  > = {}
) {
  return openAIClient.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    ...args
  })
}

function callGPT(
  systemPrompt: string,
  userPrompt?: string,
  args?: Partial<ResponseCreateParamsNonStreaming>
): APIPromise<Response>
function callGPT(
  systemPrompt: string,
  userPrompt?: string,
  args?: Partial<ResponseCreateParamsStreaming>
): APIPromise<Stream<ResponseStreamEvent>>
function callGPT(
  systemPrompt: string,
  userPrompt?: string,
  args: Partial<
    ResponseCreateParamsNonStreaming | ResponseCreateParamsStreaming
  > = {}
) {
  const input = []
  if (userPrompt) {
    input.push({ role: 'user', content: userPrompt })
  }

  return openAIClient.responses.create({
    model: 'gpt-4.1-nano',
    instructions: systemPrompt,
    input,
    ...args
  })
}

export { callGPTCompletions, callGPT }
