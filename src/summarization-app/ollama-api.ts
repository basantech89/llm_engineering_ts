import 'dotenv/config'

const ollamaUrl = process.env.OLLAMA_API

const runModel = async () => {
  const response = await fetch(ollamaUrl, {
    method: 'POST',
    body: JSON.stringify({
      model: 'llama3.2',
      stream: false,
      messages: [
        {
          role: 'user',
          content:
            'Describe some of the business applications of Generative AI.'
        }
      ]
    })
  })

  const data = await response.json()
  console.log('Response from Ollama:', data.message.content)
}

runModel()
