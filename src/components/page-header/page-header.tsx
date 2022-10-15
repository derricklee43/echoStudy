import React from 'react';
import './page-header.scss';

interface PageHeaderProps {
  label: string;
}

export const PageHeader = ({ label }: PageHeaderProps) => {
  return <div className="c-page-header">{label}</div>;
};
