import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'


const matcapTexture = new THREE.TextureLoader().load('/textures/matcaps/9.png')
matcapTexture.colorSpace = THREE.SRGBColorSpace

const fontLoader = new FontLoader()

// Scene
const scene = new THREE.Scene()

fontLoader.load('/fonts/arcade_regular.typeface.json', (fontRegular) => {
    // Create geometry for "Pixel"
    const textGeometryPixel = new TextGeometry('Pixel', {
        font: fontRegular,
        size: 0.5,
        depth: 0.05,
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0.003,
        bevelSize: 0.003,
        bevelOffset: 0,
        bevelSegments: 2,
    })
    textGeometryPixel.center()

    // Create geometry for "Pirates"
    const textGeometryPirates = new TextGeometry('Pirates', {
        font: fontRegular,
        size: 0.5,
        depth: 0.05,
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0.003,
        bevelSize: 0.003,
        bevelOffset: 0,
        bevelSegments: 2,
    })
    textGeometryPirates.center()

    // Create materials
    const material = new THREE.MeshMatcapMaterial({
        matcap: matcapTexture,
    })

    // Create meshes
    const textPixel = new THREE.Mesh(textGeometryPixel, material)
    const textPirates = new THREE.Mesh(textGeometryPirates, material)

    // Position "Pirates" below "Pixel"
    textPirates.position.y = -0.2
    textPixel.position.y = 0.2

    // Add to scene
    scene.add(textPixel)
    scene.add(textPirates)
})

const dotGeometry = new THREE.SphereGeometry(.05, 16, 16)
const dotMaterial = new THREE.PointsMaterial({
    color: '#f0be8d',
})

for (let i = 0; i < 1000; i++) {
    const dot = new THREE.Mesh(dotGeometry, dotMaterial)
    dot.position.x = (Math.random() - 0.5) * 100
    dot.position.y = (Math.random() - 0.5) * 100
    dot.position.z = (Math.random() - 0.5) * 100

    dot.rotation.x = Math.random() * Math.PI
    dot.rotation.y = Math.random() * Math.PI

    const scale = Math.random()
    dot.scale.set(scale, scale, scale)

    scene.add(dot)
}

// Debug
// const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Textures
const textureLoader = new THREE.TextureLoader()

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Camera
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = .5
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()