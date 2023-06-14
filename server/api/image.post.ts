import Replicate from 'replicate'

const replicate = new Replicate({
  auth: useRuntimeConfig().replicateApiToken
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { ws_key, input } = body

  const prediction = await replicate.predictions.create({
    version: 'a42692c54c0f407f803a0a8a9066160976baedb77c91171a01730f9b0d7beeff',
    input,
    webhook: `https://r3swiuknhh.execute-api.eu-west-1.amazonaws.com/prod/webhook?key=${ws_key}&type=image`,
    webhook_events_filter: ['start', 'output', 'logs', 'completed']
  })

  return prediction
})
