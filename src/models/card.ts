import { CardContent } from './card-content';

export interface Card {
  id: number;
  front: CardContent;
  back: CardContent;
}
