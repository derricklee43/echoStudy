import React from 'react';
import { BackArrowIcon } from '@/assets/icons/back-arrow-icon/back-arrow-icon';
import { Button } from '@/components/button/button';
import './page-header.scss';

interface PageHeaderProps {
  label: string;
  goBackLabel: string;
  onGoBackClick: (event: React.MouseEvent) => void;
}

export const PageHeader = ({ label, goBackLabel, onGoBackClick }: PageHeaderProps) => {
  return (
    <div className="c-page-header">
      <Button variant="invisible" onClick={onGoBackClick} className="go-back-button">
        <BackArrowIcon /> {goBackLabel}
      </Button>
      <label>{label}</label>
    </div>
  );
};
