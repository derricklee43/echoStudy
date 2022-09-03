import { atom } from 'recoil';

// TODO: backend does not send refreshToken so we're just going to make that value optional for now
export interface AuthJwt {
  accessToken: string;
  refreshToken?: string;
}

export const oauth2JwtState = atom<AuthJwt | undefined>({
  key: 'oauth2JwtState',
  default: undefined,
});
