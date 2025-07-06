import 'dotenv/config'
import { Readable } from 'node:stream'
import { streamResponse } from 'src/helpers/llms/ollama-ai'

const model = 'qwen2.5-coder:14b'

const convertCode = async (code: string) => {
  const systemPrompt = `You are an assistant that add comments or docstrings. \
Do not add un-necessary comments or docstrings. Explain why, not what, and explain how \
if the code is too complex for a human to understand.\
Add the function purpose, parameters, and return type in the docstring. \
Do not add comments for self explanatory code.`

  const userPrompt = `Add comments or docstrings to the following Python code. \n${code}`

  const stream = await streamResponse(systemPrompt, userPrompt, {
    model,
    stream: true
  })

  const readStream = Readable.from(stream)
  const writeStream = process.stdout

  readStream.pipe(writeStream)
}

convertCode(`
import time

def calculate(iterations, param1, param2):index
    result = 1.0
    for i in range(1, iterations+1):
        j = i * param1 - param2
        result -= (1/j)
        j = i * param1 + param2
        result += (1/j)
    return result

start_time = time.time()
result = calculate(100_000_000, 4, 1) * 4
end_time = time.time()

print(f"Result: {result:.12f}")
print(f"Execution Time: {(end_time - start_time):.6f} seconds")  
`)
