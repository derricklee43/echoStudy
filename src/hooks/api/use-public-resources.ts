import { ECHOSTUDY_API_URL } from '@/helpers/api';
import { JsonToPublicUser } from '@/models/public-user';
import { useFetchWrapper } from './use-fetch-wrapper';

/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Client targeting endpoints public resources
 */
export function usePublicResourcesClient() {
  const fetchWrapper = useFetchWrapper(ECHOSTUDY_API_URL);

  return { getPublicUsers, getPublicUser, getLessonIntroVideoUrl };

  // GET: /public/users
  async function getPublicUsers() {
    const response = await fetchWrapper.get('/public/users');
    const publicUsers = response.map(JsonToPublicUser);
    return publicUsers;
  }

  // GET: /public/users/username
  async function getPublicUser(username: string) {
    const response = await fetchWrapper.get(`/public/users/${username}`);
    const publicUser = JsonToPublicUser(response);
    return publicUser;
  }

  // GET: /public/userguide
  async function getLessonIntroVideoUrl() {
    const url = await fetchWrapper.get('/public/userguide');
    return url;
  }
}
