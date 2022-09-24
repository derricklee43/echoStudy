import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useUserClient } from '../../../hooks/api/use-user-client';
import { userInfoStateAsync } from '../../../state/auth-jwt';
import { Button } from '../../button/button';
import { AccountPopup } from '../account-popup/account-popup';
import './welcome-user.scss';

interface WelcomeUserProps {
  className?: string;
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

const AsyncWelcomeUser = ({ className = '', onProfileClick, onLogoutClick }: WelcomeUserProps) => {
  const userData = useRecoilValue(userInfoStateAsync);
  const userClient = useUserClient();
  const pfpUrl = userClient.getProfilePictureUrl(userData?.email ?? '');

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
