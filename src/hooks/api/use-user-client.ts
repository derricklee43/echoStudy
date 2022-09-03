import { useSetRecoilState } from 'recoil';
import { isFetchError, useFetchWrapper } from './use-fetch-wrapper';
import { ECHOSTUDY_API_URL } from '../../helpers/api';
import { LocalStorageKeys } from '../../state/init';
import { oauth2JwtState } from '../../state/oauth2-jwt';
import { useLocalStorage } from '../use-local-storage';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Client targetting endpoints for user related actions
 */
export function useUserClient() {
  const setAuthJwt = useSetRecoilState(oauth2JwtState);
  const fetchWrapper = useFetchWrapper(ECHOSTUDY_API_URL);
  const simpleLocalStorage = useLocalStorage();

  return {
    login,
    logout,
  };

  // POST: /Authenticate
  // Returns false if an error occurred or the user credentials were incorrect.
  async function login(username: string, password: string): Promise<boolean> {
    const payload = {
      usename: username,
      password: password,
    };
    const numRetries = 0; // don't retry; 401 means incorrect user creds

    try {
      // TODO: when token refreshing is implemented, this should probably be an object
      // that contains both the access token as well as the refresh token
      const { accessToken } = await fetchWrapper.post('/Authenticate', payload, numRetries);
      const authJwt = {
        accessToken: accessToken,
        refreshToken: undefined,
      };
      simpleLocalStorage.upsert(LocalStorageKeys.authJwt, authJwt);
      setAuthJwt(authJwt);
    } catch (error) {
      if (isFetchError(error)) {
        console.error(error.message);
      }
      return false;
    }

    return true;
  }

  async function logout() {
    // TODO: inform server to probably invalidate access token
    throw new Error('logout not implemented');
  }
}
