import {
  getTestFoxBack,
  getTestFoxFront,
  getTestMonkeyBack,
  getTestMonkeyFront,
  getTestMouseBack,
  getTestMouseFront,
} from './card-content.mock';
import { Card, createNewCard } from '../card';

export const getTestFoxCard = (score?: number, dateTouched?: Date): Card => {
  const testCard = createNewCard();
  testCard.front = getTestFoxFront();
  testCard.back = getTestFoxBack();
  testCard.score = score ?? 0;
  testCard.dateTouched = dateTouched ?? testCard.dateTouched;
  return testCard;
};

export const getTestMouseCard = (score?: number, dateTouched?: Date): Card => {
  const testCard = createNewCard();
  testCard.front = getTestMouseFront();
  testCard.back = getTestMouseBack();
  testCard.score = score ?? 0;
  testCard.dateTouched = dateTouched ?? testCard.dateTouched;
  return testCard;
};

export const getTestMonkeyCard = (score?: number, dateTouched?: Date): Card => {
  const testCard = createNewCard();
  testCard.front = getTestMonkeyFront();
  testCard.back = getTestMonkeyBack();
  testCard.score = score ?? 0;
  testCard.dateTouched = dateTouched ?? testCard.dateTouched;
  return testCard;
};
