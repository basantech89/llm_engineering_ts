import 'dotenv/config'
import OpenAI, { APIPromise } from 'openai'
import { Website } from './website'
import {
  ChatCompletion,
  ChatCompletionChunk,
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionCreateParamsStreaming
} from 'openai/resources/chat/completions'
import { Stream } from 'openai/core/streaming'
import mdToPdf from 'md-to-pdf'

const apiKey = process.env.OPENAI_API_KEY

const client = new OpenAI({ apiKey })

type Arg<D> = Omit<D, 'model' | 'messages'>

function callGPT(
  systemPrompt: string,
  userPrompt: string,
  args: Arg<ChatCompletionCreateParamsNonStreaming>
): APIPromise<ChatCompletion>
function callGPT(
  systemPrompt: string,
  userPrompt: string,
  args: Arg<ChatCompletionCreateParamsStreaming>
): APIPromise<Stream<ChatCompletionChunk>>
function callGPT(
  systemPrompt: string,
  userPrompt: string,
  args: Arg<
    ChatCompletionCreateParamsStreaming | ChatCompletionCreateParamsNonStreaming
  >
) {
  return client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    ...args
  })
}

export async function getLinks(
  website: Website
): Promise<{ type: string; url: string }[]> {
  const systemPrompt = `You are provided with a list of links found on a webpage. \
You are able to decide which of the links would be most relevant to include in a brochure about the company, \
such as links to an About page, or a Company page, or Careers/Jobs pages.
You should respond in JSON as in this example:
{
    "links": [
        {"type": "about page", "url": "https://full.url/goes/here/about"},
        {"type": "careers page": "url": "https://another.full.url/careers"}
    ]
}`

  const userPrompt = `Here is the list of links on the website of ${
    website.url
  } - \
please decide which of these are relevant web links for a brochure about the company, \
respond with the full https URL in JSON format. Do not include Terms of Service, Privacy, email links.
Links (some might be relative links):
${website.links.join('\n')}`

  const response = await callGPT(systemPrompt, userPrompt, {
    response_format: {
      type: 'json_object'
    }
  })

  const data = JSON.parse(response.choices[0].message.content)
  return data.links
}

const makeBrochure = async (companyName: string, url: string) => {
  const website = new Website(url)
  const links = await getLinks(website)

  let result = `Landing Page:\n${website.getContents()}`
  for (const link of links) {
    result = `${result}\n\n${link.type}\n`
    const linkWebsite = new Website(link.url)
    result = `${result}${linkWebsite.getContents()}`
  }

  const systemPrompt = `You are an assistant that analyzes the contents of several relevant pages from a company website \
  and creates a short humorous, entertaining, jokey brochure about the company for prospective customers, investors and recruits. Respond in markdown.\
  Include details of company culture, customers and careers/jobs if you have the information.`

  const userPrompt = `You are looking at a company called: ${companyName}
  Here are the contents of its landing page and other relevant pages; use this information to build a short brochure of the company in markdown.
  ${result}`

  const stream = await callGPT(systemPrompt, userPrompt, { stream: true })

  let markdown = ''
  for await (const chunk of stream) {
    const data = chunk.choices[0].delta.content || ''
    markdown += data
  }

  await mdToPdf(
    { content: markdown },
    { dest: `${companyName}-${new Date().getTime()}.pdf` }
  )
}

makeBrochure('HuggingFace', 'https://huggingface.co')
