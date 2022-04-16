import { Card, createNewCard } from '../card';
import { CardContent, createNewCardContent } from '../card-content';

export const getTestFoxFront = (): CardContent => {
  const content = createNewCardContent();
  content.text = 'fox';
  content.audio = new Audio(
    'https://weblio.hs.llnwd.net/e7/img/dict/kenej/audio/S-C3906E2_E-C392F5C.mp3'
  );
  return content;
};

export const getTestFoxBack = (): CardContent => {
  const content = createNewCardContent();
  content.text = '狐';
  content.audio = new Audio('https://0.tqn.com/z/g/japanese/library/media/audio/kitsune.wav');
  return content;
};

export const getTestMonkeyFront = (): CardContent => {
  const content = createNewCardContent();
  content.text = 'monkey';
  content.audio = new Audio(
    'https://weblio.hs.llnwd.net/e7/img/dict/kenej/audio/S-A92E9A0_E-A9307A8.mp3'
  );
  return content;
};

export const getTestMonkeyBack = (): CardContent => {
  const content = createNewCardContent();
  content.text = '猿';
  content.audio = new Audio('https://0.tqn.com/z/g/japanese/library/media/audio/saru.wav');
  return content;
};

export const getTestMouseFront = (): CardContent => {
  const content = createNewCardContent();
  content.text = 'mouse';
  content.audio = new Audio(
    'https://weblio.hs.llnwd.net/e7/img/dict/kenej/audio/S-CBE8B66_E-CBEB33E.mp3'
  );
  return content;
};

export const getTestMouseBack = (): CardContent => {
  const content = createNewCardContent();
  content.text = 'ネズミ';
  content.audio = new Audio('https://0.tqn.com/z/g/japanese/library/media/audio/nezumi.wav');
  return content;
};
