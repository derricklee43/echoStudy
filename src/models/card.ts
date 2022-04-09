import { v4 as uuidv4 } from 'uuid';
import { CardContent, Language } from './card-content';

export interface Card {
  id?: number;
  position?: number;
  key: string;
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

  return { front, back, key: uuidv4() };
}
