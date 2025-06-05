import { parse } from 'node-html-parser'
import fetch from 'sync-fetch'

const unwantedTags = ['script', 'style', 'img', 'input']

export class Website {
  private url: string
  title: string
  text: string

  constructor(url: string) {
    this.url = url

    const response = fetch(url).text()
    const doc = parse(response)

    const children = doc.querySelector('body').children
    for (const child of children) {
      if (unwantedTags.includes(child.tagName.toLowerCase())) {
        child.remove()
      }
    }

    this.title = doc.querySelector('title')?.textContent || 'No title found'
    this.text =
      doc.querySelector('body')?.removeWhitespace().structuredText ||
      'No body text found'
  }
}
