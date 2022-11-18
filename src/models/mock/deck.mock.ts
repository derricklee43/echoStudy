import { createNewDeck, Deck, DeckMetaData } from '@/models/deck';

export const testEnglishDeck = (id: number): Deck => {
  const newDeck = createNewDeck();
  const metaData: DeckMetaData = {
    ...newDeck.metaData,
    id: id,
    title: 'English 101',
    desc: 'The course concentrates primarily on expository, effective composing, revising, and editing strategies.',
    cardIds: [...Array(188)], // # of cards are set in the metadata and not the actual Deck.cards field
    studiedPercent: 53,
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
    cardIds: [...Array(90)],
    studiedPercent: 76,
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
    cardIds: [...Array(20)],
    studiedPercent: 0,
  };
  return { metaData, cards: [] };
};

export const testExamStudyDeck = (id: number): Deck => {
  const newDeck = createNewDeck();
  const metaData: DeckMetaData = {
    ...newDeck.metaData,
    id: id,
    title: 'MATH 1210 (Calculus I) Midterm',
    desc: 'Key-terms, limits, deriatives, integrals, and good-to-know rules.',
    studiedPercent: 56,
    cardIds: [...Array(59)],
  };
  return { metaData, cards: [] };
};

export const testStage20LatinDeck = (id: number): Deck => {
  const newDeck = createNewDeck();
  const metaData: DeckMetaData = {
    ...newDeck.metaData,
    id: id,
    title: 'Stage 20 Latin',
    desc: 'lūna, lūnae, f; ars, artis, f',
    studiedPercent: 8,
    cardIds: [...Array(35)],
  };
  return { metaData, cards: [] };
};

export const testChemPolyatomicIonsDeck = (id: number): Deck => {
  const newDeck = createNewDeck();
  const metaData: DeckMetaData = {
    ...newDeck.metaData,
    id: id,
    title: 'Chemistry Polyatomic Ions',
    desc: 'Common polyatomic ions such as ammonium, acetate, nitrite, permanganate, etc. along with their respective ion charges.',
    studiedPercent: 29,
    cardIds: [...Array(21)],
  };
  return { metaData, cards: [] };
};

export const testGermanFairytalesDeck = (id: number): Deck => {
  const newDeck = createNewDeck();
  const metaData: DeckMetaData = {
    ...newDeck.metaData,
    id: id,
    title: 'German Fairytales',
    desc: 'Geschichte berühmter Märchen wie "Rotkäppchen", "Geschichte der Großmutter" und mehr zusammen mit einer Analyse von Menschen seit dem Psychoanalytiker Bettelheim.',
    studiedPercent: 15,
    cardIds: [...Array(135)],
  };
  return { metaData, cards: [] };
};
