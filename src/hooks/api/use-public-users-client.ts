import { ECHOSTUDY_API_URL, ensureHttps } from '@/helpers/api';
import { asUtcDate } from '@/helpers/time';
import { isDefined, isNumber } from '@/helpers/validator';
import { Card, createNewCard } from '@/models/card';
import { LazyAudio } from '@/models/lazy-audio';
import { PublicUser } from '@/models/public-user';
import { NewCardsResponse, UpdateCardScoreRequest } from './interfaces/card-data';
import { useAccountClient } from './use-account-client';
import { useFetchWrapper } from './use-fetch-wrapper';

/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Client targeting endpoints public users
 */
export function usePublicUsersClient() {
  const fetchWrapper = useFetchWrapper(ECHOSTUDY_API_URL);
  const { getProfilePictureUrl } = useAccountClient();

  return { getPublicUsers };

  // GET: /Users/names
  async function getPublicUsernames() {
    const usernames: string[] = await fetchWrapper.get('/users/names');
    return usernames;
  }

  // GET: /Users/username
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
