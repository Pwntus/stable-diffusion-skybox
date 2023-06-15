import Replicate from 'replicate'

const replicate = new Replicate({
  auth: useRuntimeConfig().replicateApiToken
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { ws_key, input } = body

  const prediction = await replicate.predictions.create({
    version: '6ea7b0a2c5df32d6edb58783543dbff9e31fbc90ed6ac6d011b06b1be906ca0e',
    input,
    webhook: `https://r3swiuknhh.execute-api.eu-west-1.amazonaws.com/prod/webhook?key=${ws_key}&type=image`,
    webhook_events_filter: ['start', 'output', 'logs', 'completed']
  })

  return prediction
})
