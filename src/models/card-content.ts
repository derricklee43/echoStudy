import { CardLanguage } from './language';
import { LazyAudio } from './lazy-audio';

export interface CardContent {
  text: string;
  audio?: LazyAudio; // new LazyAudio(...);
  customAudio?: LazyAudio;
  language: CardLanguage;
}

export function createNewCardContent(): CardContent {
  return { text: '', language: 'Default' };
}
