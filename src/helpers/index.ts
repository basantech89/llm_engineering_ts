import { Stream } from 'openai/core/streaming'
import { ResponseStreamEvent } from 'openai/resources/responses/responses'

async function* getReadableStream(
  stream: Stream<ResponseStreamEvent> & {
    _request_id?: string | null
  },
  {
    transform,
    callback
  }: {
    transform?: (chunk: string) => string
    callback?: (chunk: string) => void
  }
) {
  for await (const chunk of stream) {
    if (chunk.type === 'response.output_text.delta') {
      let transformedChunk = chunk.delta
      if (transform) {
        transformedChunk = transform(chunk.delta)
      }

      callback?.(transformedChunk)
      yield transformedChunk
    }
  }
}

export { getReadableStream }
