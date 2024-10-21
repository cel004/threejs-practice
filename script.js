// imports the three.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// allows imports of .gltf files
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

window.addEventListener('load', () => {
    document.body.classList.add('fade-in'); // fade in after loading
});

// intialize scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // bg colour

// camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 5); 

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1); // soft white light
scene.add(ambientLight);

// directional lighting
const lightFront = new THREE.DirectionalLight(0xffffff, 0.5); 
// (x ,y ,z)
lightFront.position.set(0, 2, 10); 
scene.add(lightFront);
const lightBack = new THREE.DirectionalLight(0xffffff, 0.5); 
lightBack.position.set(0, 2, -10);
scene.add(lightBack);

const lightRight = new THREE.DirectionalLight(0xffffff, 0.5); 
lightRight.position.set(5, 5, 0);
scene.add(lightRight);
const lightLeft = new THREE.DirectionalLight(0xffffff, 0.5); 
lightLeft.position.set(-5, 5, 0);
scene.add(lightLeft);

// keep 3d object on global variable (able to access later)
let object;
let originalPosition;
const loader = new GLTFLoader();
loader.load(
    `assets/ChocoCat.glb`,
    function(gltf){
        // if file is loaded, add to scene
        object = gltf.scene;
        originalPosition = object.position.clone(); // store original position
        scene.add(object);
    },
    function(xhr){
        // while loaded, log progress
        console.log(`Loaded: ${xhr.loaded} bytes / ${xhr.total} bytes`);
    },
    function(error){
        // if theres an error, log it
        console.error(error);
    }
);

const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true}); 
renderer.setSize(window.innerWidth, window.innerHeight);
// add renderer to DOM
document.getElementById("ChocoCat").appendChild(renderer.domElement);

// orbit controls for rotation w/ mouse
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // damping for smoother controls
controls.dampingFactor = 0.05; // factor for smoother controls

controls.enableZoom = false; // disables zoom 
controls.enablePan = false; // disables panning

// disallows rotation on Z axis
controls.minPolarAngle = Math.PI / 2;
controls.maxPolarAngle = Math.PI / 2; 


controls.target.set(0, 0, 0); // target the center of the scene
controls.update(); // update rotation

// resize listener
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // update controls
    renderer.render(scene, camera); // render scene

    if (object) {
        // rotates object around the x axis
        object.rotation.y += 0.002; // speed rotation
    }
}

animate();
