import { renderHook } from '@testing-library/react-hooks';
import { enableFetchMocks } from 'jest-fetch-mock';
import { withTestRoots } from '@/app.test';
import { isFetchError, useFetchWrapper } from '@/hooks/api/use-fetch-wrapper';

// provide fetchMock global and disable mocking initially
enableFetchMocks();
fetchMock.dontMock();

describe('useFetchWrapper', () => {
  const jsonContent = { 'content-type': 'application/json' };
  const textContent = { 'content-type': 'text/plain' };

  // TEST_DOMAIN must be used, otherwise response is not mocked
  const TEST_DOMAIN = 'https://test.test';

  beforeEach(() => {
    fetchMock.doMockIf(/^https?:\/\/test.test.*$/);
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  it('should return response if received 200 (OK)', async () => {
    const fetchWrapper = setupFetchWrapper();

    fetchMock.mockResponseOnce(JSON.stringify({ data: '12345' }), {
      headers: { ...jsonContent },
    });
    const response = await fetchWrapper.get('/12345');
    expect(response.data).toBe('12345');
  });

  it('should respect numRetries if not 200 (OK)', async () => {
    const fetchWrapper = setupFetchWrapper();

    const error = JSON.stringify({ error: 'key expired' });
    const good = JSON.stringify({ data: '12345' });
    fetchMock.mockResponses(
      [error, { status: 500, headers: { ...jsonContent } }], // initial
      [good, { status: 200, headers: { ...jsonContent } }] // first retry
    );

    const numRetries = 1;
    const response = await fetchWrapper.get('/12345', undefined, numRetries);
    expect(response.data).toBe('12345');
  });

  it('should not retry past numRetries if not 200 (OK)', async () => {
    const fetchWrapper = setupFetchWrapper();

    const error = JSON.stringify({ error: 'error' });
    fetchMock.mockResponse(error, { status: 500, headers: { ...jsonContent } }); // never 200

    const numRetries = 20;
    const fetchPromise = fetchWrapper.get('/12345', undefined, numRetries);
    await expect(fetchPromise).rejects.toMatchPredicate(isFetchError);
  });

  it('should handle different content types', async () => {
    const fetchWrapper = setupFetchWrapper();

    const jsonResponse = JSON.stringify({ a: 'a' });
    const textResponse = 'a';
    fetchMock.mockResponses(
      [jsonResponse, { status: 200, headers: { ...jsonContent } }],
      [textResponse, { status: 200, headers: { ...textContent } }],
      [textResponse, { status: 200, headers: { 'content-type': 'invalid/invalid' } }]
    );

    const fetchNext = () => fetchWrapper.get('/12345');
    await expect(fetchNext()).resolves.toEqual({ a: 'a' }); // application/json
    await expect(fetchNext()).resolves.toEqual('a'); // text/plain
    await expect(fetchNext()).rejects.toThrow(); // invalid/invalid
  });

  it('should override prepend url if the request contains an absolute url', async () => {
    const fetchWrapper = setupFetchWrapper();

    fetchMock.mockResponseOnce(JSON.stringify({ data: '12345' }), {
      headers: { ...jsonContent },
    });
    //  https://test.test.noprependpls (which passes mock regex)
    const absoluteUrl = TEST_DOMAIN + '.noprependpls';
    await fetchWrapper.get(absoluteUrl);

    // expect(fetchMock).toBeCalledWith(absoluteUrl);
    expect(fetchMock.mock.calls[0][0]).toEqual(absoluteUrl);
  });

  function setupFetchWrapper() {
    const { result } = renderHook(() => useFetchWrapper(TEST_DOMAIN), {
      wrapper: ({ children }) => withTestRoots(children),
    });
    return result.current;
  }
});
