// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: {
    enabled: false
  },
  runtimeConfig: {
    replicateApiToken: process.env.REPLICATE_API_TOKEN || ''
  },
  nitro: {
    preset: 'vercel-edge'
  },
  modules: ['@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'Stable Diffusion Skybox',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Create a skybox (equirectangular image) using Stable Diffusion and pan around it in 3D.'
        },
        {
          property: 'og:title',
          content: 'Stable Diffusion Skybox'
        },
        {
          property: 'og:description',
          content:
            'Create a skybox (equirectangular image) using Stable Diffusion and pan around it in 3D.'
        },
        {
          property: 'og:url',
          content: ''
        },
        {
          property: 'og:image',
          content: '/cover.jpeg'
        },
        {
          property: 'twitter:image',
          content: '/cover.jpeg'
        },
        {
          property: 'twitter:card',
          content: 'summary_large_image'
        },
        {
          property: 'twitter:title',
          content: 'Stable Diffusion Skybox'
        },
        {
          property: 'twitter:description',
          content:
            'Create a skybox (equirectangular image) using Stable Diffusion and pan around it in 3D.'
        }
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico',
          sizes: 'any'
        },
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon.svg'
        }
      ]
    }
  }
})
