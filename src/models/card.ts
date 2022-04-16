import { v4 as uuidv4 } from 'uuid';
import { CardContent } from './card-content';
export interface Card {
  id?: number;
  position?: number;
  key: string;
  front: CardContent;
  back: CardContent;
}

export function createNewCard(): Card {
  const front: CardContent = {
    text: '',
    audio: new Audio(),
    language: 'Default',
  };

  const back: CardContent = {
    text: '',
    audio: new Audio(),
    language: 'Default',
  };

  return { front, back, key: uuidv4() };
}
