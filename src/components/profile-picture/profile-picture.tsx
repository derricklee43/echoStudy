import React from 'react';
import { useAccountClient } from '@/hooks/api/use-account-client';
import './profile-picture.scss';

export interface UserTileProps {
  username?: string;
  showGlow: boolean;
  className?: string;
}

export const ProfilePicture = ({ username = '', className = '', showGlow }: UserTileProps) => {
  const { getProfilePictureUrl } = useAccountClient();
  const pfpUrl = getProfilePictureUrl(username);

  const glowClass = showGlow ? 'prof-pic-glow' : '';
  return (
    <div className={`profile-picture-container ${glowClass} ${className}`}>
      <img className="profile-picture" src={pfpUrl} loading="lazy" />
    </div>
  );
};
