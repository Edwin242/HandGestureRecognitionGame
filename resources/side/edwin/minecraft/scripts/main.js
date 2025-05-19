import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { World } from './world';
import { Player } from './player';
import { Physics } from './physics';
import { setupUI } from './ui';
import { ModelLoader } from './modelLoader';
import GestureRecognitionModule from './handpose.js';

let rotationLeftRemaining = 0;
let rotationRightRemaining = 0;
const rotationAngle = Math.PI / 8; //around 22 degress and 12 is 15 degrees. 
const rotationDuration = 0.5;





// UI Setup
const stats = new Stats();
document.body.appendChild(stats.dom);

// Renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x80a0e0);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Scene setup
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x80a0e0, 50, 75);

const world = new World();
world.generate();
scene.add(world);

const player = new Player(scene, world);
const physics = new Physics(scene);

// Camera setup
const orbitCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
orbitCamera.position.set(24, 24, 24);
orbitCamera.layers.enable(1);

const controls = new OrbitControls(orbitCamera, renderer.domElement);
controls.update();

const modelLoader = new ModelLoader((models) => {
  player.setTool(models.pickaxe);
});

let sun;
function setupLights() {
  sun = new THREE.DirectionalLight();
  sun.intensity = 1.5;
  sun.position.set(50, 50, 50);
  sun.castShadow = true;

  // Set the size of the sun's shadow box
  sun.shadow.camera.left = -40;
  sun.shadow.camera.right = 40;
  sun.shadow.camera.top = 40;
  sun.shadow.camera.bottom = -40;
  sun.shadow.camera.near = 0.1;
  sun.shadow.camera.far = 200;
  sun.shadow.bias = -0.0001;
  sun.shadow.mapSize = new THREE.Vector2(2048, 2048);
  scene.add(sun);
  scene.add(sun.target);

  const ambient = new THREE.AmbientLight();
  ambient.intensity = 0.2;
  scene.add(ambient);
}

// Movement flags initialising the variable, set to false so character is not moving, 
//
let moveForward = false;
let moveBackward = false;
// let moveLeft = false;
// let moveRight = false;


// let isJumping = false;



// Movement speed (units per second)
const moveSpeed = 6;

// Render loop
let previousTime = performance.now();
function animate() {
  requestAnimationFrame(animate);

  const currentTime = performance.now();
  const dt = (currentTime - previousTime) / 1000;

  if (player.controls.isLocked) {
    physics.update(dt, player, world);
    player.update(world);
    world.update(player);

    sun.position.copy(player.camera.position);
    sun.position.sub(new THREE.Vector3(-50, -50, -50));
    sun.target.position.copy(player.camera.position);

    orbitCamera.position.copy(player.position).add(new THREE.Vector3(16, 16, 16));
    controls.target.copy(player.position);

    // Apply movement
    if (moveForward) {
      const directionVector = new THREE.Vector3();
      player.camera.getWorldDirection(directionVector);
      directionVector.y = 0;
      directionVector.normalize();
      player.position.add(directionVector.multiplyScalar(dt * moveSpeed));
    }
    if (moveBackward) {
      const directionVector = new THREE.Vector3();
      player.camera.getWorldDirection(directionVector);
      directionVector.y = 0;
      directionVector.normalize();
      player.position.sub(directionVector.multiplyScalar(dt * moveSpeed));
    }
    
    
    // if (moveLeft) {
    //   const directionVector = new THREE.Vector3();
    //   player.camera.getWorldDirection(directionVector);
    //   const leftDirection = new THREE.Vector3().crossVectors(
    //     directionVector,
    //     player.camera.up
    //   );
    //   leftDirection.normalize();
    //   player.position.add(leftDirection.multiplyScalar(dt * moveSpeed));
    // }

    if (rotationLeftRemaining > 0){
      const rotateAmount = Math.min(rotationLeftRemaining, (rotationAngle / rotationDuration) * dt);
      player.camera.rotateY(rotateAmount);
      rotationLeftRemaining -= rotateAmount;

    }
    


    
    // if (moveRight) {
    //   const directionVector = new THREE.Vector3();
    //   player.camera.getWorldDirection(directionVector);
    //   const rightDirection = new THREE.Vector3().crossVectors(
    //     player.camera.up,
    //     directionVector
    //   );
    //   rightDirection.normalize();
    //   player.position.add(rightDirection.multiplyScalar(dt * moveSpeed));
    // }

    if (rotationRightRemaining > 0){
      const rotateAmount = Math.min(rotationRightRemaining, (rotationAngle / rotationDuration) * dt);
      player.camera.rotateY(-rotateAmount);
      rotationRightRemaining -= rotateAmount;
    }

    // Update player after movement
    player.update(world);
  }

  
  
  renderer.render(scene, player.controls.isLocked ? player.camera : orbitCamera);
  stats.update();

  previousTime = currentTime;
}

window.addEventListener('resize', () => {
  orbitCamera.aspect = window.innerWidth / window.innerHeight;
  orbitCamera.updateProjectionMatrix();
  player.camera.aspect = window.innerWidth / window.innerHeight;
  player.camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});

setupUI(world, player, physics, scene);
setupLights();
animate();

// Webcam setup
const videoElement = document.getElementById('webcam');

// Start the gesture recognition system
GestureRecognitionModule.startGestureRecognition(videoElement);

// Event Listeners for Gesture Commands
window.addEventListener('gestureDetected', (event) => {
  const gesture = event.detail;
  console.log(`Gesture recognized: ${gesture}`);

  // Reset movement flags when new gesture is detected
  moveForward = false;
  moveBackward = false;
  // moveLeft = false;
  // moveRight = false;

  // Handle gesture events here
  switch (gesture) {
    case 'rightForward':
    case 'leftForward':
    case 'leftUp':
      console.log('Move Forward');
      moveForward = true;
      break;
    // case 'rightBackward':
    // case 'leftBackward':
    // case 'rightDown':
    // case 'leftDown':
    //   console.log('Move Backward');
    //   moveBackward = true;
    //   break;
    case 'rightLeft':
    case 'leftLeft':
      console.log('Rotate Left');
      if (rotationLeftRemaining <= 0 && rotationRightRemaining <= 0) {
        rotationLeftRemaining = rotationAngle; 
      }      
      break;
    case 'rightRight':
    case 'leftRight':
      console.log('Rotate Right');
      if (rotationRightRemaining <= 0 && rotationLeftRemaining <= 0) {
        rotationRightRemaining = rotationAngle; 
      }      
      break;
    // case 'rightUp':
    // case 'leftUp':
    //   console.log('Jump')
    //   // isJumping = true;
    //   player.isJumping = true;
    //   break;
    case 'rightStop':
    case 'leftStop':
      console.log('Stop Movement');
      // All movement flags are already reset at the beginning
      break;
    default:
      console.log('No recognized gesture detected.');
      break;
  }
});

// // Event to request pointer lock when the player clicks the screen
// document.addEventListener('click', () => {
//   const canvas = renderer.domElement; 
//   if (canvas.requestPointerLock) {
//     canvas.requestPointerLock();
//   } else {
//     console.error('Pointer lock not supported on this element');
//   }
// }): 

// Check if pointer lock is successfully enabled
document.addEventListener('pointerlockchange', () => {
  if (document.pointerLockElement === renderer.domElement) {
    console.log('Pointer lock enabled');
  } else {
    console.log('Pointer lock disabled');
  }
});

// Handle pointer lock errors
document.addEventListener('pointerlockerror', () => {
  console.error('Unable to use Pointer Lock API');
});
