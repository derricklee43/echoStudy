import React from 'react';
import { ProfilePicture } from '@/components/profile-picture/profile-picture';
import './user-details.scss';

interface UserDetailsProps {
  username: string;
  email?: string;
  yearJoined: number;
}

export const UserDetails = ({ username, email, yearJoined }: UserDetailsProps) => {
  return (
    <div className="user-details">
      <ProfilePicture username={username} showGlow={false} />
      <span className="username">{`@${username}`}</span>
      {email !== undefined && <span className="full-name">{email.toLowerCase()}</span>}
      <span className="date-joined">member since {yearJoined}</span>
    </div>
  );
};
