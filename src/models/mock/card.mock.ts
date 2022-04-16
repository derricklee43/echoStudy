import { Card, createNewCard } from '../card';
import {
  getTestFoxBack,
  getTestFoxFront,
  getTestMonkeyFront,
  getTestMouseBack,
  getTestMouseFront,
} from './card-content.mock';

export const getTestFoxCard = (): Card => {
  const testCard = createNewCard();
  testCard.front = getTestFoxFront();
  testCard.back = getTestFoxBack();
  return testCard;
};

export const getTestMouseCard = (): Card => {
  const testCard = createNewCard();
  testCard.front = getTestMouseFront();
  testCard.back = getTestMouseBack();
  return testCard;
};

export const getTestMonkeyCard = (): Card => {
  const testCard = createNewCard();
  testCard.front = getTestMonkeyFront();
  testCard.back = getTestMouseBack();
  return testCard;
};
