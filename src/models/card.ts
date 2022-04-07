import { CardContent, Language } from './card-content';

export interface Card {
  id: number;
  front: CardContent;
  back: CardContent;
}

export function createNewCard(frontLang: Language, backLang: Language): Card {
  const front: CardContent = {
    text: '',
    audio: new Audio(),
    language: frontLang,
  };

  const back: CardContent = {
    text: '',
    audio: new Audio(),
    language: backLang,
  };

  return { id: 0, front, back };
}
