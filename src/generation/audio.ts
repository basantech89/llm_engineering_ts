import 'dotenv/config'
import { talker } from 'src/helpers/llms'

const generateAudio = async () => {
  const prompt = `Well, hi there`
  await talker(prompt)
}

generateAudio()
