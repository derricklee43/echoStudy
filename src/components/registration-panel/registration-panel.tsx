import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fade } from '@/animations/fade';
import { UpToggle } from '@/animations/up-toggle';
import { LoadingIcon } from '@/assets/icons/loading-icon/loading-icon';
import { BubbleDivider } from '@/components/bubble-divider/bubble-divider';
import { Button } from '@/components/button/button';
import { useUserClient } from '@/hooks/api/use-user-client';
import { paths } from '@/routing/paths';
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
  const { loginDebug } = useUserClient();
  const navigate = useNavigate();

  const [isContinuingAsGuest, setIsContinuingAsGuest] = useState(false);

  return (
    <div className={`registration-component-wrapper ${className}`}>
      <Fade>
        <div className="registration-component">
          <div className="registration-header">echoStudy</div>
          <div className="registration-sub-header">learn anything. study anywhere.</div>
          <div className="registration-form">
            <div>{formHeader}</div>
            {children}
            <Button
              className="registration-button"
              disabled={submitLabelLoading || isContinuingAsGuest}
              onClick={onSubmitClick}
            >
              {getSubmitButtonToggle()}
            </Button>
          </div>
          <BubbleDivider variantColor="dark" variantType="divider" label="or" />
          <div className="registration-button-group">
            <Button onClick={onSwapPanelClick} variant="dark" className="registration-button">
              {swapPanelLabel}
            </Button>
            <Button
              className="registration-button"
              variant="dark"
              disabled={submitLabelLoading || isContinuingAsGuest}
              onClick={handleContinueAsGuestClick}
            >
              {getContinueAsGuestToggle()}
            </Button>
          </div>
        </div>
      </Fade>
    </div>
  );

  function getSubmitButtonToggle() {
    return (
      <UpToggle
        className="submit-form-toggle"
        showDefault={!submitLabelLoading}
        defaultContent={submitLabel}
        alternateContent={
          <div className="submit-form-loading">
            <LoadingIcon />
            <label>submitting</label>
          </div>
        }
      />
    );
  }

  function getContinueAsGuestToggle() {
    return (
      <UpToggle
        className="continue-as-guest-toggle"
        showDefault={!isContinuingAsGuest}
        defaultContent="continue as guest"
        alternateContent={
          <div className="continue-as-guest-loading">
            <LoadingIcon />
            <label>logging in</label>
          </div>
        }
      />
    );
  }

  async function handleContinueAsGuestClick() {
    setIsContinuingAsGuest(true);

    // for convenience, we log in as John Doe for now
    // TODO: disallow empty username+password since we consider that as an anonymous user
    await loginDebug();

    // navigate to the previous page redirected here, or /decks page as a fallback
    const hasPreviousPage = window.history.state && window.history.state.idx > 0;
    if (hasPreviousPage) {
      navigate(-1);
    } else {
      navigate(paths.decks);
    }

    setIsContinuingAsGuest(false);
  }
};
