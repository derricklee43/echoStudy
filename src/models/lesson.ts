export const a = '';

// import { Card } from './card';
// import { Stack } from '../helpers/stack';
// import { useRef } from 'react';

// export interface ILesson {
//   getCurrentCard(): LessonCard;
//   getLessonResults(): LessonCard[];
//   replayLastCard(): void;
//   skipCard(): void;
//   markCardCorrect(): void;
//   markCardIncorrect(): void;
// }

// export class Lesson implements ILesson {
//   a = useRef<string[]>();
//   protected upcomingCards: Stack<LessonCard>;
//   protected playedCards: Stack<LessonCard>;

//   constructor(cards?: Card[]) {
//     this.upcomingCards = new Stack<LessonCard>();
//     this.playedCards = new Stack<LessonCard>();

//     if (cards !== undefined) {
//       const selectedCards = cards.filter((card) => card.score >= 0);
//       const lessonCards: LessonCard[] = selectedCards.map((card) => {
//         return { card, definitionRepeatCount: 3, status: 'unseen' };
//       });
//       this.upcomingCards = new Stack(lessonCards);
//     }
//   }

//   public getCurrentCard() {
//     return this.upcomingCards.top;
//   }

//   public getLessonResults() {
//     return this.playedCards.toArray();
//   }

//   public replayLastCard() {
//     const currentCard = this.playedCards.pop();
//     this.upcomingCards.push(currentCard);
//   }

//   public skipCard() {
//     this.markCurrentCard('unseen');
//   }

//   public markCardCorrect() {
//     this.markCurrentCard('correct');
//   }

//   public markCardIncorrect() {
//     this.markCurrentCard('incorrect');
//   }

//   private markCurrentCard(status: LessonCard['status']) {
//     this.upcomingCards.top.status = status;
//     const currentCard = this.upcomingCards.pop();
//     this.playedCards.push(currentCard);
//   }
// }
