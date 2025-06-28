import 'dotenv/config'
import fs from 'fs'
import { Readable, Transform } from 'node:stream'
import { ResponsesModel } from 'openai/resources/shared'
import { streamResponse } from 'src/helpers/llms/openai-ai'

const model: ResponsesModel = 'gpt-4.1-nano'

const convertCode = async (code: string) => {
  const systemPrompt = `You are an assistant that reimplements Python code in high performance C++ for an Linux system. \
Respond only with C++ code; use comments sparingly and do not provide any explanation other than occasional comments. \
The C++ response needs to produce an identical output in the fastest possible time. \
Do not add any notes, comments or explanations.`

  const userPrompt = `Rewrite this Python code in C++ with the fastest possible implementation that produces identical output in the least time. \
Respond only with C++ code; do not explain your work other than a few comments. \
Pay attention to number types to ensure no int overflows. Remember to #include all necessary C++ packages such as iomanip.\n\n${code}`

  const stream = await streamResponse(systemPrompt, userPrompt, { model })

  const readStream = Readable.from(stream)
  const writeStream = fs.createWriteStream(`hard-${model}-optimized.cpp`)

  const removeUnwantedChars = new Transform({
    transform(chunk, encoding, callback) {
      this.push(chunk.toString().replace('cpp', '').replace('```', ''))
      callback()
    }
  })

  removeUnwantedChars.on('data', chunk => process.stdout.write(chunk))

  readStream.pipe(removeUnwantedChars).pipe(writeStream)
}

// convertCode(`
// import time

// def calculate(iterations, param1, param2):index
//     result = 1.0
//     for i in range(1, iterations+1):
//         j = i * param1 - param2
//         result -= (1/j)
//         j = i * param1 + param2
//         result += (1/j)
//     return result

// start_time = time.time()
// result = calculate(100_000_000, 4, 1) * 4
// end_time = time.time()

// print(f"Result: {result:.12f}")
// print(f"Execution Time: {(end_time - start_time):.6f} seconds")
// `)

convertCode(`
# Be careful to support large number sizes

def lcg(seed, a=1664525, c=1013904223, m=2**32):
    value = seed
    while True:
        value = (a * value + c) % m
        yield value
        
def max_subarray_sum(n, seed, min_val, max_val):
    lcg_gen = lcg(seed)
    random_numbers = [next(lcg_gen) % (max_val - min_val + 1) + min_val for _ in range(n)]
    max_sum = float('-inf')
    for i in range(n):
        current_sum = 0
        for j in range(i, n):
            current_sum += random_numbers[j]
            if current_sum > max_sum:
                max_sum = current_sum
    return max_sum

def total_max_subarray_sum(n, initial_seed, min_val, max_val):
    total_sum = 0
    lcg_gen = lcg(initial_seed)
    for _ in range(20):
        seed = next(lcg_gen)
        total_sum += max_subarray_sum(n, seed, min_val, max_val)
    return total_sum

# Parameters
n = 10000         # Number of random numbers
initial_seed = 42 # Initial seed for the LCG
min_val = -10     # Minimum value of random numbers
max_val = 10      # Maximum value of random numbers

# Timing the function
import time
start_time = time.time()
result = total_max_subarray_sum(n, initial_seed, min_val, max_val)
end_time = time.time()

print("Total Maximum Subarray Sum (20 runs):", result)
print("Execution Time: {:.6f} seconds".format(end_time - start_time))  
`)
