/**
 * fetch() wrapper with useful helper functions
 *
 * @param prependApiUrl url to prepend to all requests
 */
export function useFetchWrapper(prependApiUrl?: string) {
  // https://jasonwatmore.com/post/2021/09/07/react-recoil-jwt-authentication-tutorial-and-example
  /* eslint-disable @typescript-eslint/no-unused-vars */

  return {
    get: request('GET'),
    post: request('POST'),
    put: request('PUT'),
    delete: request('DELETE'),
  };

  function request(method: string) {
    return async function (url: string, body?: object) {
      // only include header if `body` is non-empty
      const contentTypeHeader = body ? { 'Content-Type': 'application/json' } : undefined;
      const resolvedUrl = prependApiUrl ? prependApiUrl + url : url;

      const response = await fetch(resolvedUrl, {
        method: method,
        headers: { ...contentTypeHeader }, // todo: use auth header which includes JWT
        body: body && JSON.stringify(body),
      });

      return await handleResponse(response);
    };
  }

  ////////////////////////
  /// helper functions ///
  ////////////////////////

  async function handleResponse(response: Response) {
    const text = await response.text();
    const data = text && JSON.parse(text);

    if (!response.ok) {
      // todo: handle 401/403 for user auth, verify JWT token, if not redirect to /login
      const error = data?.message ?? response.statusText;
      console.error(error);
      return Promise.reject(error);
    }

    return data;
  }

  function authHeader(url: string): Record<string, string> {
    // todo: return auth header with jwt if user is logged in and request is to the api url
    throw new Error('Not implemented');
  }
}
