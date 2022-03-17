import { CardContent } from './CardContent';

export interface Card {
  id: number;
  front: CardContent;
  back: CardContent;
}
