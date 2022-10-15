import { ECHOSTUDY_API_URL } from '@/helpers/api';
import { asUtcDate } from '@/helpers/time';
import { Deck } from '@/models/deck';
import { useFetchWrapper } from './use-fetch-wrapper';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Client targetting endpoints for /Decks
 */
export function useUsersClient() {
  const fetchWrapper = useFetchWrapper(ECHOSTUDY_API_URL);

  return {
    // queries
    getUsers,
    getUser,
  };

  async function getUsers() {
    const users = await fetchWrapper.get('/users/names');
    return users;
  }

  async function getUser(userName: string) {
    const user = await fetchWrapper.get(`/users/${userName}`);
    return user;
  }
}
