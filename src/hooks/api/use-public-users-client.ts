import { ECHOSTUDY_API_URL } from '@/helpers/api';
import { JsonToPublicUser } from '@/models/public-user';
import { useFetchWrapper } from './use-fetch-wrapper';

/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Client targeting endpoints public users
 */
export function usePublicUsersClient() {
  const fetchWrapper = useFetchWrapper(ECHOSTUDY_API_URL);

  return { getPublicUsers, getPublicUser };

  // GET: Public/Users/
  async function getPublicUsers() {
    const response = await fetchWrapper.get('/Public/users');
    const publicUsers = response.map(JsonToPublicUser);
    return publicUsers;
  }

  async function getPublicUser(username: string) {
    const response = await fetchWrapper.get(`/Public/users/${username}`);
    const publicUser = JsonToPublicUser(response);
    return publicUser;
  }
}
