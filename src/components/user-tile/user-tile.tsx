import React, { ReactNode, useState } from 'react';
import { Button } from '@/components/button/button';
import { ProfilePicture } from '@/components/profile-picture/profile-picture';
import { PublicUser } from '@/models/public-user';
import './user-tile.scss';

export interface UserTileProps {
  user: PublicUser;
  onClick?: () => void;
}

export const UserTile = ({ user, onClick }: UserTileProps) => {
  const userName = user.username;
  const numDecks = user.publicDecks.length;
  return (
    <Button className="user-tile user-tile-button" onClick={() => onClick?.()} variant="invisible">
      <ProfilePicture
        profilePicUrl={user.profilePicUrl}
        showGlow={false}
        className="user-tile-profile-pic"
      />
      <div className="user-tile-username">{userName}</div>
      <div className="user-tile-num-decks">{numDecks} decks</div>
    </Button>
  );
};
