import ollama from 'ollama'
import { Website } from './website'

const systemPrompt =
  'You are an assistant that analyzes the contents of a website \
and provides a short summary, ignoring text that might be navigation related. \
Respond in markdown.'

const runModel = async (url: string) => {
  const website = new Website(url)

  const userPrompt = `You are looking at a website titled ${website.title}.\
  \nThe contents of this website is as follows; \
please provide a short summary of this website in markdown. \
If it includes news or announcements, then summarize these too.\n\n${website.text}`

  const response = await ollama.chat({
    model: 'llama3.2',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]
  })

  console.log(response.message.content)
}

runModel('https://edwarddonner.com')
