import { DeckLanguages } from './deck';

export const CardLanguages = ['Default', ...DeckLanguages] as const;

export type CardLanguage = typeof CardLanguages[number];
export interface CardContent {
  text: string;
  audio: HTMLAudioElement; // new Audio(...);
  language: CardLanguage;
}

export function createNewCardContent(): CardContent {
  return { text: '', audio: new Audio(), language: 'English' }; // Todo change default language back to 'Default'
}
