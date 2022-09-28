import { atom, selector } from 'recoil';
import { ECHOSTUDY_API_URL } from '../helpers/api';
import { objectSchemaSimple } from '../helpers/validator';

///////////////
/// AuthJwt ///
///////////////

export interface AuthJwt {
  accessToken: string;
  refreshToken: string;
}

export const authJwtState = atom<AuthJwt | undefined>({
  key: 'authJwtState',
  default: undefined,
});

////////////////
/// UserInfo ///
////////////////

export interface UserInfo {
  username: string;
  email: string;
  phoneNumber?: string;
}

export const userInfoStateAsync = selector<UserInfo | undefined>({
  key: 'userInfoStateAsync',
  get: async ({ get }) => {
    const authJwt = get(authJwtState);

    if (!isAuthJwt(authJwt)) {
      return undefined;
    }

    // we unfortuantely cannot use `useFetchWrapper` since that adds hooks (breaks rule of hooks)
    // either we replace this selector with effects in a nested component that updates this atom
    // or we write a new fetcher to avoid using stateful hooks (which doesn't seem really possible)
    try {
      const response = await fetch(`${ECHOSTUDY_API_URL}/users`, {
        method: 'GET',
        headers: {
          ...{ Authorization: `Bearer ${authJwt.accessToken}` },
        },
      });
      const userInfo = await response.json();

      return { ...userInfo, phoneNumber: userInfo.phoneNumber ?? undefined };
    } catch (error) {
      console.error('An error occurred while resolving userInfoState selector:', error);
      return undefined;
    }
  },
});

////////////////////////
/// helper functions ///
////////////////////////

export const isAuthJwt = objectSchemaSimple<AuthJwt>({
  accessToken: 'string',
  refreshToken: 'string',
});

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
