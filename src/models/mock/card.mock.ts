import { Card } from '../card';

export const getTestFoxCard = (id: number): Card => ({
  id: id,
  front: {
    language: 'English',
    audio: new Audio('https://weblio.hs.llnwd.net/e7/img/dict/kenej/audio/S-C3906E2_E-C392F5C.mp3'),
    text: 'fox',
  },
  back: {
    language: 'Japanese',
    audio: new Audio('https://0.tqn.com/z/g/japanese/library/media/audio/kitsune.wav'),
    text: '狐',
  },
});

export const getTestMouseCard = (id: number): Card => ({
  id: id,
  front: {
    language: 'English',
    audio: new Audio('https://weblio.hs.llnwd.net/e7/img/dict/kenej/audio/S-CBE8B66_E-CBEB33E.mp3'),
    text: 'mouse',
  },
  back: {
    language: 'Japanese',
    audio: new Audio('https://0.tqn.com/z/g/japanese/library/media/audio/nezumi.wav'),
    text: 'ネズミ',
  },
});

export const getTestMonkeyCard = (id: number): Card => ({
  id: id,
  front: {
    language: 'English',
    audio: new Audio('https://weblio.hs.llnwd.net/e7/img/dict/kenej/audio/S-A92E9A0_E-A9307A8.mp3'),
    text: 'monkey',
  },
  back: {
    language: 'Japanese',
    audio: new Audio('https://0.tqn.com/z/g/japanese/library/media/audio/saru.wav'),
    text: '猿',
  },
});
