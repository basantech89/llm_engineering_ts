import ollama, {
  AbortableAsyncIterator,
  ChatRequest,
  ChatResponse
} from 'ollama'

function callLlama(
  systemPrompt: string,
  userPrompt: string,
  args: Partial<
    ChatRequest & {
      stream: true
    }
  >
): Promise<AbortableAsyncIterator<ChatResponse>>
function callLlama(
  systemPrompt: string,
  userPrompt: string,
  args: Partial<
    ChatRequest & {
      stream?: false
    }
  >
): Promise<ChatResponse>
function callLlama(
  systemPrompt: string,
  userPrompt: string,
  args:
    | Partial<
        ChatRequest & {
          stream: true
        }
      >
    | Partial<
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

export { callLlama }
