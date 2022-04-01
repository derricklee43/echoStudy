import { Deck } from '../deck';

export const testEnglishDeck = (id: number): Deck => ({
  id: id,
  title: 'English 101',
  desc: 'The course concentrates primarily on expository, effective composing, revising, and editing strategies.',
  access: 'Private',
  frontLang: 'English',
  backLang: 'English',
  cards: [],
});

export const testJapaneseVerbsDeck = (id: number): Deck => ({
  id: id,
  title: 'Japanese Verbs',
  desc: 'The course concentrates primarily on Japanese verbs.',
  access: 'Private',
  frontLang: 'English',
  backLang: 'English',
  cards: [],
});

export const testNPTEPartNumberDeck = (id: number, partNumber: number): Deck => ({
  id: id,
  title: `NPTE Part ${partNumber}`,
  desc: 'Taking the National Physical Therapy Examination (NPTE) is an important step toward receiving your physical therapist (PT) or physical therapist assistant (PTA) license.',
  access: 'Private',
  frontLang: 'English',
  backLang: 'English',
  cards: [],
});
