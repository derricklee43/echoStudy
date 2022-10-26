import React from 'react';
import { ProfilePicture } from '@/components/profile-picture/profile-picture';
import './author-tag.scss';

interface AuthorTagProps {
  className?: string;
  username: string;
  profilePicUrl: string;
  onClick?: () => void;
}

export const AuthorTag = ({ className = '', username, profilePicUrl, onClick }: AuthorTagProps) => {
  return (
    <button className={`c-author-tag ${className}`} onClick={onClick}>
      <ProfilePicture
        showGlow={false}
        className="c-author-tag-profile-pic"
        profilePicUrl={profilePicUrl}
      />
      {`@${username}`}
    </button>
  );
};
