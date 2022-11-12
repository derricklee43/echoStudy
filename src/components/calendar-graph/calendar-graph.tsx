import React from 'react';
import { ArrowIcon } from '@/assets/icons/arrow-icon/arrow-icon';
import { Button } from '@/components/button/button';
import './calendar-graph.scss';

export type DailyData = [Date, number];

interface CalendarGraphProps {
  className?: string;
  calendarData: DailyData[];
  lowThreshold?: number;
  mediumThreshold?: number;
  highThreshold?: number;
  title: string;
  year: number;
  onYearChange: (year: number) => void;
}

export const CalendarGraph = ({
  className = '',
  calendarData,
  lowThreshold = 1,
  mediumThreshold = 3,
  highThreshold = 5,
  title,
  year,
  onYearChange,
}: CalendarGraphProps) => {
  const MAX_YEAR = new Date().getFullYear();

  if (year > MAX_YEAR) {
    throw Error(`year cannot exceed current year: ${MAX_YEAR}`);
  }

  const cellStyling = {
    base: 'cg-base-cell',
    low: 'cg-base-cell cg-low-cell',
    medium: 'cg-base-cell cg-med-cell',
    high: 'cg-base-cell cg-high-cell',
    hidden: 'cg-base-cell cg-hidden-cell',
  };

  const currentYearCalendarData = getCurrentYearCalendarData();
  const monthLabels = getMonthLabels();
  const dayLabels = getWeekDayLabels();
  const annualCells = getAnnualCells();
  const yearInput = getYearInput();
  const graphLegend = getGraphLegend();

  return (
    <div className={`calendar-graph ${className}`}>
      <h3 className="cg-title">{title}</h3>
      {monthLabels}
      <div className="calendar-block">
        {dayLabels}
        <div className="cg-cells">{annualCells}</div>
      </div>
      <div className="cg-footer">
        <div className="cg-foot-left-placeholder" />
        {yearInput}
        {graphLegend}
      </div>
    </div>
  );

  function getGraphLegend() {
    return (
      <div className="cg-legend">
        less <div className={`cg-legend-cell ${cellStyling.base}`} />
        <div className={`cg-legend-cell ${cellStyling.low}`} />
        <div className={`cg-legend-cell ${cellStyling.medium}`} />
        <div className={`cg-legend-cell ${cellStyling.high}`} />
        more
      </div>
    );
  }

  function getYearInput() {
    const isMaxYear = year === MAX_YEAR;
    return (
      <div className="cg-year-input">
        <Button onClick={() => onYearChange(year - 1)} variant="invisible">
          <ArrowIcon variant="light" className="cg-left-arrow" />
        </Button>
        {year}
        <Button onClick={() => onYearChange(year + 1)} variant="invisible" disabled={isMaxYear}>
          <ArrowIcon variant={isMaxYear ? 'grey' : 'light'} className="cg-right-arrow" />
        </Button>
      </div>
    );
  }

  function getMonthLabels() {
    const monthPairs = [
      ['jan', 'feb'],
      ['mar', 'apr'],
      ['may', 'jun'],
      ['jul', 'aug'],
      ['sep', 'oct'],
      ['nov', 'dec'],
    ];

    const monthPairLabels = monthPairs.map(([m1, m2]) => (
      <div className="month-pair" key={m1}>
        <div className="first-month cg-label">{m1}</div>
        <div className="second-month cg-label">{m2}</div>
      </div>
    ));

    return (
      <div className="month-labels">
        <div className="cg-label"></div>
        {monthPairLabels}
      </div>
    );
  }

  function getWeekDayLabels() {
    const days = ['sun', 'weds', 'sat'];
    const dayLabels = days.map((day) => (
      <div key={day} className="day-label">
        {day}
      </div>
    ));
    return <div className="day-labels">{dayLabels}</div>;
  }

  function getAnnualCells() {
    const weeks = Array(53).fill('');
    return weeks.map((_, w) => (
      <div key={w} className="cg-week">
        {getWeekCells(w)}
      </div>
    ));
  }

  function getWeekCells(w: number) {
    const days = Array(7).fill('');
    return days.map((_, d) => <div key={d} className={getCellClassName(w, d)} />);
  }

  function getCellClassName(w: number, d: number) {
    const leapYearOffset = year % 4 === 0 ? 1 : 0;
    const firstLastDay = new Date(year, 0, 1).getDay();
    const score = currentYearCalendarData[getCellDayNumber(w, d)];

    if ((w === 0 && d < firstLastDay) || (w === 52 && d > firstLastDay + leapYearOffset)) {
      return cellStyling.hidden;
    }

    if (score >= highThreshold) {
      return cellStyling.high;
    } else if (score >= mediumThreshold) {
      return cellStyling.medium;
    } else if (score >= lowThreshold) {
      return cellStyling.low;
    }
    return cellStyling.base;
  }

  function getCurrentYearCalendarData() {
    const currentYearCalendarData: Record<number, number> = {};
    const filteredCalendarData = calendarData.filter(([date, _]) => date.getFullYear() === year);

    filteredCalendarData.forEach(([date, score]) => {
      const dayNumber = dateToDayNumber(date);
      currentYearCalendarData[dayNumber] = score;
    });

    return currentYearCalendarData;
  }

  function getCellDayNumber(w: number, d: number) {
    const dayOffset = new Date(year, 0, 1).getDay();
    return w * 7 + d - dayOffset;
  }

  function dateToDayNumber(date: Date) {
    const jan1Utc = Date.UTC(date.getFullYear(), 0, 0);
    const utcDate = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
    return (utcDate - jan1Utc) / 24 / 60 / 60 / 1000 - 1;
  }
};
