export interface CapturedSpeech {
  from: 'result' | 'no-result' | 'timeout';
  confidence: number;
  transcript: string;
}
