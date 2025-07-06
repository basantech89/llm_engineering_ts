import 'dotenv/config'
import { Readable, Transform } from 'node:stream'
import fs from 'fs'
import { streamResponse } from 'src/helpers/llms/ollama-ai'

const model = 'codeqwen:7b'

const convertCode = async (code: string) => {
  const systemPrompt = `You are an assistant that reimplements Python code in high performance C++ for an Linux system. \
Respond only with C++ code; use comments sparingly and do not provide any explanation other than occasional comments. \
The C++ response needs to produce an identical output in the fastest possible time. \
Do not add any notes, comments or explanations.`

  const userPrompt = `Rewrite this Python code in C++ with the fastest possible implementation that produces identical output in the least time. \
Respond only with C++ code; do not explain your work other than a few comments. \
Pay attention to number types to ensure no int overflows. Remember to #include all necessary C++ packages such as iomanip.\n\n${code}`

  const stream = await streamResponse(systemPrompt, userPrompt, {
    model,
    stream: true
  })

  const readStream = Readable.from(stream)
  const writeStream = fs.createWriteStream(`pi-${model}-optimized.cpp`)

  const removeUnwantedChars = new Transform({
    transform(chunk, encoding, callback) {
      this.push(chunk.toString().replace('cpp', '').replace('```', ''))
      callback()
    }
  })

  removeUnwantedChars.on('data', chunk => process.stdout.write(chunk))

  readStream.pipe(removeUnwantedChars).pipe(writeStream)
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
