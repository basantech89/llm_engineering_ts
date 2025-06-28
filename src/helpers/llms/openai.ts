import {
  ChatCompletion,
  ChatCompletionChunk,
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionCreateParamsStreaming
} from 'openai/resources/chat/completions'
import { Stream } from 'openai/core/streaming'
import OpenAI, { APIPromise } from 'openai'
import fs from 'fs'
import {
  Response,
  ResponseCreateParamsNonStreaming,
  ResponseCreateParamsStreaming,
  ResponseStreamEvent
} from 'openai/resources/responses/responses'
import { Buffer } from 'buffer'
import path from 'path'

const apiKey = process.env.OPENAI_API_KEY

const openai = new OpenAI({ apiKey })

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
  return openai.chat.completions.create({
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

  return openai.responses.create({
    model: 'gpt-4.1-nano',
    instructions: systemPrompt,
    input,
    ...args
  })
}

async function artist(prompt: string) {
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt,
    n: 1,
    size: '1024x1024',
    response_format: 'b64_json'
  })

  const base64 = response.data[0].b64_json
  const bytes = Buffer.from(base64, 'base64')
  fs.writeFileSync(`image-${new Date().getTime()}.png`, bytes)
}

async function talker(message: string) {
  const mp3 = await openai.audio.speech.create({
    model: 'tts-1',
    voice: 'coral',
    input: message,
    instructions: `Affect: a mysterious noir detective\n\nTone: Cool, detached, but subtly reassuring—like they've seen it all and know how to handle a missing package like it's just another case.\n\nDelivery: Slow and deliberate, with dramatic pauses to build suspense, as if every detail matters in this investigation.\n\nEmotion: A mix of world-weariness and quiet determination, with just a hint of dry humor to keep things from getting too grim.\n\nPunctuation: Short, punchy sentences with ellipses and dashes to create rhythm and tension, mimicking the inner monologue of a detective piecing together clues.`
  })

  const arrayBuffer = await mp3.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const speechFile = path.resolve('./speech.mp3')
  await fs.promises.writeFile(speechFile, buffer)
}

export { callGPTCompletions, callGPT, artist, talker }
