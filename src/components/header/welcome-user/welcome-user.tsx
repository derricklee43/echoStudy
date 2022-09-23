import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useUserClient } from '../../../hooks/api/use-user-client';
import { userInfoState } from '../../../state/auth-jwt';
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
  const userData = useRecoilValue(userInfoState);
  const userClient = useUserClient();
  const pfpUrl = userClient.getProfilePictureUrl(userData?.email ?? '');

  const [showPopup, setShowPopup] = useState(false);
  const popupClass = showPopup ? 'popup' : '';

  return (
    <div
      className={`c-header-welcome-user ${popupClass} ${className}`}
      onClick={() => setShowPopup((curr) => !curr)}
    >
      <div className="c-welcome-presentable">
        <span className="greeting-text">{`hi, ${userData?.username}`}</span>
        <img className="profile-picture" src={pfpUrl} loading="lazy" />
      </div>

      <AccountPopup
        className={`welcome-account-popup ${className}`}
        showTrigger={showPopup}
        onClose={() => setShowPopup((curr) => !curr)}
      >
        <div className="c-welcome-presentable">
          <span className="greeting-text">{`hi, ${userData?.username}`}</span>
          <img className="profile-picture" src={pfpUrl} loading="lazy" />
        </div>
        <Button className="profile-button" onClick={(event) => onProfileClick?.(event)}>
          my profile
        </Button>
        <Button className="logout-button" onClick={(event) => onLogoutClick?.(event)}>
          log out
        </Button>
      </AccountPopup>
    </div>
  );
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
