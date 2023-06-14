import Replicate from 'replicate'

const replicate = new Replicate({
  auth: useRuntimeConfig().replicateApiToken
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { ws_key, input } = body

  const prediction = await replicate.predictions.create({
    version: '499940604f95b416c3939423df5c64a5c95cfd32b464d755dacfe2192a2de7ef',
    input,
    webhook: `https://r3swiuknhh.execute-api.eu-west-1.amazonaws.com/prod/webhook?key=${ws_key}&type=upscale`,
    webhook_events_filter: ['start', 'output', 'logs', 'completed']
  })

  return prediction
})
