import * as tf from '@tensorflow/tfjs';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';

let detector;
let model;
let isModelTrained = false;
let isDetectorInitialized = false; 
let videoReady = false;



// All the class names by ethan
const classNames = [ 
  "leftDown", "leftForward", "leftLeft", "leftRight", "leftStop", "leftUp",
  "rightDown", "rightForward", "rightLeft", "rightRight", "rightStop", "rightUp"
];



// Initialise the detector using the MediaPipe model    
async function initDetector() {
    try {
        const modelType = handPoseDetection.SupportedModels.MediaPipeHands; // Handpose detection model.
        const detectorConfig = {
            runtime: 'mediapipe', 
            modelType: 'full', // Full model for higher accuracy
            solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands'
        };
        detector = await handPoseDetection.createDetector(modelType, detectorConfig); // creating the dector for teh handposes
        isDetectorInitialized = true; // initilise it now
        console.log('Handpose detector initialized');
    } catch (error) {
        console.error('Error initializing detector:', error);
    }
}


// loading teh trained model from ethans public folder ****** I CHANGED HIS FILE NAME *****
async function loadModel() {
    try {
        model = await tf.loadLayersModel('/ethan/currentworkingkeypointsmodel/trained_model.json'); 
        console.log('Trained model loaded successfully');
        isModelTrained = true; // Initialise it now
    } catch (error) {
        console.error('Error loading the model:', error);
    }
}


// Extracting the keypoints from the model
function normalizeHandPose(handpose) {
    const keypoints = handpose.keypoints;

    if (!keypoints || keypoints.length === 0 || isNaN(keypoints[0].x)) { // validate key points to make sure their usable
        console.error('Invalid keypoints:', keypoints);
        return null; //return null if the keypoints are not valid
    }

    const normalizedKeypoints = []; //empty array to store coordinates of the hand keypoints 

    // Using the first keypoint which is the wrist
    const basePoint = keypoints[0];
    for (const point of keypoints) { //iternate thorugh it 
        if (isNaN(point.x) || isNaN(point.y)) {
            console.error('Invalid keypoint detected:', point); //validate the key point
            return null;
        }
    // Subtract the base point coordinates to normalize the keypoint
        normalizedKeypoints.push({
            x: point.x - basePoint.x,
            y: point.y - basePoint.y
        });
    }

    // Flatten the keypoints into an array, each keypoint contributes to 2 values x and y
    return normalizedKeypoints.flatMap(point => [point.x, point.y]);
}

async function predictGesture(handpose) { // Check if model is loaded
    if (!isModelTrained) {
        console.error('Model is not trained yet.');
        return null;
    }

    // match the input shape
    const features = normalizeHandPose(handpose);
    if (!features || features.length !== 42) { // 21 keypoints × 2 coordinates = 42 features
        console.error('Invalid features extracted from hand pose.');
        return null;
    }

    // Creating a tensor Shape: [1, 42]
    const input = tf.tensor2d([features]);
    const prediction = await model.predict(input).data(); // predict the gesture
    input.dispose(); //free up memory created 2d tensor

    const maxIndex = prediction.indexOf(Math.max(...prediction)); // index of the highest probability in the prediction array
    return classNames[maxIndex]; // return the gesture name with the highest probability
}

async function detectHands(videoElement) {
    if (!detector || !isDetectorInitialized) {
        console.error('Handpose detector not initialized');
        return;
    }
     
    // check if canvas video element is ready and correct domensions
    if (!videoReady || videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
        console.error('Video element has invalid dimensions');
        requestAnimationFrame(() => detectHands(videoElement)); // try again
        return;
    }

    try {
        const hands = await detector.estimateHands(videoElement); //estimate from current video frame
        if (hands && hands.length > 0) {
            const hand = hands[0]; //if 1 hand is detected process the hand 
            if (!hand.keypoints || hand.keypoints.length === 0 || isNaN(hand.keypoints[0].x)) {
                console.error('Invalid keypoints detected:', hand.keypoints); //validate the hands key points
            } else {
                console.log('Hands detected:', hands);
                const gesture = await predictGesture(hand); //predict the gesture based on the keypoinst 
                if (gesture) {
                    console.log(`Gesture detected: ${gesture}`);
                    const event = new CustomEvent('gestureDetected', { detail: gesture }); //dispatch the event
                    window.dispatchEvent(event);
                }
            }
        } else {
            console.log('No hands detected.');
        }
    } catch (error) {
        console.error('Error during hand detection:', error);
    }

    requestAnimationFrame(() => detectHands(videoElement)); // Continue detecting hands with the next frame 
}

async function enableCam(videoElement) { // getting the cam on 
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true
            });
            videoElement.srcObject = stream;
            videoElement.onloadedmetadata = () => {
                videoElement.play();
                console.log('Webcam stream started');
            };
        } catch (error) {
            console.error('Error accessing webcam:', error);
        }
    } else {
        console.error('getUserMedia is not supported in this browser.');
    }
}

async function startGestureRecognition(videoElement) {
    try {
        await initDetector(); // Initialize the hand pose detector
        await loadModel(); // Load the trained model
        console.log('Handpose model and detector initialized');
        
        await enableCam(videoElement); // webcam is enabled

        videoElement.onloadeddata = () => {
            videoReady = true;
            console.log('Video is fully loaded, starting hand detection...');
            detectHands(videoElement); // start the hand detection loop
        };
    } catch (error) {
        console.error('Error during gesture recognition initialization:', error);
    }
}

//exporting it to be used in other parts
export default {
    initDetector,
    loadModel,
    detectHands,
    startGestureRecognition,
    enableCam
};
