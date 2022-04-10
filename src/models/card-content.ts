import { DeckLanguages } from './deck';

const cardLanguages = ['Default', ...DeckLanguages] as const;

export type CardLanguage = typeof cardLanguages[number];

export interface CardContent {
  text: string;
  audio: HTMLAudioElement; // new Audio(...);
  language: CardLanguage;
}
