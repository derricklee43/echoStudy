import { getSupportedDeckLanguages } from './deck';

const cardLanguages = getSupportedCardLanguages();

export type CardLanguage = typeof cardLanguages[number];

export interface CardContent {
  text: string;
  audio: HTMLAudioElement; // new Audio(...);
  language: CardLanguage;
}

export function getSupportedCardLanguages() {
  return ['Default', ...getSupportedDeckLanguages()];
}
