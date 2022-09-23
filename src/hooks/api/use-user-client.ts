import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { Md5 } from 'ts-md5';
import { isFetchError, useFetchWrapper } from './use-fetch-wrapper';
import { ECHOSTUDY_API_URL } from '../../helpers/api';
import {
  IdentityError,
  isRegisterSuccess,
  RegisterSuccess,
  RegisterUserInfo,
  registerUserInfoToJson,
} from '../../models/register-user';
import { paths } from '../../routing/paths';
import {
  AuthJwt,
  authJwtState,
  authJwtToJson,
  isAuthJwt,
  jsonToAuthJwt,
} from '../../state/auth-jwt';
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
    register,
    login,
    loginDebug, // remove this once we have user login page
    logout,

    getProfilePictureUrl,
  };

  /**
   * POST: /Register
   * Registers a new user. If successful, returns an object with 'id' (the user ID).
   * Otherwise, an array of IdentityErrors (object with 'code' and 'description').
   */
  async function register(userInfo: RegisterUserInfo): Promise<
    | {
        statusCode: 200;
        response: RegisterSuccess;
      }
    | {
        statusCode: 400;
        response: IdentityError[];
      }
    | undefined
  > {
    const numRetries = 0;

    try {
      const payload = registerUserInfoToJson(userInfo);
      const response = await fetchWrapper.post('/Register', payload, numRetries);
      if (isRegisterSuccess(response)) {
        return { statusCode: 200, response };
      } else {
        throw new Error('Expected register success to have id (userId), but got none');
      }
    } catch (error) {
      // data is an array of IdentityErrors
      if (isFetchError(error) && error.statusCode === 400) {
        if (Array.isArray(error.response)) {
          return { statusCode: 400, response: error.response };
        } else {
          throw new Error('Expected identity errors, but got none');
        }
      }
    }
  }

  /**
   * POST: /Authenticate (or /Refresh if auth JWT in local storage already exists)
   * @side_effect Writes the auth JWT to local storage and recoil atom state
   * @returns True if no user credentials were correct and the side-effect occurred, otherwise false.
   */
  async function login(email: string, password: string): Promise<boolean> {
    const numRetries = 0; // don't retry (e.g. 401 means incorrect user creds)

    // if jwt exists, we just early exit
    // the fetch wrapper can refresh when it is actually invalid
    if (isAuthJwt(authJwt)) {
      return true;
    }

    // authenticate the user
    try {
      const payload = {
        username: email,
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
    if (!isAuthJwt(authJwt)) {
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

  function logout() {
    simpleLocalStorage.remove(LocalStorageKeys.authJwt);
    setAuthJwt(undefined);
    navigate(paths.home, { replace: true }); // todo: logout page?
  }

  function getProfilePictureUrl(email: string): string {
    // if the email isn't linked with Gravatar, the `d=identicon` query param generates a random unique img
    // we do this to avoid displaying the default boring Gravatar icon; instead, a unique one to the email hash
    const emailHash = Md5.hashStr(email.trim().toLowerCase());
    return `https://gravatar.com/avatar/${emailHash}?d=identicon`;
  }
}
