/**
 * fetch() wrapper with useful helper functions
 */
export function useFetchWrapper() {
  // https://jasonwatmore.com/post/2021/09/07/react-recoil-jwt-authentication-tutorial-and-example
  /* eslint-disable @typescript-eslint/no-unused-vars */

  return {
    get: request('GET'),
    post: request('POST'),
    put: request('PUT'),
    delete: request('DELETE'),
  };

  function request(method: string) {
    // todo: fetch and then handleResponse
    throw new Error('Not implemented');
  }

  ////////////////////////
  /// helper functions ///
  ////////////////////////

  function handleResponse(response: Response) {
    // todo: handle response by converting to text()
    throw new Error('Not implemented');
  }

  function authHeader(url: string): Record<string, string> {
    // todo: return auth header with jwt if user is logged in and request is to the api url
    throw new Error('Not implemented');
  }
}
