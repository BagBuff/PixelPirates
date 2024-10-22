import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { Sky } from 'three/addons/objects/Sky.js';

const tMatcap = new THREE.TextureLoader().load('/textures/matcaps/matcap.png')
const tStar = new THREE.TextureLoader().load('/textures/matcaps/star.png')
tMatcap.colorSpace = THREE.SRGBColorSpace

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
        matcap: tMatcap,
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

// const dotGeometry = new THREE.SphereGeometry(.05, 16, 16)
// const dotMaterial = new THREE.PointsMaterial({
//     color: '#f0be8d',
// })

// for (let i = 0; i < 1000; i++) {
//     const dot = new THREE.Mesh(dotGeometry, dotMaterial)
//     dot.position.x = (Math.random() - 0.5) * 100
//     dot.position.y = (Math.random() - 0.5) * 100
//     dot.position.z = (Math.random() - 0.5) * 100

//     dot.rotation.x = Math.random() * Math.PI
//     dot.rotation.y = Math.random() * Math.PI

//     const scale = Math.random()
//     dot.scale.set(scale, scale, scale)

//     scene.add(dot)
// }

// utility to generate random values between two values
const getRandomInRange = (min, max) => {
    return Math.random() * (max - min) + min
}

// Stars
const starsGeometry = new THREE.BufferGeometry()
const count = 1000

const positions = new Float32Array(count * 3)

for(let i = 0; i < count * 3; i++) {
    positions[i] = getRandomInRange(-15, 15)
}

starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const starsMaterial = new THREE.PointsMaterial({
    size: getRandomInRange(0.1, 0.3),
    sizeAttenuation: true,
    transparent: true,
    alphaMap: tStar,
    depthWrite: false,
    color: '#fcefc3',
})
const stars = new THREE.Points(starsGeometry, starsMaterial)
scene.add(stars)
stars.position.y = -6
// End of Stars

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
