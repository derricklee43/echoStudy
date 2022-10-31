import { MutableSnapshot } from 'recoil';
import { clamp } from '@/helpers/func';
import { toNumberOrElse } from '@/helpers/validator';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { AuthJwt, authJwtState } from './auth-jwt';

export const enum LocalStorageKeys {
  authJwt = 'auth-jwt', // string
  volumeLevelPercent = 'volume-level-percent', // number [0-100]
  attemptPauseLength = 'attempt-pause-length', // number (in seconds)
  advanceOnlyOnAttempt = 'advance-only-on-attempt', // boolean
}

export function initRecoilState(snapshot: MutableSnapshot) {
  const simpleLocalStorage = useLocalStorage();
  // load jwt tokens from user storage
  const authJwt = simpleLocalStorage.getObject<AuthJwt>(LocalStorageKeys.authJwt);
  if (authJwt) {
    snapshot.set(authJwtState, authJwt);
  }
}

export function initGlobalState() {
  const simpleLocalStorage = useLocalStorage();

  // load volume to Howler.js
  const volumeLevelString = simpleLocalStorage.getString(LocalStorageKeys.volumeLevelPercent);
  const volumeLevel = clamp(toNumberOrElse(volumeLevelString, 100), 0, 100);
  Howler.volume(volumeLevel / 100); // [0.0, 1.0]
}
