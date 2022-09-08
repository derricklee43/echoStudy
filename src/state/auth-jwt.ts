import { atom } from 'recoil';

export interface AuthJwt {
  accessToken: string;
  refreshToken: string;
}

export const authJwtState = atom<AuthJwt | undefined>({
  key: 'authJwtState',
  default: undefined,
});
