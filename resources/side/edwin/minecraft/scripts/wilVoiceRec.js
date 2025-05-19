const wilVoiceRec = (() => {
    let recognition = null;
  
    const initSpeechRecognition = () => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
  
      if (!SpeechRecognition) {
        console.error('Speech Recognition API.');
        return;
      }
  
      recognition = new SpeechRecognition();
  
      if (SpeechGrammarList) {
        const grammar = "#JSGF V1.0; grammar commands; public <command> = forward | backward | left | right ;";
        const speechRecognitionList = new SpeechGrammarList();
        speechRecognitionList.addFromString(grammar, 1);
        recognition.grammars = speechRecognitionList;  
      } else {
        console.warn('SpeechGrammarList is not supported.');
      }
  
      recognition.continuous = true;  
      recognition.lang = 'en-US';
      recognition.interimResults = false;  // full commands
      recognition.maxAlternatives = 1;
  
      recognition.addEventListener('result', handleSpeechResult);
      recognition.addEventListener('error', (event) => console.error('Speech recognition error:', event.error));
    };
  
    const startListening = () => {
      if (!recognition) {
        initSpeechRecognition();
      }
  
      if (recognition) {
        recognition.start();
        console.log('Speech recognition started');
      }
    };
  
    const stopListening = () => {
      if (recognition) {
        recognition.stop();
        console.log('Speech recognition stopped');
      }
    };
  
    const handleSpeechResult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      console.log('Recognized speech:', transcript);
  
      switch (transcript) {
        case 'forward':
          dispatchEvent('moveForward');
          break;
        case 'backward':
          dispatchEvent('moveBackward');
          break;
        case 'left':
          dispatchEvent('moveLeft');
          break;
        case 'right':
          dispatchEvent('moveRight');
          break;
        case 'jump':
          dispatchEvent('playerJump');
          break;
        case 'stop':
          dispatchEvent('speechStopDetected');
          break;
        case 'go':
          dispatchEvent('speechGoDetected');
          break;
        default:
          console.log('Command not recognized:', transcript);
      }
    };
  
    const dispatchEvent = (eventName) => {
      window.dispatchEvent(new Event(eventName));
    };
  
    return {
      startListening,
      stopListening,
    };
  
  })();
  
  export default wilVoiceRec;
  