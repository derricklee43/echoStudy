import { MutableSnapshot } from 'recoil';
import { AuthJwt, authJwtState } from './auth-jwt';
import { useLocalStorage } from '../hooks/use-local-storage';

export const enum LocalStorageKeys {
  'authJwt' = 'auth-jwt',
}

export function initRecoilState(snapshot: MutableSnapshot) {
  const simpleLocalStorage = useLocalStorage();
  // load jwt tokens from user storage
  const authJwt = simpleLocalStorage.getObject<AuthJwt>(LocalStorageKeys.authJwt);
  if (authJwt) {
    snapshot.set(authJwtState, authJwt);
  }
}
