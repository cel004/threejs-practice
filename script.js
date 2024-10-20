import 'style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js';
import html2canvas from 'html2canvas';

let lightMode = true;
const asciiMesh = new THREE.Mesh();
const scene = new THREE.Scene();
scene.background = new THREE.Color(0, 0, 0);

const pointLight1 = new THREE.PointLight(0xffffff, 1);
pointLight1.position.set(100, 100, 400);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xffffff, 0.5);
pointLight2.position.set(-500, 100, -400);
scene.add(pointLight2);

const material = new THREE.MeshStandardMaterial({
    flatShading: true,
    side: THREE.DoubleSide,
});

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 2000);
camera.position.set(0, 100, 400);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
document.body.appendChild(renderer.domElement);

// ascii shader effect
let effect;
const characters = ' .:-+*=%@#';
const effectSize = { amount: 0.205 };
let backgroundColor = 'black';
let ASCIIColor = 'white';

function createEffect() {
    effect = new AsciiEffect(renderer, characters, { invert: true, resolution: effectSize.amount });
    effect.setSize(sizes.width, sizes.height);
    effect.domElement.style.color = ASCIIColor;
    effect.domElement.style.backgroundColor = backgroundColor;
}

createEffect();
document.body.appendChild(effect.domElement);
document.getElementById('ascii').style.whiteSpace = 'pre-wrap';

// gltb Loader for 3d object
const gltbLoader = new GLTBLoader();

stlLoader.load(
    './assets/ChocoCat.glb',
    function (geometry) {
        asciiMesh.material = material;
        asciiMesh.geometry = geometry;

        geometry.computeVertexNormals();
        asciiMesh.geometry.center();
        asciiMesh.rotation.x = -Math.PI / 2; // upright rotation

        // bounding box adjustment
        asciiMesh.geometry.computeBoundingBox();
        const bbox = asciiMesh.geometry.boundingBox;

        asciiMesh.position.y = (bbox.max.z - bbox.min.z) / 2;
        scene.add(asciiMesh);
    },
    // for debugging
    undefined,
    function (error) {
        console.error('Error loading GLTB file:', error);
    }
);

// orbit Controls w/ mouse
const controls = new OrbitControls(camera, effect.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// resizing listener
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    effect.setSize(sizes.width, sizes.height);
});

// animation
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Update controls for smooth interaction
    effect.render(scene, camera); // Render scene with ASCII effect
}

animate();