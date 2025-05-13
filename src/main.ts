import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import studio from '@theatre/studio'
// import { core } from '@theatre/core'

import { getProject, types } from '@theatre/core'


studio.initialize()

const project = getProject('THREE.js x Theatre.js')
const sheet = project.sheet('Animated scene')



/**
 * Camera
 */

const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  10,
  200,
)

camera.position.z = 50
camera.rotation.z = Math.PI / 4 // 45 degrees in radians

/**
 * Camera Controls in Theatre
 */
const cameraObj = sheet.object('Camera', {
  position: types.compound({
    x: types.number(camera.position.x, { range: [-100, 100] }),
    y: types.number(camera.position.y, { range: [-100, 100] }),
    z: types.number(camera.position.z, { range: [-100, 100] }),
  }),
  rotation: types.compound({
    x: types.number(camera.rotation.x, { range: [-Math.PI, Math.PI] }),
    y: types.number(camera.rotation.y, { range: [-Math.PI, Math.PI] }),
    z: types.number(camera.rotation.z, { range: [-Math.PI, Math.PI] }),
  }),
})

cameraObj.onValuesChange((values) => {
  const { x: px, y: py, z: pz } = values.position
  const { x: rx, y: ry, z: rz } = values.rotation

  camera.position.set(px, py, pz)
  camera.rotation.set(rx, ry, rz)
})

/**
 * Scene
 */

const scene = new THREE.Scene()

/*
 * TorusKnot
 */
const geometry = new THREE.TorusKnotGeometry(10, 3, 300, 16)
const material = new THREE.MeshStandardMaterial({color: '#f00'})
material.color = new THREE.Color('#049ef4')
material.roughness = 0.5

const mesh = new THREE.Mesh(geometry, material)
mesh.castShadow = true
mesh.receiveShadow = true

// Create a container group for the mesh
const posContainer = new THREE.Group()
posContainer.add(mesh)
scene.add(posContainer)

const posContainerObj = sheet.object('Position Container', {
  position: types.compound({
    x: types.number(posContainer.position.x, { range: [-50, 50] }),
    y: types.number(posContainer.position.y, { range: [-50, 50] }),
    z: types.number(posContainer.position.z, { range: [-50, 50] }),
  }),
  rotation: types.compound({
    x: types.number(posContainer.rotation.x, { range: [-Math.PI, Math.PI] }),
    y: types.number(posContainer.rotation.y, { range: [-Math.PI, Math.PI] }),
    z: types.number(posContainer.rotation.z, { range: [-Math.PI, Math.PI] }),
  }),
})

posContainerObj.onValuesChange((values) => {
  const { x: px, y: py, z: pz } = values.position
  const { x: rx, y: ry, z: rz } = values.rotation

  posContainer.position.set(px, py, pz)
  posContainer.rotation.set(rx, ry, rz)
})

const torusKnotObj = sheet.object('Torus Knot', {
  // Note that the rotation is in radians
  // (full rotation: 2 * Math.PI)
  rotation: types.compound({
    x: types.number(mesh.rotation.x, { range: [-2, 2] }),
    y: types.number(mesh.rotation.y, { range: [-2, 2] }),
    z: types.number(mesh.rotation.z, { range: [-2, 2] }),
  }),
})

torusKnotObj.onValuesChange((values) => {
  const { x, y, z } = values.rotation

  mesh.rotation.set(x * Math.PI, y * Math.PI, z * Math.PI)
})

/*
 * Lights
 */

// Ambient Light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
scene.add(ambientLight)

// Point light
const directionalLight = new THREE.DirectionalLight('#ff0000', 30 /* , 0, 1 */)
directionalLight.position.y = 20
directionalLight.position.z = 20

directionalLight.castShadow = true

directionalLight.shadow.mapSize.width = 2048
directionalLight.shadow.mapSize.height = 2048
directionalLight.shadow.camera.far = 50
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.top = 20
directionalLight.shadow.camera.right = 20
directionalLight.shadow.camera.bottom = -20
directionalLight.shadow.camera.left = -20

scene.add(directionalLight)

// RectAreaLight
const rectAreaLight = new THREE.RectAreaLight('#ff0', 1, 50, 50)

rectAreaLight.position.z = 10
rectAreaLight.position.y = -40
rectAreaLight.position.x = -20
rectAreaLight.lookAt(new THREE.Vector3(0, 0, 0))

scene.add(rectAreaLight)

/**
 * Renderer
 */

const renderer = new THREE.WebGLRenderer({antialias: true})

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.render(scene, camera)

document.body.appendChild(renderer.domElement)

/**
 * Camera Controls
 */
console.log('camera', camera);
// const controls = new OrbitControls(camera, renderer.domElement)
// console.log('controls', controls);
// controls.enableDamping = true // Adds smooth damping effect
// controls.dampingFactor = 0.05 // Adjust this value to control damping strength
// controls.enablePan = true
// controls.enableZoom = true

/**
 * Update the screen
 */
function tick(): void {
  // controls.update() // Required for damping to work
  renderer.render(scene, camera)

  window.requestAnimationFrame(tick)
}

tick()

/**
 * Handle `resize` events
 */
window.addEventListener(
  'resize',
  function () {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  },
  false,
)
