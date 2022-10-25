import React from 'react';
import { ProfilePicture } from '@/components/profile-picture/profile-picture';
import { getFormattedDate } from '@/helpers/time';
import './user-details.scss';

interface UserDetailsProps {
  username: string;
  profilePicUrl: string;
  email?: string;
  dateJoined: Date;
}

export const UserDetails = ({ username, email, dateJoined, profilePicUrl }: UserDetailsProps) => {
  return (
    <div className="user-details">
      <ProfilePicture profilePicUrl={profilePicUrl} showGlow={false} />
      <span className="username">{`@${username}`}</span>
      {email !== undefined && <span className="full-name">{email.toLowerCase()}</span>}
      <span className="date-joined">member since {getFormattedDate(dateJoined)}</span>
    </div>
  );
};
