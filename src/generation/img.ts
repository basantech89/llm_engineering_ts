import 'dotenv/config'
import { artist } from 'src/helpers/llms'

const generateImage = async (city: string) => {
  const prompt = `An image representing a vacation in ${city}, showing tourist spots and everything unique about ${city}, in a vibrant pop-art style.`
  await artist(prompt)
}

generateImage('India')
