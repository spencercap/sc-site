import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import studio from '@theatre/studio'
import { getProject, types } from '@theatre/core'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'

import theatreState from '../public/assets/theatre-state.json';
// import theatreState from './assets/theatre-state.json';
// const res = fetch('../public/assets/theatre-state.json.json')
// console.log('res', res);

// Initialize Theatre.js
studio.initialize()
// const project = getProject('THREE.js x Theatre.js')
const project = getProject('THREE.js x Theatre.js', { state: theatreState })
const sheet = project.sheet('Animated scene')


// Scroll and animation state
let scrollOffset = 0
let sequencePosition = 0
const SEQUENCE_LENGTH = 3 // 3 second timeline
let snapMode: 'proximity' | 'mandatory' = 'mandatory'
let isSyncEnabled = true

// Get DOM elements
const scrollContent = document.getElementById('scroll-content') as HTMLElement
const statusElement = document.getElementById('status') as HTMLElement
const snapToggle = document.getElementById('snap-toggle') as HTMLButtonElement
const syncToggle = document.getElementById('sync-toggle') as HTMLButtonElement
const animatedBox = document.getElementById('animated-box') as HTMLElement

// Setup scroll snap
scrollContent.style.scrollSnapType = `y ${snapMode}`

// Create Theatre.js object for the animated box
const boxObj = sheet.object('Animated Box', {
  x: types.number(0, { range: [0, window.innerWidth - 100] }),
  y: types.number(80, { range: [0, window.innerHeight - 100] }),
})

// Subscribe to box position changes
boxObj.onValuesChange((values) => {
  animatedBox.style.transform = `translate(${values.x}px, ${values.y}px)`
})

// Handle scroll events
function onScroll() {
  scrollOffset = scrollContent.scrollTop / (scrollContent.scrollHeight - scrollContent.clientHeight)
  statusElement.textContent = `Scroll: ${scrollOffset.toFixed(2)}, Sequence: ${sequencePosition.toFixed(2)}`
}

// Toggle snap mode
function toggleSnapMode() {
  snapMode = snapMode === 'proximity' ? 'mandatory' : 'proximity'
  scrollContent.style.scrollSnapType = `y ${snapMode}`
  snapToggle.textContent = `Snap Mode: ${snapMode}`
}

// Toggle sequence sync
function toggleSync() {
  isSyncEnabled = !isSyncEnabled
  syncToggle.textContent = `Sync: ${isSyncEnabled ? 'ON' : 'OFF'}`
  syncToggle.style.backgroundColor = isSyncEnabled ? '#333' : '#833'
  
  // If sync is disabled, we can optionally:
  // 1. Keep the sequence at its current position
  // 2. Reset to start
  // 3. Let it be controlled by Theatre.js studio directly
  
  if (!isSyncEnabled) {
    // Option to reset to start when disabling sync
    // sheet.sequence.position = 0
  }
}

// Update Theatre.js sequence position based on scroll
function updateSequence() {
  if (isSyncEnabled) {
    sequencePosition = scrollOffset * SEQUENCE_LENGTH
    sheet.sequence.position = sequencePosition
  }
  requestAnimationFrame(updateSequence)
}

// Event listeners
scrollContent.addEventListener('scroll', onScroll)
snapToggle.addEventListener('click', toggleSnapMode)
syncToggle.addEventListener('click', toggleSync)

// Start the animation loop
updateSequence()

// Store mesh pairs for wireframe toggle
const meshPairs: { original: THREE.Mesh, wireframe: THREE.Mesh }[] = []
let isWireframe = true

/**
 * Scene
 */
const scene = new THREE.Scene()
scene.background = new THREE.Color( 0x787878 );
// scene.background = new THREE.Color( 0xc9c9c9 );
// scene.fog = new THREE.Fog( 0xa0a0a0, 10, 500 );

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,  // Near plane - reduced to allow closer viewing
  1000  // Far plane - increased significantly to prevent disappearing
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
console.log('cameraObj', cameraObj);


/*
 * Static Objects
 */
// Floor
const floorGeometry = new THREE.PlaneGeometry(100, 100)
const floorMaterial = new THREE.MeshStandardMaterial({ 
  color: '#666666',
  roughness: 0.7,
  metalness: 0.1
})
const floor = new THREE.Mesh(floorGeometry, floorMaterial)
floor.rotation.x = -Math.PI / 2 // Rotate to be horizontal
floor.position.y = 0
floor.receiveShadow = true // Floor only receives shadows
scene.add(floor)

// Cube
const cubeGeometry = new THREE.BoxGeometry(10, 10, 10)
const cubeMaterial = new THREE.MeshStandardMaterial({ 
  color: '#ff6b6b',
  roughness: 0.5,
  metalness: 0.1
})
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
cube.position.set(-20, 10, -20)
cube.castShadow = true
cube.receiveShadow = true
scene.add(cube)

// Cone
const coneGeometry = new THREE.ConeGeometry(5, 15, 32)
const coneMaterial = new THREE.MeshStandardMaterial({ 
  color: '#4ecdc4',
  roughness: 0.3,
  metalness: 0.2
})
const cone = new THREE.Mesh(coneGeometry, coneMaterial)
cone.position.set(20, 8, -15)
cone.castShadow = true
cone.receiveShadow = true
scene.add(cone)

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
posContainer.position.set(0, 15, -30)
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

/**
 * Lights
 */

// Ambient Light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.75)
// scene.add(ambientLight)

// // Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0)
directionalLight.position.set(14, 40, 14) // Adjust position for better shadow angle
directionalLight.castShadow = true

// Configure shadow properties for better quality
directionalLight.shadow.mapSize.width = 4096  // Reduced size will give softer shadows
directionalLight.shadow.mapSize.height = 4096
directionalLight.shadow.camera.far = 100
directionalLight.shadow.camera.near = 1  // Increased near plane for softer shadows
directionalLight.shadow.camera.top = 40
directionalLight.shadow.camera.right = 40
directionalLight.shadow.camera.bottom = -40
directionalLight.shadow.camera.left = -40

// Shadow settings
directionalLight.shadow.bias = -0.001
directionalLight.shadow.normalBias = 0.1
directionalLight.shadow.blurSamples = 8  // VSM specific: number of blur samples

scene.add(directionalLight)

// Directional Light Helpers
const directionalHelper = new THREE.DirectionalLightHelper(directionalLight, 5)
scene.add(directionalHelper)
const directionaCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(directionaCameraHelper)



// spot light 
// const spotLight1 = new THREE.SpotLight( 0xFFFFFF, 10 );
// spotLight1.castShadow = true;
// spotLight1.angle = 0.3;
// spotLight1.penumbra = 0.2;
// spotLight1.decay = 2;
// spotLight1.distance = 80;
// spotLight1.position.set( 1.5, 50, 0.5 );
// scene.add(spotLight1)

// const lightHelper1 = new THREE.SpotLightHelper( spotLight1 );
// scene.add(lightHelper1)


// RectArea Light (note: cannot cast shadows)
const rectAreaLight = new THREE.RectAreaLight('#ff0', 10, 50, 50)
rectAreaLight.position.set(-20, 40, 10)
rectAreaLight.lookAt(new THREE.Vector3(0, 0, 0))
// scene.add(rectAreaLight)

// RectArea Light Helper
const rectAreaHelper = new RectAreaLightHelper(rectAreaLight)
// scene.add(rectAreaHelper)

// Add Theatre.js controls for lights
const lightsObj = sheet.object('Lights', {
  directional: types.compound({
    position: types.compound({
      x: types.number(directionalLight.position.x, { range: [-50, 50] }),
      y: types.number(directionalLight.position.y, { range: [-50, 50] }),
      z: types.number(directionalLight.position.z, { range: [-50, 50] }),
    }),
    intensity: types.number(directionalLight.intensity, { range: [0, 10] }),
  }),
  rectArea: types.compound({
    position: types.compound({
      x: types.number(rectAreaLight.position.x, { range: [-50, 50] }),
      y: types.number(rectAreaLight.position.y, { range: [-50, 50] }),
      z: types.number(rectAreaLight.position.z, { range: [-50, 50] }),
    }),
    intensity: types.number(rectAreaLight.intensity, { range: [0, 10] }),
  }),
})

// Update lights based on Theatre.js controls
lightsObj.onValuesChange((values) => {
  // Update Directional Light
  const { x: dx, y: dy, z: dz } = values.directional.position
  directionalLight.position.set(dx, dy, dz)
  directionalLight.intensity = values.directional.intensity
  directionalHelper.update()

  // Update RectArea Light
  const { x: rx, y: ry, z: rz } = values.rectArea.position
  rectAreaLight.position.set(rx, ry, rz)
  rectAreaLight.intensity = values.rectArea.intensity
  // rectAreaLight.lookAt(new THREE.Vector3(0, 0, 0))
  rectAreaHelper.position.copy(rectAreaLight.position)
})

// Add axes helpers to visualize world space
const axesHelper = new THREE.AxesHelper(100)
scene.add(axesHelper)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: "high-performance"
})

// Configure shadow mapping
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.shadowMap.needsUpdate = true

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.render(scene, camera)

document.body.appendChild(renderer.domElement)


/**
 * Camera Controls
 */
console.log('camera', camera);
const controls = new OrbitControls(camera, renderer.domElement)
console.log('controls', controls);
controls.enableDamping = true // Adds smooth damping effect
controls.dampingFactor = 0.02 // Adjust this value to control damping strength
controls.enablePan = true
controls.enableZoom = true

// Extract the change handler to a named function for adding/removing
// let isUpdatingFromControls = false
// function onControlsChange() {
//   if (isUpdatingFromTheatre) return
//   isUpdatingFromControls = true
  
//   // Get current camera state
//   const position = camera.position
//   const euler = new THREE.Euler().setFromQuaternion(camera.quaternion, 'XYZ')
//   // console.log('position', position);
//   console.log('euler', euler);
  
//   studio.transaction(({set}) => {
//     set(cameraObj.props.position, {
//       x: position.x,
//       y: position.y,
//       z: position.z,
//     });
  
//     set(cameraObj.props.rotation, {
//       x: euler.x,
//       y: euler.y,
//       z: euler.z,
//     });
//   })
  
//   isUpdatingFromControls = false
// }

// Add change event listener to OrbitControls with throttling
// let throttleTimeout: any;
// controls.addEventListener('change', () => {
//   if (throttleTimeout) return
//   throttleTimeout = setTimeout(() => {
//     onControlsChange()
//     throttleTimeout = null
//   }, 100) // Throttle to 100ms
// })

// Modify the existing Theatre.js camera object to handle both directions of sync
let isUpdatingFromTheatre = false
cameraObj.onValuesChange((values) => {
  // if (isUpdatingFromControls) return
  
  const { x: px, y: py, z: pz } = values.position
  const { x: rx, y: ry, z: rz } = values.rotation

  // Set flag to prevent feedback loops
  isUpdatingFromTheatre = true
  
  // Update camera position and rotation
  camera.position.set(px, py, pz)
  camera.rotation.set(rx, ry, rz)
  
  // Update OrbitControls target if needed
  controls.update()
  
  // Reset flag
  isUpdatingFromTheatre = false
})




/**
 * Transform Controls Setup
 */
const transformControls = new TransformControls(camera, renderer.domElement)
transformControls.attach(directionalLight)
transformControls.addEventListener('dragging-changed', (event) => {
  // Disable orbit controls while using transform controls
  controls.enabled = !event.value
  
  // Update Theatre.js values when transform controls are used
  if (!event.value) {
    sheet.sequence.position = 0
    // lightsObj.props.directional.position({
    //   x: directionalLight.position.x,
    //   y: directionalLight.position.y,
    //   z: directionalLight.position.z
    // })
  }
})
scene.add(transformControls)

// Set initial mode to 'translate'
transformControls.setMode('translate')

// ViewMode state management
interface TransformableObject {
  object: THREE.Object3D
  name: string
  helper?: THREE.Object3D
}

const viewModeState = {
  transformableObjects: [
    { 
      object: directionalLight,
      name: 'Directional Light',
      helper: directionalHelper
    },
    // { 
    //   object: spotLight1,
    //   name: 'Spot Light 1',
    //   helper: lightHelper1
    // },
    {
      object: posContainer,
      name: 'Position Container'
    },
    {
      object: floor,
      name: 'Floor'
    },
    {
      object: cube,
      name: 'Cube'
    },
    {
      object: cone,
      name: 'Cone'
    }
  ] as TransformableObject[],
  currentIndex: 0,
  
  cycleNext() {
    this.currentIndex = (this.currentIndex + 1) % this.transformableObjects.length
    this.updateTransformControls()
  },

  cyclePrevious() {
    this.currentIndex = (this.currentIndex - 1 + this.transformableObjects.length) % this.transformableObjects.length
    this.updateTransformControls()
  },

  updateTransformControls() {
    const current = this.transformableObjects[this.currentIndex]
    transformControls.attach(current.object)
    
    // Toggle visibility of all helpers
    this.transformableObjects.forEach(obj => {
      if (obj.helper) {
        obj.helper.visible = obj === current
      }
    })
    
    console.log(`Now controlling: ${current.name} (${transformControls.getMode()})`)
  }
}

// Add keyboard controls for transform modes
window.addEventListener('keydown', (event) => {
  switch (event.key.toLowerCase()) {
    case 'w':
      transformControls.setMode('translate')
      break
    case 'r':
      transformControls.setMode('rotate')
      break
    case 'e':
      transformControls.setMode('scale')
      break
    case 'z':
      viewModeState.cycleNext()
      break
    case 'x':
      viewModeState.cyclePrevious()
      break
  }
  // Update console after any transform-related key press
  const current = viewModeState.transformableObjects[viewModeState.currentIndex]
  console.log(`Now controlling: ${current.name} (${transformControls.getMode()})`)
})

// Initially attach to the first object
viewModeState.updateTransformControls()

/**
 * Animation loop
 */
function tick(): void {
  // Update helpers
  directionalHelper.update()
  
  // Update camera
  camera.lookAt(posContainer.position)
  
  // Render
  renderer.render(scene, camera)
  
  // Request next frame
  window.requestAnimationFrame(tick)
}

// Start animation loop
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

/**
 * Load GLTF Model
 */
function loadModel(url: string) {
  const loader = new GLTFLoader()
  
  loader.load(url, (gltf) => {
    const model = gltf.scene
    
    // Create a container for the model
    const modelContainer = new THREE.Group()
    scene.add(modelContainer)
    
    // Process all meshes in the model
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Enable shadows
        child.castShadow = true
        child.receiveShadow = true

        // Ensure material is set up for lighting
        if (child.material) {
          const material = child.material as THREE.Material
          material.needsUpdate = true
          
          // If it's a MeshStandardMaterial, configure its properties
          if (material instanceof THREE.MeshStandardMaterial) {
            material.roughness = 0.7
            material.metalness = 0.2
          } else {
            // If it's not already a MeshStandardMaterial, create one
            const newMaterial = new THREE.MeshStandardMaterial({
              color: (material instanceof THREE.MeshBasicMaterial) ? material.color : 0x808080,
              roughness: 0.7,
              metalness: 0.2
            })
            child.material = newMaterial
          }
        }

        // Store the original mesh
        const originalMesh = child.clone()
        originalMesh.visible = !isWireframe
        modelContainer.add(originalMesh)  // Add to container instead of scene
        
        // Create wireframe mesh using a clone of the original material
        const wireframeMaterial = child.material.clone()
        wireframeMaterial.wireframe = true
        wireframeMaterial.wireframeLinewidth = 1
        
        // Ensure material properties are properly set for wireframe
        wireframeMaterial.needsUpdate = true
        wireframeMaterial.transparent = false
        wireframeMaterial.depthWrite = true
        wireframeMaterial.depthTest = true

        // Create wireframe mesh
        const wireframe = new THREE.Mesh(child.geometry, wireframeMaterial)
        wireframe.visible = isWireframe
        wireframe.castShadow = true
        wireframe.receiveShadow = true
        
        // Copy the transformation from the original mesh
        wireframe.position.copy(child.position)
        wireframe.rotation.copy(child.rotation)
        wireframe.scale.copy(child.scale)
        
        // Add wireframe to the container
        modelContainer.add(wireframe)

        // Store the pair of meshes
        meshPairs.push({
          original: originalMesh,
          wireframe: wireframe
        })
      }
    })

    // Center and scale the model
    const box = new THREE.Box3().setFromObject(modelContainer)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    
    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = 2 / maxDim
    
    // Apply centering and scaling to the container
    modelContainer.position.set(0, 0, 0)  // Place at center
    modelContainer.scale.multiplyScalar(scale)

    // Add the model container to transformable objects
    viewModeState.transformableObjects.push({
      object: modelContainer,
      name: 'GLTF Model'
    })

    // Add model controls to Theatre.js
    const modelObj = sheet.object('GLTF Model', {
      position: types.compound({
        x: types.number(0, { range: [-50, 50] }),
        y: types.number(0, { range: [-50, 50] }),
        z: types.number(0, { range: [-50, 50] }),
      }),
      rotation: types.compound({
        x: types.number(0, { range: [-Math.PI, Math.PI] }),
        y: types.number(0, { range: [-Math.PI, Math.PI] }),
        z: types.number(0, { range: [-Math.PI, Math.PI] }),
      }),
      scale: types.compound({
        x: types.number(scale, { range: [0.1, 10] }),
        y: types.number(scale, { range: [0.1, 10] }),
        z: types.number(scale, { range: [0.1, 10] }),
      }),
    })

    modelObj.onValuesChange((values) => {
      // Update the container instead of individual meshes
      modelContainer.position.set(values.position.x, values.position.y, values.position.z)
      modelContainer.rotation.set(values.rotation.x, values.rotation.y, values.rotation.z)
      modelContainer.scale.set(values.scale.x, values.scale.y, values.scale.z)
    })
    
  }, undefined, (error) => {
    console.error('An error occurred loading the model:', error)
  })
}

/**
 * Toggle Wireframe
 */
function toggleWireframe() {
  isWireframe = !isWireframe
  meshPairs.forEach(pair => {
    pair.original.visible = !isWireframe
    pair.wireframe.visible = isWireframe
  })
}

// Add keyboard event listener for spacebar to toggle wireframe
window.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    toggleWireframe()
  }
})

// Load a model (replace with your model path)
loadModel('../public/assets/sc-scan.gltf')
