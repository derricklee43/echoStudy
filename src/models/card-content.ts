import { AllDeckLanguages } from './deck';
import { LazyAudio } from './lazy-audio';

export const AllCardLanguages = ['Default', ...AllDeckLanguages] as const;

export type CardLanguages = typeof AllCardLanguages;
export type CardLanguage = CardLanguages[number];

export interface CardContent {
  text: string;
  audio?: LazyAudio; // new LazyAudio(...);
  language: CardLanguage;
}

export function createNewCardContent(): CardContent {
  return { text: '', language: 'Default' };
}
