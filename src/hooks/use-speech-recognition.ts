import { useRef, useState } from 'react';
import { CapturedSpeech } from '../models/captured-speech';
import { DeckLanguage, getLanguageCode } from '../models/language';

type CaptureSpeechPromiseResolve = (value: CapturedSpeech | PromiseLike<CapturedSpeech>) => void;

export function useCaptureSpeech() {
  const speechRecognitionRef = useRef(getSpeechRecognitionObj());
  const promiseResolveRef = useRef<CaptureSpeechPromiseResolve>();
  const hasAudioStartedRef = useRef(false);
  const [isCapturingSpeech, setIsCapturingSpeech] = useState(false);

  return { captureSpeech, stopCapturingSpeech, isCapturingSpeech };

  function captureSpeech(language: DeckLanguage) {
    hasAudioStartedRef.current = false;
    speechRecognitionRef.current.lang = getLanguageCode(language);
    speechRecognitionRef.current.start();

    return new Promise<CapturedSpeech>((resolve, reject) => {
      setIsCapturingSpeech(true);
      promiseResolveRef.current = resolve;

      // Will only fire if the user has spoken/made a sound
      speechRecognitionRef.current.onresult = (event) => {
        const resultsLength = event.results.length - 1;
        const ArrayLength = event.results[resultsLength].length - 1;
        const { transcript, confidence } = event.results[resultsLength][ArrayLength];
        resolve({ transcript, confidence });
        setIsCapturingSpeech(false);
      };

      // The user has started speaking
      speechRecognitionRef.current.onaudiostart = () => {
        hasAudioStartedRef.current = true;
      };

      // Always fires when disconnected
      // TODO: Find a guarantee that it will always fire after onresult
      // Or find another to handle resolving the promise if the user has not spoken
      speechRecognitionRef.current.onend = () => {
        resolve({ transcript: '', confidence: 0 });
        setIsCapturingSpeech(false);
      };

      speechRecognitionRef.current.onerror = (event) => {
        reject(event.error);
        setIsCapturingSpeech(false);
      };
    });
  }

  function stopCapturingSpeech() {
    speechRecognitionRef.current.stop();
  }
}

function getSpeechRecognitionObj() {
  if (typeof window === 'undefined') {
    throw Error('cannot create speech recognition object when window is undefined');
  }
  return new (window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    (window as any).mozSpeechRecognition ||
    (window as any).msSpeechRecognition ||
    (window as any).oSpeechRecognition)();
}
