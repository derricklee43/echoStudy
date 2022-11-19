import { ECHOSTUDY_API_URL } from '@/helpers/api';
import { jsonToDailyStudyRecord } from '@/models/daily-study-record';
import { JsonToPublicUser } from '@/models/public-user';
import { useFetchWrapper } from './use-fetch-wrapper';

/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Client targeting endpoints public users
 */
export function useStudyActivity() {
  const fetchWrapper = useFetchWrapper(ECHOSTUDY_API_URL);

  return { getAnnualDailyStudyRecords };

  // GET: /studyActivity/
  async function getAnnualDailyStudyRecords(year: number) {
    const jan1 = getJanuaryFirstOfYear(year).toDateString();
    const dec31 = getDecemberThirtyFirstOfYear(year).toDateString();
    const response: any[] = await fetchWrapper.get(
      `/studyActivity?startDate=${jan1}&endDate=${dec31}`
    );
    return response.map(jsonToDailyStudyRecord);
  }

  function getJanuaryFirstOfYear(year: number) {
    return new Date(year, 0, 1);
  }

  function getDecemberThirtyFirstOfYear(year: number) {
    return new Date(year, 11, 31);
  }
}
