import { v4 as uuidv4 } from 'uuid';
import { CardContent, createNewCardContent } from './card-content';
export interface Card {
  id?: number;
  position?: number;
  key: string;
  front: CardContent;
  back: CardContent;
}

export function createNewCard(): Card {
  return { front: createNewCardContent(), back: createNewCardContent(), key: uuidv4() };
}
