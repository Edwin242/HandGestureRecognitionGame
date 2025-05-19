// export function initializeGestureRecognition() {
//     let referenceImage;
//     let isModalOpen = false; // Track the state of the modal

//     async function loadThumbsUpImage() {
//       const img = new Image();
//       img.src = '/side/edwin/HandGestures/BothPalms/ThumbUp7.jpg';
//       return new Promise((resolve, reject) => {
//         img.onload = () => {
//           referenceImage = img;
//           console.log('Reference image loaded:', img);
//           resolve();
//         };
//         img.onerror = () => {
//           console.error('Failed to load reference image.');
//           reject();
//         };
//       });
//     }

//     async function setupCamera() {
//       const video = document.createElement('video');
//       video.width = 640;
//       video.height = 480;
//       video.style.display = 'none';
//       document.body.appendChild(video);

//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         video.srcObject = stream;
//         await new Promise((resolve) => { video.onloadedmetadata = () => resolve(); });
//         video.play();
//         return video;
//       } catch (error) {
//         console.error('Failed to set up camera', error);
//         return null;
//       }
//     }

//     function compareFrameWithReference(video, referenceImage) {
//       if (!referenceImage || !video) {
//         console.log('Reference image or video not available.');
//         return { diff: Infinity, openThreshold: 0, closeThreshold: 0 }; // Default values
//       }

//       const canvas = document.createElement('canvas');
//       const context = canvas.getContext('2d');
//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;
//       context.drawImage(video, 0, 0, canvas.width, canvas.height);
//       const frameImageData = context.getImageData(0, 0, canvas.width, canvas.height);

//       const refCanvas = document.createElement('canvas');
//       const refContext = refCanvas.getContext('2d');
//       refCanvas.width = referenceImage.width;
//       refCanvas.height = referenceImage.height;
//       refContext.drawImage(referenceImage, 0, 0, refCanvas.width, refCanvas.height);
//       const refImageData = refContext.getImageData(0, 0, refCanvas.width, refCanvas.height);

//       const openThreshold = 40722980; // Threshold for opening the modal
//       const closeThreshold = 45722980; // Threshold for closing the modal

//       let diff = 0;
//       for (let i = 0; i < Math.min(frameImageData.data.length, refImageData.data.length); i++) {
//         diff += Math.abs(frameImageData.data[i] - refImageData.data[i]);
//       }
//       console.log('Difference:', diff);  // Log the diff value

//       return { diff, openThreshold, closeThreshold };
//     }

//     function detectGesture(video) {
//       const { diff, openThreshold, closeThreshold } = compareFrameWithReference(video, referenceImage);

//       if (diff < openThreshold && !isModalOpen) {
//         console.log("Gesture detected"); // Debugging log
//         showModal(); // Trigger modal when a thumbs-up pose is detected
//         dispatchCustomEvent('gestureThumbsUpDetected');
//         isModalOpen = true; // Update the state to reflect that the modal is open
//       } else if (diff > closeThreshold && isModalOpen) {
//         console.log("Gesture no longer detected"); // Debugging log
//         hideModal(); // Close the modal
//         dispatchCustomEvent('gestureNoLongerDetected');
//         isModalOpen = false; // Update the state to reflect that the modal is closed
//       }
//     }

//     function dispatchCustomEvent(eventName) {
//       const event = new CustomEvent(eventName);
//       window.dispatchEvent(event);
//     }

//     async function loadAndDetectGesture() {
//       const video = await setupCamera();
//       if (!video) return; // Exit if camera setup failed

//       await loadThumbsUpImage(); // Wait for the reference image to load

//       function animate() {
//         requestAnimationFrame(animate);

//         detectGesture(video); // Detect gesture during each animation frame
//         console.log('Gesture detection checked.'); // Log every frame
//       }

//       animate();
//     }

//     loadAndDetectGesture();
// }

// function showModal() {
//   const modalElement = document.getElementById('myModal');
//   const modal = new bootstrap.Modal(modalElement);
//   modal.show();
// }

// function hideModal() {
//   const modal = document.querySelector('#myModal');
//   if (modal) {
//     const bootstrapModal = new bootstrap.Modal(modal);
//     bootstrapModal.hide(); // Hide the modal
//   }
// }

  