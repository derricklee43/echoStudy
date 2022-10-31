import { useRef, useState } from 'react';
import { isDefined } from '@/helpers/validator';
import { CapturedSpeech } from '@/models/captured-speech';
import { DeckLanguage, getLanguageCode } from '@/models/language';

export function useCaptureSpeech() {
  const speechRecognitionRef = useRef(getSpeechRecognitionObj());
  const [isCapturingSpeech, setIsCapturingSpeech] = useState(false);

  return { captureSpeech, stopCapturingSpeech, abortSpeechCapture, isCapturingSpeech };

  function captureSpeech(language: DeckLanguage, timeout?: number) {
    if (speechRecognitionRef.current === undefined) {
      throw new Error('unable to use speech recognition: speechRecognition object was undefined');
    }
    speechRecognitionRef.current.lang = getLanguageCode(language);

    try {
      speechRecognitionRef.current.start();
    } catch {
      speechRecognitionRef.current = getSpeechRecognitionObj();
      speechRecognitionRef.current.start();
    }

    return new Promise<CapturedSpeech>((resolve, reject) => {
      let wasNoSpeechError = false;

      setIsCapturingSpeech(true);

      // cleanup when timeout occurs
      const timeoutId = setTimeout(() => {
        isDefined(timeout) && resolve({ transcript: '', confidence: 0 });
      }, timeout ?? 0);

      // Will only fire if the system can make a about the transcript above the confidence threshold
      speechRecognitionRef.current.onresult = (event) => {
        clearTimeout(timeoutId);
        const resultsLength = event.results.length - 1;
        const ArrayLength = event.results[resultsLength].length - 1;
        const { transcript, confidence } = event.results[resultsLength][ArrayLength];
        resolve({ transcript, confidence });
      };

      // Always fires when disconnected
      speechRecognitionRef.current.onend = () => {
        clearTimeout(timeoutId);
        resolve({ transcript: '', confidence: 0 });
        wasNoSpeechError === false && setIsCapturingSpeech(false);
      };

      speechRecognitionRef.current.onerror = (event) => {
        clearTimeout(timeoutId);

        // no-speech gets fired after ~10 seconds, disconnecting the listener
        if (event.error === 'no-speech') {
          wasNoSpeechError = true;
        }

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
