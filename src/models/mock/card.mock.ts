import { Card, createNewCard } from '../card';

export const getTestFoxCard = (): Card => {
  const testCard = createNewCard('English', 'Japanese');
  testCard.front.text = 'fox';
  testCard.front.audio = new Audio(
    'https://weblio.hs.llnwd.net/e7/img/dict/kenej/audio/S-C3906E2_E-C392F5C.mp3'
  );

  testCard.back.audio = new Audio('https://0.tqn.com/z/g/japanese/library/media/audio/kitsune.wav');
  testCard.back.text = '狐';

  return testCard;
};

export const getTestMouseCard = (): Card => {
  const testCard = createNewCard('English', 'Japanese');
  testCard.front.text = 'mouse';
  testCard.front.audio = new Audio(
    'https://weblio.hs.llnwd.net/e7/img/dict/kenej/audio/S-CBE8B66_E-CBEB33E.mp3'
  );

  testCard.back.audio = new Audio('https://0.tqn.com/z/g/japanese/library/media/audio/nezumi.wav');
  testCard.back.text = '狐';

  return testCard;
};

export const getTestMonkeyCard = (): Card => {
  const testCard = createNewCard('English', 'Japanese');
  testCard.front.text = 'monkey';
  testCard.front.audio = new Audio(
    'https://weblio.hs.llnwd.net/e7/img/dict/kenej/audio/S-A92E9A0_E-A9307A8.mp3'
  );

  testCard.back.audio = new Audio('https://0.tqn.com/z/g/japanese/library/media/audio/saru.wav');
  testCard.back.text = '猿';

  return testCard;
};
