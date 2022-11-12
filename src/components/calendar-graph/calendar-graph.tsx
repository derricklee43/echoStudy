import React, { useState } from 'react';
import { ArrowIcon } from '@/assets/icons/arrow-icon/arrow-icon';
import { Button } from '@/components/button/button';
import './calendar-graph.scss';

interface CalendarGraphProps {
  className?: string;
}

const MAX_YEAR = new Date().getFullYear();
export const CalendarGraph = ({ className = '' }: CalendarGraphProps) => {
  const [currentYear, setCurrentYear] = useState(MAX_YEAR);
  const monthLabels = getMonthLabels();
  const dayLabels = getWeekDayLabels();
  const annualCells = getAnnualCells();
  const yearInput = getYearInput();
  return (
    <div className="calendar-graph">
      <h3 className="cg-title">Daily Activity</h3>
      {monthLabels}
      <div className="calendar-block">
        {dayLabels}
        <div className="cg-cells">{annualCells}</div>
      </div>
      {yearInput}
    </div>
  );

  function getYearInput() {
    const isMaxYear = currentYear === MAX_YEAR;
    return (
      <div className="cg-year-control">
        <Button onClick={() => setCurrentYear(currentYear - 1)} variant="invisible">
          <ArrowIcon variant="light" className="cg-left-arrow" />
        </Button>
        {currentYear}
        <Button
          onClick={() => setCurrentYear(currentYear + 1)}
          variant="invisible"
          disabled={isMaxYear}
        >
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
    const weeks = Array(52).fill('');
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
    const firstLastDay = new Date(currentYear, 0, 1).getDay();

    const className = 'cg-day';
    if ((w === 0 && d < firstLastDay) || (w === 51 && d > firstLastDay)) {
      return className + ' hidden-day';
    }

    return className;
  }
};
