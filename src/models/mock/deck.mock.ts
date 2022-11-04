import { createNewDeck, Deck, DeckMetaData } from '@/models/deck';

export const testEnglishDeck = (id: number): Deck => {
  const newDeck = createNewDeck();
  const metaData: DeckMetaData = {
    ...newDeck.metaData,
    id: id,
    title: 'English 101',
    desc: 'The course concentrates primarily on expository, effective composing, revising, and editing strategies.',
  };
  return { metaData, cards: [] };
};

export const testJapaneseVerbsDeck = (id: number): Deck => {
  const newDeck = createNewDeck();
  const metaData: DeckMetaData = {
    ...newDeck.metaData,
    id: id,
    title: 'Japanese Verbs',
    desc: 'The course concentrates primarily on Japanese verbs.',
  };
  return { metaData, cards: [] };
};

export const testNPTEPartNumberDeck = (id: number, partNumber: number): Deck => {
  const newDeck = createNewDeck();
  const metaData: DeckMetaData = {
    ...newDeck.metaData,
    id: id,
    title: `NPTE Part ${partNumber}`,
    desc: 'Taking the National Physical Therapy Examination (NPTE) is an important step toward receiving your physical therapist (PT) or physical therapist assistant (PTA) license.',
  };
  return { metaData, cards: [] };
};
