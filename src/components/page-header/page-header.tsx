import './page-header.scss';
import React from 'react';
import { Button } from '../button/button';
import { BackArrowIcon } from '../../assets/icons/back-arrow-icon/back-arrow-icon';

interface PageHeaderProps {
  label: string;
  onGoBackClick: (event: React.MouseEvent) => void;
}

export const PageHeader = ({ label, onGoBackClick }: PageHeaderProps) => {
  return (
    <div className="page-header">
      <Button variant="invisible" onClick={onGoBackClick} className="go-back-button">
        <BackArrowIcon /> go back
      </Button>
      <label>{label}</label>
    </div>
  );
};
