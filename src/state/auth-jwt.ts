import { atom } from 'recoil';

export interface AuthJwt {
  accessToken: string;
  refreshToken: string;
}

export const authJwtState = atom<AuthJwt | undefined>({
  key: 'authJwtState',
  default: undefined,
});

////////////////////////
/// helper functions ///
////////////////////////

export function jsonToAuthJwt(json: any): AuthJwt {
  return {
    accessToken: json['token'],
    refreshToken: json['refreshToken'],
  };
}

export function authJwtToJson(authJwt: AuthJwt): Record<string, string> {
  return {
    token: authJwt.accessToken,
    refreshToken: authJwt.refreshToken,
  };
}
