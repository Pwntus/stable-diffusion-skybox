<template lang="pug">
main
  #container
</template>

<script>
import * as THREE from 'three'
import { mapActions } from 'pinia'

import useAppStore from '@/stores/app'

export default {
  name: 'App',
  methods: mapActions(useAppStore, ['init']),
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
    let onMouseDownLon = 0
    let onPointerDownLon = 0
    let lat = 0
    let onMouseDownLat = 0
    let onPointerDownLat = 0
    let phi = 0
    let theta = 0

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
    document.getElementById('container').appendChild(renderer.domElement)

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
    document.addEventListener('mousedown', onDocumentMouseDown, false)
    document.addEventListener('mousemove', onDocumentMouseMove, false)
    document.addEventListener('mouseup', onDocumentMouseUp, false)
    document.addEventListener('wheel', onDocumentMouseWheel, false)
    document.addEventListener('dragover', onDocumentDragOver, false)
    document.addEventListener('dragenter', onDocumentDragEnter, false)
    document.addEventListener('dragleave', onDocumentDragLeave, false)
    document.addEventListener('drop', onDocumentDrop, false)
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
  }
}
</script>
