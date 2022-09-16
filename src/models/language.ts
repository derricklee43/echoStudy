export const AllDeckLanguages = ['English', 'Spanish', 'German', 'Japanese'] as const;
export const AllCardLanguages = ['Default', ...AllDeckLanguages] as const;
export type DeckLanguages = typeof AllDeckLanguages;
export type CardLanguages = typeof AllCardLanguages;
export type DeckLanguage = DeckLanguages[number];
export type CardLanguage = CardLanguages[number];

const LANGUAGE_CODES: Record<DeckLanguage, string> = {
  English: 'en-us',
  Spanish: 'es-es',
  German: 'de-de',
  Japanese: 'ja-ja',
};

export function getLanguageCode(language: DeckLanguage) {
  return LANGUAGE_CODES[language];
}
