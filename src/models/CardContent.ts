export type Language = 'English' | 'Spanish' | 'German' | 'Japanese';

export interface CardContent {
  text: string;
  audio: HTMLAudioElement; // new Audio(...);
  language: Language;
}
