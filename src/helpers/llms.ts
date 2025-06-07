import {
  ChatCompletion,
  ChatCompletionChunk,
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionCreateParamsStreaming
} from 'openai/resources/chat/completions'
import { Stream } from 'openai/core/streaming'
import OpenAI, { APIPromise } from 'openai'
import ollama, {
  AbortableAsyncIterator,
  ChatRequest,
  ChatResponse
} from 'ollama'

const apiKey = process.env.OPENAI_API_KEY

const openAIClient = new OpenAI({ apiKey })

type Arg<D> = Omit<D, 'model' | 'messages'>

function callGPT(
  systemPrompt: string,
  userPrompt: string,
  args: Arg<ChatCompletionCreateParamsNonStreaming>
): APIPromise<ChatCompletion>
function callGPT(
  systemPrompt: string,
  userPrompt: string,
  args: Arg<ChatCompletionCreateParamsStreaming>
): APIPromise<Stream<ChatCompletionChunk>>
function callGPT(
  systemPrompt: string,
  userPrompt: string,
  args: Arg<
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

function callLlama(
  systemPrompt: string,
  userPrompt: string,
  args: Arg<
    ChatRequest & {
      stream: true
    }
  >
): Promise<AbortableAsyncIterator<ChatResponse>>
function callLlama(
  systemPrompt: string,
  userPrompt: string,
  args: Arg<
    ChatRequest & {
      stream?: false
    }
  >
): Promise<ChatResponse>
function callLlama(
  systemPrompt: string,
  userPrompt: string,
  args:
    | Arg<
        ChatRequest & {
          stream: true
        }
      >
    | Arg<
        ChatRequest & {
          stream?: false
        }
      >
) {
  return ollama.chat({
    model: 'llama3.2',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    ...args
  })
}

export { callGPT, callLlama }
