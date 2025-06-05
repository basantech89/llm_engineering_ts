import 'dotenv/config'
import OpenAI from 'openai'
import { Website } from './website'

const apiKey = process.env.OPENAI_API_KEY

const client = new OpenAI({ apiKey })

const systemPrompt =
  'You are an assistant that analyzes the contents of a website \
and provides a short summary, ignoring text that might be navigation related. \
Respond in markdown.'

export async function runModel(url: string) {
  const website = new Website(url)

  const userPrompt = `You are looking at a website titled ${website.title}.\
  \nThe contents of this website is as follows; \
please provide a short summary of this website in markdown. \
If it includes news or announcements, then summarize these too.\n\n${website.text}`

  console.log('System Prompt:', systemPrompt)

  console.log('User Prompt:', userPrompt)

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]
  })

  console.log('Response from OpenAI:', response.choices[0].message)
}

runModel('https://edwarddonner.com')
