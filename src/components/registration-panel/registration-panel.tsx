import React from 'react';
import { UpToggle } from '../../animations/up-toggle';
import { LoadingIcon } from '../../assets/icons/loading-icon/loading-icon';
import { BubbleDivider } from '../../components/bubble-divider/bubble-divider';
import { Button } from '../../components/button/button';
import './registration-panel.scss';

interface RegistrationPanelProps {
  formHeader: string;
  submitLabel: string;
  swapPanelLabel: string;
  children: React.ReactNode;
  submitLabelLoading?: boolean;
  className?: string;
  onSubmitClick: () => void;
  onSwapPanelClick: () => void;
}

export const RegistrationPanel = ({
  formHeader,
  submitLabel,
  swapPanelLabel,
  children,
  submitLabelLoading = false,
  className = '',
  onSubmitClick,
  onSwapPanelClick,
}: RegistrationPanelProps) => {
  return (
    <div className={`registration-component-wrapper ${className}`}>
      <div className="registration-component">
        <div className="registration-header">echoStudy</div>
        <div className="registration-sub-header">learn anything. study anywhere.</div>
        <div className="registration-form">
          <div>{formHeader}</div>
          {children}
          <Button
            className="registration-button"
            disabled={submitLabelLoading}
            onClick={onSubmitClick}
          >
            {getSubmitButtonToggle(submitLabel)}
          </Button>
        </div>
        <BubbleDivider variantColor="dark" variantType="divider" label="or" />
        <div className="registration-button-group">
          <Button onClick={onSwapPanelClick} variant="dark" className="registration-button">
            {swapPanelLabel}
          </Button>
          <Button
            onClick={handleContinueAsGuestClick}
            variant="dark"
            className="registration-button"
          >
            continue as guest
          </Button>
        </div>
      </div>
    </div>
  );

  function getSubmitButtonToggle(defaultContent: string) {
    return (
      <UpToggle
        className="submit-form-container"
        showDefault={!submitLabelLoading}
        defaultContent={defaultContent}
        alternateContent={
          <div className="submit-form-loading">
            <LoadingIcon />
            <label>submitting</label>
          </div>
        }
      />
    );
  }

  function handleContinueAsGuestClick() {
    console.log('TODO: continue to site as guest');
  }
};
