import { ECHOSTUDY_API_URL } from '@/helpers/api';
import { JsonToPublicUser } from '@/models/public-user';
import { useFetchWrapper } from './use-fetch-wrapper';

/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Client targeting endpoints public users
 */
export function usePublicUsersClient() {
  const fetchWrapper = useFetchWrapper(ECHOSTUDY_API_URL);

  return { getPublicUsers, getPublicUsernames, getPublicUser };

  // GET: /Users/Names
  async function getPublicUsernames() {
    const usernames: string[] = await fetchWrapper.get('/users/names');
    return usernames;
  }

  // GET: /Users/Username
  async function getPublicUsers() {
    const usernames = await getPublicUsernames();
    const allUsersRequests = usernames.map((username) => fetchWrapper.get(`/users/${username}`));
    const allUserResponses = await Promise.all(allUsersRequests);
    const publicUsers = allUserResponses.map(JsonToPublicUser);
    return publicUsers;
  }

  async function getPublicUser(username: string) {
    const response = await fetchWrapper.get(`/users/${username}`);
    const publicUser = JsonToPublicUser(response);
    return publicUser;
  }
}
