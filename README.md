# Stable DIffusion Skybox

Create a skybox (equirectangular image) using Stable Diffusion and pan around it in 3D.

## How it works

This app is powered by:

🚀 [Replicate](https://replicate.com/?utm_source=project&utm_campaign=skybox), a platform for running machine learning models in the cloud.

🖍️ [Stable Diffusion](https://replicate.com/stability-ai/stable-diffusion/?utm_source=project&utm_campaign=skybox), an open-source machine learning model that generates images from text.

▲ [Vercel](https://vercel.com/), a platform for running web apps.

⚡️ Nuxt.js [server-side API routes](server/api), for talking to Replicate's API.

👀 [Three.js](https://threejs.org/), for creating a 3D scene.

## Development

1. Install a recent version of [Node.js](https://nodejs.org/)
1. Copy your [Replicate API token](https://replicate.com/account?utm_source=project&utm_campaign=skybox) and set it in your environment:
   ```
   echo "REPLICATE_API_TOKEN=<your-token-here>" > .env.local
   ```
1. Install dependencies and run the server:
   ```
   npm install
   npm run dev
   ```
1. Open [localhost:3000](http://localhost:3000) in your browser. That's it!
