import { useRecoilValue } from 'recoil';
import { ECHOSTUDY_API_URL } from '../../helpers/api';
import { objectSchemaSimple } from '../../helpers/validator';
import { oauth2JwtState } from '../../state/oauth2-jwt';

export interface FetchError {
  statusCode: number;
  message: string;
}

export const isFetchError = objectSchemaSimple<FetchError>({
  statusCode: 'number',
  message: 'string',
});

/**
 * Fetch wrapper that handles user authentication and automatic token renewal per request.
 * highly inspired by: https://jasonwatmore.com/post/2021/09/07/react-recoil-jwt-authentication-tutorial-and-example
 *
 * @param prependApiUrl url to prepend to all requests
 */
export function useFetchWrapper(prependApiUrl?: string) {
  const authJwt = useRecoilValue(oauth2JwtState);

  return {
    get: request('GET'),
    post: request('POST'),
    put: request('PUT'),
    delete: request('DELETE'),
  };

  function request(method: string) {
    return async function (url: string, body?: object, numRetries = 1) {
      return _retryFetch(url, method, body, numRetries);
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
    const resolvedUrl = prependApiUrl ? prependApiUrl + url : url;
    const response = await fetch(resolvedUrl, {
      method: method,
      headers: {
        ...maybeContentTypeHeader,
        ...authHeader(resolvedUrl),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (response.ok) {
      return parseResponseForText(response);
    } else {
      const statusCode = response.status;
      switch (statusCode) {
        // jwt expired
        case 401:
          // TODO: refresh token before retrying
          break;

        default:
          const retriesLeft = retries - 1;
          if (retriesLeft < 0) {
            const error: FetchError = {
              statusCode,
              message: `Received ${statusCode} when trying to reach ${url}`,
            };
            return Promise.reject(error);
          }
          return _retryFetch(url, method, body, retriesLeft);
      }
    }
  }

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  async function parseResponseForText(response: Response): Promise<any> {
    const text = await response.text();
    const data = text && JSON.parse(text);
    return data;
  }

  function authHeader(url: string): Record<string, string> {
    const isEchoStudyApiUrl = url.startsWith(ECHOSTUDY_API_URL);

    if (authJwt && isEchoStudyApiUrl) {
      const accessToken = authJwt.accessToken;
      return { Authorization: `Bearer ${accessToken}` };
    }

    return {};
  }
}
