import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { Button } from '@/components/button/button';
import { AccountPopup } from '@/components/header/account-popup/account-popup';
import { useAccountClient } from '@/hooks/api/use-account-client';
import { userInfoStateAsync } from '@/state/auth-jwt';
import './welcome-user.scss';

interface WelcomeUserProps {
  className?: string;
  fixed?: boolean;
  onProfileClick?: (event: React.MouseEvent) => void;
  onLogoutClick?: (event: React.MouseEvent) => void;
}

export const WelcomeUser = (props: WelcomeUserProps) => {
  return (
    <React.Suspense fallback={getFallback(props)}>
      <AsyncWelcomeUser {...props} />
    </React.Suspense>
  );
};

const AsyncWelcomeUser = ({
  className = '',
  fixed = false,
  onProfileClick,
  onLogoutClick,
}: WelcomeUserProps) => {
  const userData = useRecoilValue(userInfoStateAsync);
  const accountClient = useAccountClient();
  const pfpUrl = accountClient.getProfilePictureUrl(userData?.email ?? '');

  const [showPopup, setShowPopup] = useState(false);
  const popupClass = showPopup ? 'popup' : '';

  return (
    <>
      <div className={`c-header-welcome-user ${popupClass} ${className}`}>
        <div className="c-welcome-presentable" onClick={() => setShowPopup((curr) => !curr)}>
          <span className="greeting-text">{`hi, ${userData?.username}`}</span>
          <img className="profile-picture" src={pfpUrl} loading="lazy" />
        </div>
      </div>
      <AccountPopup
        className={`welcome-account-popup ${className}`}
        fixed={fixed}
        showTrigger={showPopup}
        onClose={() => setShowPopup(false)}
      >
        <div className="c-welcome-presentable" onClick={() => setShowPopup((curr) => !curr)}>
          <span className="greeting-text">{`hi, ${userData?.username}`}</span>
          <img className="profile-picture" src={pfpUrl} loading="lazy" />
        </div>
        <Button className="profile-button" onClick={handleProfileClick}>
          my profile
        </Button>
        <Button className="logout-button" onClick={handleLogoutClick}>
          log out
        </Button>
      </AccountPopup>
    </>
  );

  function handleProfileClick(event: React.MouseEvent) {
    onProfileClick?.(event);
    setShowPopup(false);
  }

  function handleLogoutClick(event: React.MouseEvent) {
    onLogoutClick?.(event);
    setShowPopup(false);
  }
};

function getFallback(props: WelcomeUserProps) {
  const { className = '', onLogoutClick } = props;

  return (
    <div className={`c-account-popup-fallback ${className}`}>
      <Button className="logout-button" onClick={(event) => onLogoutClick?.(event)}>
        log out
      </Button>
    </div>
  );
}
