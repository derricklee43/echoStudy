import {
  getTestFoxBack,
  getTestFoxFront,
  getTestMonkeyFront,
  getTestMouseBack,
  getTestMouseFront,
} from './card-content.mock';
import { Card, createNewCard } from '../card';

export const getTestFoxCard = (score?: number, dateUpdated?: Date): Card => {
  const testCard = createNewCard();
  testCard.front = getTestFoxFront();
  testCard.back = getTestFoxBack();
  testCard.score = score ?? 0;
  testCard.dateUpdated = dateUpdated ?? testCard.dateUpdated;
  return testCard;
};

export const getTestMouseCard = (score?: number, dateUpdated?: Date): Card => {
  const testCard = createNewCard();
  testCard.front = getTestMouseFront();
  testCard.back = getTestMouseBack();
  testCard.score = score ?? 0;
  testCard.dateUpdated = dateUpdated ?? testCard.dateUpdated;
  return testCard;
};

export const getTestMonkeyCard = (score?: number, dateUpdated?: Date): Card => {
  const testCard = createNewCard();
  testCard.front = getTestMonkeyFront();
  testCard.back = getTestMouseBack();
  testCard.score = score ?? 0;
  testCard.dateUpdated = dateUpdated ?? testCard.dateUpdated;
  return testCard;
};
