
// import * as THREE from 'three';

// export function initializeSpeechRecognition(player, renderer, scene, world) {
//   let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
//   recognition.lang = 'en-US';
//   recognition.interimResults = false;
//   recognition.maxAlternatives = 1;

//   let isListening = false;

//   recognition.onresult = (event) => {
//     const transcript = event.results[0][0].transcript.toLowerCase().trim();
//     console.log('Transcript:', transcript);

//     switch (transcript) {
//       case 'forward':
//         movePlayerForward(player, renderer, scene, world);
//         break;
//       case 'backward':
//         movePlayerBackward(player, renderer, scene, world);
//         break;
//       case 'left':
//         movePlayerLeft(player, renderer, scene, world);
//         break;
//       case 'right':
//         movePlayerRight(player, renderer, scene, world);
//         break;
//       case 'modal':
//         showModal();
//         break;
//       default:
//         console.log('Command not recognized:', transcript);
//     }

//     startListening(recognition); // Restart listening after processing a command
//   };

//   recognition.onerror = (event) => {
//     console.error('Error occurred in recognition:', event.error);
//     startListening(recognition); // Restart listening on error
//   };

//   recognition.onend = () => {
//     if (isListening) {
//       startListening(recognition); // Restart listening when recognition ends
//     }
//   };

//   function startListening(recognition) {
//     if (!isListening) return;
//     recognition.start();
//   }

//   isListening = true;
//   startListening(recognition); // Start listening for commands
// }

// export function movePlayerForward(player, renderer, scene, world) {
//   const moveDuration = 5000; // Duration for moving forward in milliseconds
//   const moveInterval = 50; // Interval to move forward incrementally

//   const moveStep = () => {
//     player.position.add(player.camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(0.3));
//     player.update(world);
//     renderer.render(scene, player.camera);
//   };

//   let moveTime = 0;
//   const moveIntervalId = setInterval(() => {
//     moveStep();
//     moveTime += moveInterval;
//     if (moveTime >= moveDuration) {
//       clearInterval(moveIntervalId);
//     }
//   }, moveInterval);
// }

// export function movePlayerBackward(player, renderer, scene, world) {
//   const moveDuration = 5000; // Duration for moving backward in milliseconds
//   const moveInterval = 50; // Interval to move backward incrementally

//   const moveStep = () => {
//     player.position.sub(player.camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(0.3));
//     player.update(world);
//     renderer.render(scene, player.camera);
//   };

//   let moveTime = 0;
//   const moveIntervalId = setInterval(() => {
//     moveStep();
//     moveTime += moveInterval;
//     if (moveTime >= moveDuration) {
//       clearInterval(moveIntervalId);
//     }
//   }, moveInterval);
// }

// export function movePlayerLeft(player, renderer, scene, world) {
//   const moveDuration = 5000; // Duration for moving left in milliseconds
//   const moveInterval = 50; // Interval to move left incrementally

//   const moveStep = () => {
//     const direction = new THREE.Vector3();
//     player.camera.getWorldDirection(direction);
//     direction.cross(player.camera.up); // Calculate left direction
//     player.position.sub(direction.multiplyScalar(0.3));
//     player.update(world);
//     renderer.render(scene, player.camera);
//   };

//   let moveTime = 0;
//   const moveIntervalId = setInterval(() => {
//     moveStep();
//     moveTime += moveInterval;
//     if (moveTime >= moveDuration) {
//       clearInterval(moveIntervalId);
//     }
//   }, moveInterval);
// }

// export function movePlayerRight(player, renderer, scene, world) {
//   const moveDuration = 5000; // Duration for moving right in milliseconds
//   const moveInterval = 50; // Interval to move right incrementally

//   const moveStep = () => {
//     const direction = new THREE.Vector3();
//     player.camera.getWorldDirection(direction);
//     direction.cross(player.camera.up); // Calculate right direction
//     player.position.add(direction.multiplyScalar(0.3));
//     player.update(world);
//     renderer.render(scene, player.camera);
//   };

//   let moveTime = 0;
//   const moveIntervalId = setInterval(() => {
//     moveStep();
//     moveTime += moveInterval;
//     if (moveTime >= moveDuration) {
//       clearInterval(moveIntervalId);
//     }
//   }, moveInterval);
// }

// // export function showModal() {
// //   console.log('showModal function called');
// //   const modal = new bootstrap.Modal(document.getElementById('myModal'));
// //   modal.show();
// // }

// export function showModal() {
//   const modalElement = document.getElementById('myModal');
//   const modal = new bootstrap.Modal(modalElement);
//   modal.show();
// }



// export function hideModal() {
//   const modal = document.querySelector('myModal'); 
//   if (modal) {
//     const bootstrapModal = new bootstrap.Modal(modal);
//     bootstrapModal.hide(); // Hide the modal
//   }
// }