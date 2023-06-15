<template lang="pug">
main
  #container
  #input
    b(v-if="loading") Loading...
    template(v-else)
      input(
        v-model="prompt"
        type="text"
      )
      button(
        @click="submit"
      ) Submit
</template>

<script>
import * as THREE from 'three'
import { mapActions } from 'pinia'

import useAppStore from '@/stores/app'
import { EventBus } from '@/services'

export default {
  name: 'App',
  data: () => ({
    loading: false,
    prompt: 'a wooden house'
  }),
  methods: {
    ...mapActions(useAppStore, ['init', 'createImage', 'createUpscale']),
    async submit() {
      this.loading = true
      try {
        await this.createImage({
          input: {
            prompt: `photo, ${this.prompt}, qxj <lora:360Diffusion_v1:1>`,
            width: 1024,
            height: 512,
            num_outputs: 1,
            num_inference_steps: 20,
            guidance_scale: 7.5
          }
        })
      } catch (e) {
        console.log(e)
      }
    }
  },
  mounted() {
    this.init()

    // State
    let scene = null
    let camera = null
    let geometry = null
    let material = null
    let mesh = null
    let renderer = null
    let isUserInteracting = false
    let onPointerDownPointerX = 0
    let onPointerDownPointerY = 0
    let lon = 0
    let onPointerDownLon = 0
    let lat = 0
    let onPointerDownLat = 0
    let phi = 0
    let theta = 0

    const container = document.getElementById('container')

    // Init scene, camera and geometry
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      1100
    )

    // Create a mesh based on geometry + material and add it to the scene
    geometry = new THREE.SphereGeometry(500, 60, 40)
    geometry.scale(-1, 1, 1)

    material = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load(
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/2294472375_24a3b8ef46_o.jpg'
      )
    })

    mesh = new THREE.Mesh(geometry, material)

    scene.add(mesh)

    // Init renderer
    renderer = new THREE.WebGLRenderer()
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(renderer.domElement)

    // Create event handlers
    const onDocumentMouseDown = (event) => {
      event.preventDefault()

      isUserInteracting = true

      onPointerDownPointerX = event.clientX
      onPointerDownPointerY = event.clientY

      onPointerDownLon = lon
      onPointerDownLat = lat
    }

    const onDocumentMouseMove = (event) => {
      if (isUserInteracting === true) {
        lon = (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon
        lat = (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat
      }
    }

    const onDocumentMouseUp = (event) => (isUserInteracting = false)

    const onDocumentMouseWheel = (event) => {
      camera.fov += event.deltaY * 0.05
      camera.updateProjectionMatrix()
    }

    const onDocumentDragOver = (event) => {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'copy'
    }

    const onDocumentDragEnter = (event) => (document.body.style.opacity = 0.5)

    const onDocumentDragLeave = (event) => (document.body.style.opacity = 1)

    const onDocumentDrop = (event) => {
      event.preventDefault()

      var reader = new FileReader()
      reader.addEventListener(
        'load',
        function (event) {
          material.map.image.src = event.target.result
          material.map.needsUpdate = true
        },
        false
      )
      reader.readAsDataURL(event.dataTransfer.files[0])

      document.body.style.opacity = 1
    }

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    // Add event listeners
    container.addEventListener('mousedown', onDocumentMouseDown, false)
    container.addEventListener('mousemove', onDocumentMouseMove, false)
    container.addEventListener('mouseup', onDocumentMouseUp, false)
    container.addEventListener('wheel', onDocumentMouseWheel, false)
    container.addEventListener('dragover', onDocumentDragOver, false)
    container.addEventListener('dragenter', onDocumentDragEnter, false)
    container.addEventListener('dragleave', onDocumentDragLeave, false)
    container.addEventListener('drop', onDocumentDrop, false)
    window.addEventListener('resize', onWindowResize, false)

    // Update function (each frame)
    const update = () => {
      if (isUserInteracting === false) lon += 0.1

      lat = Math.max(-85, Math.min(85, lat))
      phi = THREE.MathUtils.degToRad(90 - lat)
      theta = THREE.MathUtils.degToRad(lon)

      const x = 500 * Math.sin(phi) * Math.cos(theta)
      const y = 500 * Math.cos(phi)
      const z = 500 * Math.sin(phi) * Math.sin(theta)
      camera.lookAt(x, y, z)

      renderer.render(scene, camera)
    }

    // Start animation
    const animate = () => {
      requestAnimationFrame(animate)
      update()
    }

    animate()

    //...
    const onImageOutput = async (output) => {
      try {
        await this.createUpscale({
          input: {
            image: output,
            scale: 4
          }
        })
      } catch (e) {
        console.log(e)
      }
    }

    const onUpscaleOutput = (output) => {
      // Pre-load image
      const image = new Image()
      image.src = output
      image.onload = () => {
        material.map.image.src = output
        material.map.needsUpdate = true
        this.loading = false
      }
    }

    // Register websocket event handlers
    EventBus.$on('image:output', onImageOutput)
    EventBus.$on('upscale:output', onUpscaleOutput)
  }
}
</script>

<style lang="stylus" scoped>
main
  #container
    cursor move
    cursor grab
    cursor -moz-grab
    cursor -webkit-grab

    &:active
      cursor grabbing
      cursor -moz-grabbing
      cursor -webkit-grabbing

  #input
    padding 16px
    background rgba(0, 0, 0, .4)
    display flex
    justify-content center
    position absolute
    top 0
    left 0
    right 0
    z-index 100

    input
      padding 12px
      background #ffffff
      border 0
      border-radius 4px 0 0 4px

    button
      padding 12px
      border 0
      border-radius 0 4px 4px 0
      cursor pointer
</style>
