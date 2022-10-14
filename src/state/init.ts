import { MutableSnapshot } from 'recoil';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { AuthJwt, authJwtState } from './auth-jwt';

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
