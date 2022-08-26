import { AllDeckLanguages } from './deck';

export const AllCardLanguages = ['Default', ...AllDeckLanguages] as const;

export type CardLanguages = typeof AllCardLanguages;

export type CardLanguage = CardLanguages[number];
export interface CardContent {
  text: string;
  audio?: HTMLAudioElement; // new Audio(...);
  language: CardLanguage;
}

export function createNewCardContent(): CardContent {
  return { text: '', language: 'Default' };
}
