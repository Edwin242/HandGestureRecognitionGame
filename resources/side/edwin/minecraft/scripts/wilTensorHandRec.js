import * as tf from '@tensorflow/tfjs';


let VIDEO;
let STATUS;

const CLASS_NAMES = ['rightUp', 'rightDown', 'leftUp', 'leftDown', 'noise'];
let model;

window.onload = () => {
    VIDEO = document.createElement('video');  
    VIDEO.setAttribute('playsinline', '');  
    VIDEO.setAttribute('autoplay', '');  
    VIDEO.style.display = 'none';  

    STATUS = document.getElementById('status');
    enableCam();  
    loadGestureModel();  
};

async function loadGestureModel() {
    const modelPath = '/side/edwin/TensorGesture/my-trained-model.json';  
    try {
        model = await tf.loadLayersModel(modelPath);
        console.log('Model loaded');
        if (STATUS) {
            STATUS.innerText = 'Model Loaded. Ready for gesture detection!';
        }
    } catch (error) {
        console.error("Failed to load model:", error);
    }
}

function enableCam() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
            VIDEO.srcObject = stream; 
            VIDEO.play();  

            VIDEO.addEventListener('loadeddata', () => {
                console.log(`Video is ready. Dimensions: ${VIDEO.videoWidth}x${VIDEO.videoHeight}`);
                if (VIDEO.videoWidth > 0 && VIDEO.videoHeight > 0) {
                    predictLoop();  // Start the prediction loop when the video is ready
                } else {
                    console.error('Video dimensions are invalid (0x0).');
                }
            });
        }).catch((err) => {
            console.error("Error accessing the camera:", err);
        });
    } else {
        console.warn('getUserMedia() is not supported by your browser');
    }
}

const CONFIDENCE_THRESHOLD = 0.33;  

function predictLoop() {
    if (model && VIDEO && VIDEO.readyState >= 2) {
        const videoWidth = VIDEO.videoWidth;
        const videoHeight = VIDEO.videoHeight;

        if (videoWidth > 0 && videoHeight > 0) {
            tf.tidy(() => {
                const videoFrameAsTensor = tf.browser.fromPixels(VIDEO).div(255);
                const resizedTensorFrame = tf.image.resizeBilinear(videoFrameAsTensor, [32, 32]); // was 32
                
                const grayscaleTensorFrame = resizedTensorFrame.mean(2);  
                const flattenedTensor = grayscaleTensorFrame.flatten().expandDims(0);  

                const prediction = model.predict(flattenedTensor);
                const predictedIndex = prediction.argMax(-1).dataSync()[0];
                const confidence = prediction.max().dataSync()[0];

                if (confidence >= CONFIDENCE_THRESHOLD) {  
                    const action = CLASS_NAMES[predictedIndex];
                    performGameAction(action, confidence);
                }
            });
        } else {
            console.error('Video dimensions are invalid (0x0).');
            setTimeout(predictLoop, 100);  
        }

        requestAnimationFrame(predictLoop);
    } else {
        console.log('Video not ready or model not loaded yet.');
        setTimeout(predictLoop, 100); 
    }
}

function performGameAction(action, confidence) {
    console.log(`Recognized action: ${action} with confidence: ${confidence}`);
    executeAction(action);
}

function executeAction(action) {
    switch (action) {
        case 'rightUp':
            console.log('Move Forward (Right Thumbs Up)');
            dispatchEvent(new CustomEvent('MoveForward'));
            break;
        case 'rightDown':
            console.log('Move Backward (Right Thumbs Down)');
            dispatchEvent(new CustomEvent('MoveBackward'));
            break;
        case 'leftUp':
            console.log('Move Right (Left Thumbs Up)');
            dispatchEvent(new CustomEvent('MoveRight'));

            break;
        case 'leftDown':
            console.log('Move Left (Left Thumbs Down)');
            dispatchEvent(new CustomEvent('MoveLeft'));
            break;
        case 'noise':
            console.log('No Gesture Detected (noise)');  
            break;
        default:
            console.log('Unknown action');
    }
}


// dispatchEvent('');


export default {
    loadGestureModel,
    predictLoop
};



