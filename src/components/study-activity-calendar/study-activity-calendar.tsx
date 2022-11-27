import React, { useEffect, useState } from 'react';
import { CalendarGraph, DailyScore } from '@/components/calendar-graph/calendar-graph';
import { useStudyActivity } from '@/hooks/api/use-study-activity';
import './study-activity-calendar.scss';

// year -> DailyScore[]
type AnnualDailyScores = Record<number, DailyScore[]>;

interface StudyActivityCalendarProps {
  className?: string;
}

export const StudyActivityCalendar = ({ className = '' }: StudyActivityCalendarProps) => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [annualDailyScores, setAnnualDailyScores] = useState<AnnualDailyScores>({});
  const { getAnnualDailyStudyRecords } = useStudyActivity();

  // fetch annual daily scores, first on load then on current year change
  useEffect(() => {
    fetchAnnualStudyRecordsAndRefresh(currentYear);
  }, [currentYear]);

  return (
    <CalendarGraph
      title="daily activity"
      className={`c-study-activity-calendar ${className}`}
      dailyScores={annualDailyScores[currentYear]}
      year={currentYear}
      onYearChange={setCurrentYear}
    />
  );

  async function fetchAnnualStudyRecordsAndRefresh(year: number) {
    if (annualDailyScores[year] !== undefined) {
      // already fetched the daily scores
      return;
    }

    const dailyStudyRecords = await getAnnualDailyStudyRecords(year);
    const dailyScores = dailyStudyRecords.map(({ date, deckIds }) => ({
      date,
      score: deckIds.length,
    }));
    const newAnnualStudyRecords = { ...annualDailyScores };
    newAnnualStudyRecords[year] = dailyScores;
    setAnnualDailyScores(newAnnualStudyRecords);
  }
};
