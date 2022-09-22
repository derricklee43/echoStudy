import { atom } from 'recoil';

// hamburger menu navigation toggled
export const navToggledState = atom<boolean>({
  key: 'navToggledState',
  default: false,
});
