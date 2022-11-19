import { createNewDeck, Deck, DeckMetaData } from '@/models/deck';

// increment for unique id when generating deck metadata
let nextId = 0;

export const testEnglishDeck = (): Deck => {
  const newDeck = createNewDeck();
  const metaData: DeckMetaData = {
    ...newDeck.metaData,
    id: nextId++,
    title: 'English 101',
    desc: 'The course concentrates primarily on expository, effective composing, revising, and editing strategies.',
    cardIds: [...Array(188)], // # of cards are set in the metadata and not the actual Deck.cards field
    studiedPercent: 53,
  };
  return { metaData, cards: [] };
};

export const testJapaneseVerbsDeck = (): Deck => {
  const newDeck = createNewDeck();
  const metaData: DeckMetaData = {
    ...newDeck.metaData,
    id: nextId++,
    title: 'Japanese Verbs',
    desc: 'The course concentrates primarily on Japanese verbs.',
    cardIds: [...Array(90)],
    studiedPercent: 76,
  };
  return { metaData, cards: [] };
};

export const testNPTEPartNumberDeck = (partNumber: number): Deck => {
  const newDeck = createNewDeck();
  const metaData: DeckMetaData = {
    ...newDeck.metaData,
    id: nextId++,
    title: `NPTE Part ${partNumber}`,
    desc: 'Taking the National Physical Therapy Examination (NPTE) is an important step toward receiving your physical therapist (PT) or physical therapist assistant (PTA) license.',
    cardIds: [...Array(20)],
    studiedPercent: 0,
  };
  return { metaData, cards: [] };
};

export const testCalcMidtermDeck = (): Deck => {
  const newDeck = createNewDeck();
  const metaData: DeckMetaData = {
    ...newDeck.metaData,
    id: nextId++,
    title: 'MATH 1210 (Calculus I) Midterm',
    desc: 'Key-terms, limits, deriatives, integrals, and good-to-know rules.',
    studiedPercent: 56,
    cardIds: [...Array(59)],
  };
  return { metaData, cards: [] };
};

export const testStage20LatinDeck = (): Deck => {
  const newDeck = createNewDeck();
  const metaData: DeckMetaData = {
    ...newDeck.metaData,
    id: nextId++,
    title: 'Stage 20 Latin',
    desc: 'lūna, lūnae, f; ars, artis, f',
    studiedPercent: 8,
    cardIds: [...Array(35)],
  };
  return { metaData, cards: [] };
};

export const testChemPolyatomicIonsDeck = (): Deck => {
  const newDeck = createNewDeck();
  const metaData: DeckMetaData = {
    ...newDeck.metaData,
    id: nextId++,
    title: 'Chemistry Polyatomic Ions',
    desc: 'Common polyatomic ions such as ammonium, acetate, nitrite, permanganate, etc. along with their respective ion charges.',
    studiedPercent: 29,
    cardIds: [...Array(21)],
  };
  return { metaData, cards: [] };
};

export const testGermanFairytalesDeck = (): Deck => {
  const newDeck = createNewDeck();
  const metaData: DeckMetaData = {
    ...newDeck.metaData,
    id: nextId++,
    title: 'German Fairytales',
    desc: 'Geschichte berühmter Märchen wie "Rotkäppchen", "Geschichte der Großmutter" und mehr zusammen mit einer Analyse von Menschen seit dem Psychoanalytiker Bettelheim.',
    studiedPercent: 15,
    cardIds: [...Array(135)],
  };
  return { metaData, cards: [] };
};

export const testEasySpanishVocabDeck = (): Deck => {
  const newDeck = createNewDeck();
  const metaData: DeckMetaData = {
    ...newDeck.metaData,
    id: nextId++,
    title: 'Easy Spanish Vocabulary',
    desc: 'A couple simple terms primarily with food and vegetables.',
    studiedPercent: 30,
    cardIds: [...Array(10)],
  };
  return { metaData, cards: [] };
};

export const testBiologyMedSchoolDeck = (): Deck => {
  const newDeck = createNewDeck();
  const metaData: DeckMetaData = {
    ...newDeck.metaData,
    id: nextId++,
    title: 'Biology for Medical School',
    desc: 'Topics related to DNA synthesis, polymerase chain reactions, replication, mutagens, and more.',
    studiedPercent: 30,
    cardIds: [...Array(10)],
  };
  return { metaData, cards: [] };
};

export const testMusicTheoryDeck = () => {
  const newDeck = createNewDeck();
  const metaData: DeckMetaData = {
    ...newDeck.metaData,
    id: nextId++,
    title: 'Music Theory Basics',
    desc: 'This basic music theory set looks at fundamental concepts musicians use to understand, analyze, perform, communicate, and create music.',
    studiedPercent: 15,
    cardIds: [...Array(54)],
  };
  return { metaData, cards: [] };
};
