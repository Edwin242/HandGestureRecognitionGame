import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { World } from './world';
// import { setupUI } from './ui';
import { Player } from './player';
import { Physics } from './physics';
import { blocks } from './blocks';
import { ModelLoader } from './modelLoader';
import GestureRecognitionModule from './handpose.js';

// DOM elements
const playButton = document.getElementById('playButton');
const helpButton = document.getElementById('helpButton');
const controlsButton = document.getElementById('controlsButton');
const helpScreen = document.getElementById('help-screen');
const controlsScreen = document.getElementById('controls-screen');
const backButton = document.getElementById('backButton');
const timeRemaining = document.getElementById('time-remaining');
const gameName = document.getElementById('gameName');
const finalScore = document.getElementById('final-score');
const restartButton = document.getElementById('restartButton');

restartButton.style.visibility = 'hidden';
timeRemaining.style.visibility = 'hidden';
helpScreen.style.visibility = 'hidden';
helpButton.style.visibility = 'visible';
controlsButton.style.visibility = 'visible';
playButton.style.visibility = 'visible';
controlsScreen.style.visibility = 'hidden';
gameName.style.visibility = 'visible';
finalScore.style.visibility = 'hidden';
backButton.style.visibility = 'visible';

playButton.addEventListener('click', function () {
  playButton.innerHTML = 3;
  let playTimer = 2;
  let playCountdownTimer = setInterval(playCountdown, 1000);
  function playCountdown() {
    if (playTimer > 0) {
      playButton.innerHTML = playTimer;
      playTimer--;
    } else {
      console.log("starting");
      clearInterval(playCountdownTimer);
      helpScreen.style.visibility = 'hidden';
      helpButton.style.visibility = 'hidden';
      controlsButton.style.visibility = 'hidden';
      playButton.style.visibility = 'hidden';
      controlsScreen.style.visibility = 'hidden';
      backButton.style.visibility = 'hidden';
      gameName.style.visibility = 'hidden';
      timeRemaining.style.visibility = 'visible';
      player.controls.lock();
      let gameTimer = 20;
      let gameCountdownTimer = setInterval(gameCountdown, 1000);
      
      
      
    function gameCountdown() {
      if (gameTimer > 0) {
        timeRemaining.innerHTML = "Time remaining: " + gameTimer;
        gameTimer--;
      } else {
        timeRemaining.style.visibility = 'hidden';
        clearInterval(gameCountdownTimer);
        player.controls.unlock();
    
        gameName.style.visibility = 'hidden';
        playButton.style.visibility = 'hidden';
        helpButton.style.visibility = 'hidden';
        controlsButton.style.visibility = 'hidden';
        backButton.style.visibility = 'hidden';
    
        submitScore(physics.score).then(({ guid, score }) => {
          if (guid && score !== undefined) {
            generateQRCodes(guid, score);
          } else {
            console.error('Failed to obtain GUID or score.');
            alert('Failed to submit your score. Please try again.');
          }
        });
      }
    }
    
    }
  }
});

helpButton.addEventListener('click', function () {
  helpScreen.style.visibility = 'visible';
  helpButton.style.visibility = 'hidden';
  controlsButton.style.visibility = 'hidden';
  playButton.style.visibility = 'hidden';
});

restartButton.addEventListener('click', function () {
  // Hide final score and QR codes
  finalScore.style.visibility = 'hidden';
  finalScore.innerHTML = ''; // Clear the content

  // Hide restart button
  restartButton.style.visibility = 'hidden';

  // Reset game state
  world.generate(true);
  document.getElementById('player-score').innerHTML = '0';
  physics.score = 0;
  orbitCamera.position.set(-32, 32, 32);
  player.camera.position.set(0, 16, 0);
  playButton.innerHTML = 'Play!';

  // Show the start screen elements
  helpButton.style.visibility = 'visible';
  backButton.style.visibility = 'visible';
  playButton.style.visibility = 'visible';
  controlsButton.style.visibility = 'visible';
});

controlsButton.addEventListener('click', function () {
  controlsScreen.style.visibility = 'visible';
  helpButton.style.visibility = 'hidden';
  controlsButton.style.visibility = 'hidden';
  playButton.style.visibility = 'hidden';
});

backButton.addEventListener('click', function () {
  helpScreen.style.visibility = 'hidden';
  helpButton.style.visibility = 'visible';
  controlsButton.style.visibility = 'visible';
  playButton.style.visibility = 'visible';
  controlsScreen.style.visibility = 'hidden';
});



function generateQRCodes(guid, score) {
  console.log('Generating QR Code with GUID:', guid, 'and Score:', score); 
  const modalOverlay = document.createElement('div');
  modalOverlay.id = 'modal-overlay';
  const modalContent = document.createElement('div');
  modalContent.id = 'modal-content';
  modalOverlay.appendChild(modalContent);
  const closeButton = document.createElement('span');
  closeButton.id = 'modal-close';
  closeButton.innerHTML = '&times;';
  closeButton.onclick = function() {
    closeModal();
  };
  modalContent.appendChild(closeButton);

  const message = document.createElement('p');
  message.textContent = 'Your Final Score: ' + score + '. Scan this QR code to claim your score!';
  modalContent.appendChild(message);
  const qrCodeContainer = document.createElement('div');
  qrCodeContainer.id = 'qr-code';

  modalContent.appendChild(qrCodeContainer);

  document.body.appendChild(modalOverlay);

  const url = `${window.location.origin}/claim?guid=${encodeURIComponent(guid)}&score=${encodeURIComponent(score)}`;
  new QRCode(qrCodeContainer, {
    text: url,
    width: 200,
    height: 200,
  });

  modalOverlay.style.display = 'block';
}

function closeModal() {
  const modalOverlay = document.getElementById('modal-overlay');
  if (modalOverlay) {
    modalOverlay.style.display = 'none';
    modalOverlay.parentNode.removeChild(modalOverlay); 
  }

  restartGame();
}


function restartGame() {
  console.log('Restarting game...');
  // Reset game state
  world.generate(true);
  document.getElementById('player-score').innerHTML = 'Score: 0';
  physics.score = 0;
  orbitCamera.position.set(-32, 32, 32);
  player.position.set(0, 16, 0); // Reset player position
  player.camera.position.set(0, 16, 0);
  player.controls.unlock(); // Ensure controls are unlocked
  playButton.innerHTML = 'Play!';

  // Reset UI elements
  gameName.style.visibility = 'visible';
  timeRemaining.style.visibility = 'hidden';
  helpScreen.style.visibility = 'hidden';
  controlsScreen.style.visibility = 'hidden';
  finalScore.style.visibility = 'hidden';
  restartButton.style.visibility = 'hidden';

  // Show the start screen elements
  helpButton.style.visibility = 'visible';
  playButton.style.visibility = 'visible';
  controlsButton.style.visibility = 'visible';
  backButton.style.visibility = 'visible';

  // Hide modal if it's still visible
  const modalOverlay = document.getElementById('modal-overlay');
  if (modalOverlay) {
    modalOverlay.style.display = 'none';
  }
}




// Movement variables
let rotationLeftRemaining = 0;
let rotationRightRemaining = 0;
const rotationAngle = Math.PI / 8; // Around 22 degrees
const rotationDuration = 0.5;

// Renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x1b222e);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Background texture
const loader = new THREE.CubeTextureLoader();
const texture = loader.load([
  'http://localhost/side/zach/textures/px.png', // Right
  'http://localhost/side/zach/textures/nx.png', // Left
  'http://localhost/side/zach/textures/py.png', // Top
  'http://localhost/side/zach/textures/ny.png', // Bottom
  'http://localhost/side/zach/textures/pz.png', // Front
  'http://localhost/side/zach/textures/nz.png', // Back
]);

const orbitCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
orbitCamera.position.set(-32, 32, 32);
orbitCamera.layers.enable(1);
const controls = new OrbitControls(orbitCamera, renderer.domElement);
controls.target.set(32, 0, 32);
controls.update();

const loader2 = new THREE.TextureLoader();
const rectangleTexture = loader2.load('http://localhost/side/zach/textures/moonDirtFarDark.png');
rectangleTexture.colorSpace = THREE.SRGBColorSpace;
rectangleTexture.minFilter = THREE.NearestFilter;
rectangleTexture.magFilter = THREE.NearestFilter;
const material = new THREE.MeshBasicMaterial({ map: rectangleTexture });
const geometry = new THREE.BoxGeometry(20000, 0.5, 20000);
const rectangle = new THREE.Mesh(geometry, material);

const scene = new THREE.Scene();
scene.background = texture;
scene.fog = new THREE.Fog(0x1b222e, 70, 100);
const world = new World();
world.generate();
scene.add(world);
scene.add(rectangle);
rectangle.position.set(0, 10, 0);
document.getElementById('player-score').innerHTML = "Score: 0";

const player = new Player(scene);
const physics = new Physics(scene);
const sun = new THREE.DirectionalLight();

const modelLoader = new ModelLoader();
modelLoader.loadModels((models) => {
  player.tool.setMesh(models.steeringWheel);
});

function setupLighting() {
  sun.intensity = 1.5;
  sun.position.set(50, 50, 50);
  sun.castShadow = true;
  sun.shadow.camera.left = -100;
  sun.shadow.camera.right = 100;
  sun.shadow.camera.top = 100;
  sun.shadow.camera.bottom = -100;
  sun.shadow.camera.near = 0.1;
  sun.shadow.camera.far = 200;
  sun.shadow.bias = -0.0005;
  sun.shadow.mapSize = new THREE.Vector2(2048, 2048);
  scene.add(sun);
  scene.add(sun.target);

  const ambient = new THREE.AmbientLight();
  ambient.intensity = 0.1;
  scene.add(ambient);
}

let moveForward = false;
let moveBackward = false;

const moveSpeed = 6;

window.addEventListener('resize', () => {
  orbitCamera.aspect = window.innerWidth / window.innerHeight;
  orbitCamera.updateProjectionMatrix();
  player.camera.aspect = window.innerWidth / window.innerHeight;
  player.camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const stats = new Stats();
document.body.appendChild(stats.dom);

function onMouseDown(event) {
  if (player.controls.isLocked && player.selectedCoords) {
    if (player.activeBlockId === blocks.empty.id) {
      console.log(`removing block at ${JSON.stringify(player.selectedCoords)}`);
      world.removeBlock(
        player.selectedCoords.x,
        player.selectedCoords.y,
        player.selectedCoords.z
      );
      player.tool.startAnimation();
    } else {
      console.log(`adding block at ${JSON.stringify(player.selectedCoords)}`);
      world.addBlock(
        player.selectedCoords.x,
        player.selectedCoords.y,
        player.selectedCoords.z,
        player.activeBlockId
      );
    }
  }
}

document.addEventListener('keydown', function (event) {
  switch (event.key) {
    case 'd':
      player.tool.right();
      break;
    case 'a':
      player.tool.left();
      break;
  }
});

document.addEventListener('mousedown', onMouseDown);

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

    if (rotationLeftRemaining > 0) {
      const rotateAmount = Math.min(rotationLeftRemaining, (rotationAngle / rotationDuration) * dt);
      player.camera.rotateY(rotateAmount);
      rotationLeftRemaining -= rotateAmount;
    }

    if (rotationRightRemaining > 0) {
      const rotateAmount = Math.min(rotationRightRemaining, (rotationAngle / rotationDuration) * dt);
      player.camera.rotateY(-rotateAmount);
      rotationRightRemaining -= rotateAmount;
    }

    player.update(world);
  }

  renderer.render(scene, player.controls.isLocked ? player.camera : orbitCamera);
  stats.update();

  previousTime = currentTime;
}


setupLighting();
animate();

const videoElement = document.getElementById('webcam');

GestureRecognitionModule.startGestureRecognition(videoElement);

window.addEventListener('gestureDetected', (event) => {
  const gesture = event.detail;
  console.log(`Gesture recognized: ${gesture}`);

  moveForward = false;
  moveBackward = false;

  switch (gesture) {
    case 'rightForward':
    case 'leftForward':
    case 'leftUp':
      console.log('Move Forward');
      moveForward = true;
      break;
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
    case 'rightStop':
    case 'leftStop':
      console.log('Stop Movement');
      break;
    default:
      console.log('No recognized gesture detected.');
      break;
  }
});

document.addEventListener('pointerlockchange', () => {
  if (document.pointerLockElement === renderer.domElement) {
    console.log('Pointer lock enabled');
  } else {
    console.log('Pointer lock disabled');
  }
});

document.addEventListener('pointerlockerror', () => {
  console.error('Unable to use Pointer Lock API');
});




const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
const csrfToken = csrfTokenMeta ? csrfTokenMeta.getAttribute('content') : '';

// function submitScore(score) {
//   const guid = generateGUID();
//   console.log('Score submitted successfully:', { guid: guid, score: score });
//   return Promise.resolve({ guid: guid, score: score });
// }





function submitScore(score) {
  const guid = generateGUID();

  const data = {
    guid: guid,
    score: score,
  };

  return fetch('/submit-score', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': csrfToken, 
    },
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .then(responseData => {
      console.log('Response from server:', responseData); 
      if (responseData.success) {
        console.log('Score submitted successfully:', { guid: guid, score: score });
        return { guid: guid, score: score };
      } else {
        console.error('Failed to submit score:', responseData.error);
        return null;
      }
    })
    .catch(error => {
      console.error('Error submitting score:', error);
      return null;
    });
}





function generateGUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) { // template string
    // g ensures that all instances of x and y are replaced
    const r = (Math.random() * 16) | 0; //it replaces the x and y with hexadecimal digit
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}