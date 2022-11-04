import { Card } from './card';
import { CardContent } from './card-content';
import { Deck } from './deck';
import { DeckLanguage } from './language';

export const LessonCardOutcomes = ['correct', 'unseen', 'incorrect'] as const;

export type LessonCardOutcome = typeof LessonCardOutcomes[number];

export interface LessonCard extends Card {
  front: LessonCardContent;
  back: LessonCardContent;
  outcome: LessonCardOutcome;
  repeatDefinitionCount: number;
}

export interface LessonCardContent extends CardContent {
  language: DeckLanguage;
}

export function createNewLessonCard(
  card: Card,
  deck: Deck,
  repeatDefinitionCount: number
): LessonCard {
  const { front, back, ...rest } = card;
  const newFront = createNewLessonCardContent(front, deck.metaData.frontLang);
  const newBack = createNewLessonCardContent(back, deck.metaData.backLang);
  return { ...rest, front: newFront, back: newBack, outcome: 'unseen', repeatDefinitionCount };
}

export function createNewLessonCardContent(
  cardContent: CardContent,
  deckLanguage: DeckLanguage
): LessonCardContent {
  const language = cardContent.language === 'Default' ? deckLanguage : cardContent.language;
  return { ...cardContent, language };
}
