import { ECHOSTUDY_API_URL } from '@/helpers/api';
import { PublicUser } from '@/models/public-user';
import { useFetchWrapper } from './use-fetch-wrapper';

/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Client targeting endpoints public users
 */
export function usePublicUsersClient() {
  const fetchWrapper = useFetchWrapper(ECHOSTUDY_API_URL);

  return { getPublicUsers };

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
    const publicUsers = allUserResponses.map(jsonToPublicUser);
    return publicUsers;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function jsonToPublicUser(obj: any): PublicUser {
    return {
      username: obj.username,
      publicDecks: obj.decks,
    };
  }
}
