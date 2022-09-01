import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { enableFetchMocks } from 'jest-fetch-mock';
import { RecoilRoot } from 'recoil';
import { isFetchError, useFetchWrapper } from '../api/use-fetch-wrapper';

// provide fetchMock global and disable mocking initially
enableFetchMocks();
fetchMock.dontMock();

describe('useFetchWrapper', () => {
  // TEST_DOMAIN must be used, otherwise response is not mocked
  const TEST_DOMAIN = 'https://test.test';
  beforeEach(() => {
    fetchMock.doMockIf(/^https?:\/\/test.test.*$/);
  });

  it('should return response if received 200 (OK)', async () => {
    const fetchWrapper = setupFetchWrapper();

    fetchMock.mockResponseOnce(JSON.stringify({ data: '12345' }));
    const response = await fetchWrapper.get('/12345');
    expect(response.data).toBe('12345');
  });

  it('should respect numRetries if not 200 (OK)', async () => {
    const fetchWrapper = setupFetchWrapper();

    const error = JSON.stringify({ error: 'key expired' });
    const good = JSON.stringify({ data: '12345' });
    fetchMock.mockResponses(
      [error, { status: 401 }], // initial
      [good, { status: 200 }] // first retry
    );

    const numRetries = 1;
    const response = await fetchWrapper.get('/12345', undefined, numRetries);
    expect(response.data).toBe('12345');
  });

  it('should not retry past numRetries if not 200 (OK)', async () => {
    const fetchWrapper = setupFetchWrapper();

    const error = JSON.stringify({ error: 'error' });
    fetchMock.mockResponse(error, { status: 500 }); // never 200

    const numRetries = 20;
    const fetchPromise = fetchWrapper.get('/12345', undefined, numRetries);
    await expect(fetchPromise).rejects.toMatchPredicate(isFetchError);
  });

  function setupFetchWrapper() {
    const { result } = renderHook(() => useFetchWrapper(TEST_DOMAIN), {
      wrapper: ({ children }) => <RecoilRoot>{children}</RecoilRoot>,
    });
    return result.current;
  }
});
