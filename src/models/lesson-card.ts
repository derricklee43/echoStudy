import { Card } from './card';

export type LessonCardOutcome = 'unseen' | 'correct' | 'incorrect';

export interface LessonCard {
  card: Card;
  outcome: LessonCardOutcome;
  repeatDefinitionCount: number;
}

export function createNewLessonCard(card: Card, count: number): LessonCard {
  return { card, outcome: 'unseen', repeatDefinitionCount: count };
}
