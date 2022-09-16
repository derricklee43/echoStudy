import { useRef, useState } from 'react';
import { CapturedSpeech } from '../models/captured-speech';
import { DeckLanguage, getLanguageCode } from '../models/language';

export function useCaptureSpeech() {
  const speechRecognitionRef = useRef(getSpeechRecognitionObj());
  const [isCapturingSpeech, setIsCapturingSpeech] = useState(false);

  return { captureSpeech, stopCapturingSpeech, abortSpeechCapture, isCapturingSpeech };

  function captureSpeech(language: DeckLanguage) {
    if (speechRecognitionRef.current === undefined) {
      throw new Error('unable to use speech recognition: speechRecognition object was undefined');
    }
    speechRecognitionRef.current.lang = getLanguageCode(language);
    speechRecognitionRef.current.start();

    return new Promise<CapturedSpeech>((resolve, reject) => {
      setIsCapturingSpeech(true);

      // Will only fire if the system can make a about the transcript above the confidence threshold
      speechRecognitionRef.current.onresult = (event) => {
        const resultsLength = event.results.length - 1;
        const ArrayLength = event.results[resultsLength].length - 1;
        const { transcript, confidence } = event.results[resultsLength][ArrayLength];
        resolve({ transcript, confidence });
      };

      // Always fires when disconnected
      // TODO: Find a guarantee that it will always fire after onresult
      // Or find another to handle resolving the promise if the user has not spoken
      speechRecognitionRef.current.onend = () => {
        resolve({ transcript: '', confidence: 0 });
        setIsCapturingSpeech(false);
      };

      speechRecognitionRef.current.onerror = (event) => {
        if (event.error !== 'aborted') {
          reject(event.error);
        }
      };
    });
  }

  // Stops the capturing of new speech, but it still allows the already captured material to be processed
  function stopCapturingSpeech() {
    speechRecognitionRef.current.stop();
  }

  function abortSpeechCapture() {
    speechRecognitionRef.current.abort();
  }
}

function getSpeechRecognitionObj() {
  if (typeof window === 'undefined') {
    console.error('cannot create speech recognition object when window is undefined');
  }
  return new (window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    (window as any).mozSpeechRecognition ||
    (window as any).msSpeechRecognition ||
    (window as any).oSpeechRecognition)();
}
