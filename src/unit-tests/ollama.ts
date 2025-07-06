import 'dotenv/config'
import { Readable } from 'node:stream'
import { streamResponse } from 'src/helpers/llms/ollama-ai'

const model = 'qwen2.5-coder:14b'

const convertCode = async (code: string) => {
  const systemPrompt = `You are an assistant that write unit test cases for the given code. \
Do not add un-necessary comments. Use modular code structure and follow best practices.`

  const userPrompt = `Write unit tests cases for the following Javascript code using vitest. \n${code}`

  const stream = await streamResponse(systemPrompt, userPrompt, {
    model,
    stream: true
  })

  const readStream = Readable.from(stream)
  const writeStream = process.stdout

  readStream.pipe(writeStream)
}

convertCode(`
const looksLike = (superSet: unknown, subSet: unknown): boolean => {
  if (isPrimitive(superSet) || isPrimitive(subSet)) {
    if (Number.isNaN(superSet) || Number.isNaN(subSet)) {
      return Number.isNaN(superSet) && Number.isNaN(subSet)
    }

    return superSet === subSet
  }

  if (typeof superSet !== typeof subSet) {
    return false
  }

  if (Array.isArray(superSet)) {
    if (!Array.isArray(subSet)) {
      return false
    }

    return subSet.every((item, index) => looksLike(item, superSet[index]))
  }

  if (isObject(superSet) && isObject(subSet)) {
    return getKeys(subSet).every(key => looksLike(superSet[key], subSet[key]))
  }

  if (superSet instanceof Date || subSet instanceof Date) {
    if (!(superSet instanceof Date) || !(subSet instanceof Date)) {
      return false
    }

    return superSet.getTime() === subSet.getTime()
  }

  return false
}
`)
