import * as tf from '@tensorflow/tfjs';
import * as speechCommands from '@tensorflow-models/speech-commands';

const wilTensorVoiceRec = (() => {
  let recognizer; 
  let model; 

  const commandMapping = {
    forward: ['label6'],
    // forward: ['label6', 'label7'],  
    backward: ['label11'],
  };

  // Load TensorFlow model
  const loadModel = async () => {
    try {
      console.log('Loading TensorFlow model...');
      model = await tf.loadLayersModel('/side/edwin/TensorVoice/my-model.json');
    } catch (error) {
      console.error('Error loading TensorFlow model:', error);
    }
  };

  const startTensorFlowListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone access granted.');

      if (!recognizer) {
        console.log('Initializing speech recognizer...');
        recognizer = speechCommands.create('BROWSER_FFT');
        await recognizer.ensureModelLoaded();
        console.log('Speech recognizer initialized.');
      }

      if (!model) {
        await loadModel(); 
      }

      if (recognizer && model) {
        console.log('Starting TensorFlow voice recognition...');
        
        
        recognizer.listen(result => {
          const { scores } = result;
          const labels = ['label1', 'label2', 'label3', 'label4', 'label5', 'label6', 'label7', 'label8', 'label9', 'label10', 'label11', 'label12', 'label13', 'label14', 'label15', 'label16', 'label17', 'label18', 'label19', 'label20'];
        
          const highestScoreIndex = scores.indexOf(Math.max(...scores));
          const predictedLabel = labels[highestScoreIndex];
          const highestScore = Math.max(...scores); 
        
          console.log('Recognized TensorFlow command:', predictedLabel);
          console.log('Confidence Score:', highestScore); 
          
          let recognizedCommand = null;
        
          for (const [command, labelList] of Object.entries(commandMapping)) {
            if (labelList.includes(predictedLabel)) {
              recognizedCommand = command;
              break;
            }
          }
        
          if (highestScore > 0.99 && recognizedCommand) {
            switch (recognizedCommand) {
              case 'forward':
                dispatchEvent('moveForward');
                break;
              case 'backward':
                dispatchEvent('moveBackward');
                break;
              default:
                console.log('Unknown command:', recognizedCommand);
            }
          } else {
            console.log('low-confidence:', predictedLabel);
          }
        
        }, {
          includeSpectrogram: true,
          probabilityThreshold: 0.75,
          overlapFactor: 0.25,
          continuous: true
        });
        



        console.log('Voice recognition listening started.');
      }
    } catch (error) {
      console.error('Error starting voice recognition:', error);
    }
  };

  const dispatchEvent = (eventName) => {
    window.dispatchEvent(new Event(eventName));
  };

  return {
    startTensorFlowListening, // Start TensorFlow voice recognition
  };
})();

document.getElementById('listenBtn').addEventListener('click', wilTensorVoiceRec.startTensorFlowListening);

export default wilTensorVoiceRec;
