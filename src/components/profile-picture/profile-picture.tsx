import React from 'react';
import './profile-picture.scss';

export interface UserTileProps {
  profilePicUrl: string;
  showGlow: boolean;
  className?: string;
}

export const ProfilePicture = ({ className = '', showGlow, profilePicUrl }: UserTileProps) => {
  const glowClass = showGlow ? 'prof-pic-glow' : '';
  return (
    <div className={`profile-picture-container ${glowClass} ${className}`}>
      <img className="profile-picture" src={profilePicUrl} loading="lazy" />
    </div>
  );
};
