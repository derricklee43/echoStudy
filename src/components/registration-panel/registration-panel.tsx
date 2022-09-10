import React from 'react';
import { BubbleDivider } from '../../components/bubble-divider/bubble-divider';
import { Button } from '../../components/button/button';
import './registration-panel.scss';

interface RegistrationPanelProps {
  formHeader: string;
  submitLabel: string;
  children: React.ReactNode;
  swapPanelLabel: string;
  onSubmitClick: () => void;
  onSwapPanelClick: () => void;
}

export const RegistrationPanel = ({
  formHeader,
  submitLabel,
  children,
  swapPanelLabel,
  onSubmitClick,
  onSwapPanelClick,
}: RegistrationPanelProps) => {
  return (
    <div className="registration-component">
      <div className="registration-header">echoStudy</div>
      <div className="registration-sub-header">learn anything. study anywhere.</div>
      <div className="registration-form">
        <div>{formHeader}</div>
        {children}
        <Button onClick={onSubmitClick} className="registration-button">
          {submitLabel}
        </Button>
      </div>
      <BubbleDivider variantColor="dark" variantType="divider" label="or" />
      <div className="registration-button-group">
        <Button onClick={onSwapPanelClick} variant="dark" className="registration-button">
          {swapPanelLabel}
        </Button>
        <Button onClick={handleContinueAsGuestClick} variant="dark" className="registration-button">
          continue as guest
        </Button>
      </div>
    </div>
  );

  function handleContinueAsGuestClick() {
    console.log('TODO: continue to site as guest');
  }
};
