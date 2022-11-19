/* eslint-disable @typescript-eslint/no-explicit-any */

import { asUtcDate } from '@/helpers/time';

export interface DailyStudyRecord {
  date: Date;
  deckIds: number[];
}

export function jsonToDailyStudyRecord(obj: any): DailyStudyRecord {
  const dailyStudyActivity: DailyStudyRecord = {
    date: asUtcDate(obj['date']),
    deckIds: obj['decks'],
  };
  return dailyStudyActivity;
}
