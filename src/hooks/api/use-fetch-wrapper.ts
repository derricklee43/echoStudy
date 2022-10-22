import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { ECHOSTUDY_API_URL } from '@/helpers/api';
import { deferredPromise } from '@/helpers/promise';
import { isDefined, objectSchemaSimple } from '@/helpers/validator';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { paths } from '@/routing/paths';
import { AuthJwt, authJwtState, authJwtToJson, isAuthJwt, jsonToAuthJwt } from '@/state/auth-jwt';
import { LocalStorageKeys } from '@/state/init';

export interface FetchError {
  statusCode: number;
  message: string;
  response?: unknown;
}

export const isFetchError = objectSchemaSimple<FetchError>({
  statusCode: 'number',
  message: 'string',
});

// file scoped (static) promise lock on refreshes
let refreshPromiseLock: Promise<unknown> | undefined = undefined;

/**
 * Fetch wrapper that handles user authentication and automatic token renewal per request.
 * highly inspired by: https://jasonwatmore.com/post/2021/09/07/react-recoil-jwt-authentication-tutorial-and-example
 *
 * @param prependApiUrl url to prepend to all requests
 */
export function useFetchWrapper(prependApiUrl?: string) {
  const setAuthJwt = useSetRecoilState(authJwtState); // use _getCurrAuthJwt() for up-to-date value
  const simpleLocalStorage = useLocalStorage();
  const navigate = useNavigate();

  // abort any ongoing fetches on destroy/unmount
  const abortController = new AbortController();
  useEffect(() => {
    return () => {
      // always let an outgoing refresh finish before aborting
      if (refreshPromiseLock) {
        refreshPromiseLock.then(() => abortController.abort());
        refreshPromiseLock = undefined;
      } else {
        abortController.abort();
      }
    };
  }, []);

  return {
    get: request('GET'),
    post: request('POST'),
    put: request('PUT'),
    delete: request('DELETE'),
  };

  function request(method: string) {
    return async function (url: string, body?: object, numRetries = 1) {
      try {
        return await _retryFetch(url, method, body, numRetries);
      } catch (error) {
        const messagePrepend = `${url} --`;

        if (error instanceof DOMException && error.name == 'AbortError') {
          console.warn(messagePrepend, error.message);
          return; // don't rethrow
        }

        if (error instanceof Error || isFetchError(error)) {
          console.error(messagePrepend, error.message);
        }

        throw error;
      }
    };
  }

  ////////////////////////
  /// helper functions ///
  ////////////////////////

  async function _retryFetch(
    url: string,
    method: string,
    body: object | undefined,
    retries = 1
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    const maybeContentTypeHeader = body ? { 'Content-Type': 'application/json' } : undefined;

    // only prepend if url is NOT an absolute url
    let resolvedUrl = url;
    if (!url.includes('://') && isDefined(prependApiUrl)) {
      resolvedUrl = prependApiUrl + url;
    }

    const response = await fetch(resolvedUrl, {
      method: method,
      headers: {
        ...maybeContentTypeHeader,
        ...authHeader(resolvedUrl),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: abortController.signal,
    });

    if (response.ok) {
      return parseResponseForText(response);
    } else {
      const statusCode = response.status;
      const retriesLeft = retries - 1;

      // ensure we still have retries remaining
      if (retriesLeft < 0) {
        // intermediate step(s) before rejecting with FetchError
        try {
          await _middlewareFetchError(statusCode);
        } catch (error) {
          console.error('Error occurred during fetch error middleware', error);
        }

        const fetchError: FetchError = {
          statusCode: statusCode,
          message: `Received ${statusCode} when trying to reach ${url}`,
          response: await parseResponseForText(response).catch(() => ''),
        };
        return Promise.reject(fetchError);
      }

      // intermediate step(s) before retrying
      try {
        await _middlewareFetchRetry(statusCode);

        // there was a previous refresh going, block until it completes
        if (refreshPromiseLock) {
          await refreshPromiseLock;
          refreshPromiseLock = undefined;
        }
      } catch (error) {
        console.error('Error occurred during fetch retry middleware', error);
      }

      return _retryFetch(url, method, body, retriesLeft);
    }
  }

  // actions to perform before retrying
  async function _middlewareFetchRetry(statusCode: number) {
    switch (statusCode) {
      // jwt expired, refresh the token before retrying
      case 401:
        if (refreshPromiseLock) {
          return;
        }

        const authJwt = _getCurrAuthJwt();
        if (isAuthJwt(authJwt)) {
          const payload = authJwtToJson(authJwt);
          const deferred = deferredPromise();

          try {
            refreshPromiseLock = deferred.promise;
            const jwtData = await _retryFetch('/Refresh', 'POST', payload, 0);
            const newAuthJwt = jsonToAuthJwt(jwtData);

            simpleLocalStorage.upsert(LocalStorageKeys.authJwt, newAuthJwt);
            setAuthJwt(newAuthJwt);
          } finally {
            deferred.resolve();
          }
        }
        break;
    }
  }

  // actions to perform before throwing the fetch error
  async function _middlewareFetchError(statusCode: number) {
    switch (statusCode) {
      // implies jwt refresh failed
      // couldn't have happened if /Refresh was 200 (OK)
      case 401:
        simpleLocalStorage.remove(LocalStorageKeys.authJwt);
        setAuthJwt(undefined);
        navigate(paths.signIn);
        break;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function parseResponseForText(response: Response): Promise<any> {
    const contentType = response.headers.get('Content-Type')?.toLowerCase();
    const text = await response.text();
    if (!text) {
      return undefined;
    }

    // NOTE: this needs to be updated to include more types as needed
    // (e.g. image/jpeg, text/blob, etrc.)
    if (contentType?.startsWith('application/json')) {
      return JSON.parse(text);
    } else if (contentType?.startsWith('text/plain')) {
      return text;
    } else {
      throw Error(`Received unsupport response type: ${contentType}`);
    }
  }

  function authHeader(url: string): Record<string, string> {
    const isEchoStudyApiUrl = url.startsWith(ECHOSTUDY_API_URL);

    const authJwt = _getCurrAuthJwt();
    if (authJwt && isEchoStudyApiUrl) {
      const accessToken = authJwt.accessToken;
      return { Authorization: `Bearer ${accessToken}` };
    }

    return {};
  }

  /**
   * We don't want to subscribe to the stateful value with useRecoilState/Value.
   * There are numerous issues with this:
   *   - It becomes stale within async code (setting a new state, holding a stale ref, etc.)
   *   - This hook should never 'rerender', it is pure and stateless.
   *
   * The only disadvantage of this is every time we update the auth JWT atom,
   * we will also need update the local storage.
   */
  function _getCurrAuthJwt(): AuthJwt | undefined {
    return simpleLocalStorage.getObject<AuthJwt>(LocalStorageKeys.authJwt);
  }
}
