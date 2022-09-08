import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { isFetchError, useFetchWrapper } from './use-fetch-wrapper';
import { ECHOSTUDY_API_URL } from '../../helpers/api';
import { paths } from '../../routing/paths';
import { AuthJwt, authJwtState, authJwtToJson, jsonToAuthJwt } from '../../state/auth-jwt';
import { LocalStorageKeys } from '../../state/init';
import { useLocalStorage } from '../use-local-storage';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Client targetting endpoints for user related actions
 */
export function useUserClient() {
  const [authJwt, setAuthJwt] = useRecoilState(authJwtState);
  const fetchWrapper = useFetchWrapper(ECHOSTUDY_API_URL);
  const simpleLocalStorage = useLocalStorage();
  const navigate = useNavigate();

  return {
    login,
    loginDebug, // remove this once we have user login page
    logout,
  };

  /**
   * POST: /Authenticate (or /Refresh if auth JWT in local storage already exists)
   * @side_effect Writes the auth JWT to local storage and recoil atom state
   * @returns True if no user credentials were correct and the side-effect occurred, otherwise false.
   */
  async function login(username: string, password: string): Promise<boolean> {
    const numRetries = 0; // don't retry (e.g. 401 means incorrect user creds)

    // if jwt exists, we just refresh the token and early exit
    if (authJwt && authJwt.accessToken && authJwt.refreshToken) {
      const refreshed = await _tryRefresh(authJwt);
      if (refreshed) {
        return true;
      }
    }

    // authenticate the user
    try {
      const payload = {
        username: username,
        password: password,
      };
      const jwtData = await fetchWrapper.post('/Authenticate', payload, numRetries);
      const authJwt = jsonToAuthJwt(jwtData);
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

  async function _tryRefresh(authJwt: AuthJwt) {
    const authJwtValid = authJwt && authJwt.accessToken && authJwt.refreshToken;
    if (!authJwtValid) {
      return false;
    }

    try {
      const numRetries = 0; // don't retry a refresh
      const payload = authJwtToJson(authJwt);
      const jwtData = await fetchWrapper.post('/Refresh', payload, numRetries);
      const newAuthJwt = jsonToAuthJwt(jwtData);

      simpleLocalStorage.upsert(LocalStorageKeys.authJwt, newAuthJwt);
      setAuthJwt(newAuthJwt);
      return true;
    } catch (error) {
      if (isFetchError(error)) {
        // invalid access/refresh token -- purge it
        if (error.statusCode === 400) {
          simpleLocalStorage.remove(LocalStorageKeys.authJwt);
          setAuthJwt(undefined);
        }
      }
      return false;
    }
  }

  async function loginDebug() {
    return login('johndoe@gmail.com', '123ABC!@#def');
  }

  async function logout() {
    simpleLocalStorage.remove(LocalStorageKeys.authJwt);
    setAuthJwt(undefined);
    navigate(paths.home, { replace: true }); // todo: logout page?
  }
}
