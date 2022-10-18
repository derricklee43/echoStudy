import React, { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { LoadingPage } from '@/components/loading-page/loading-page';
import { userInfoStateAsync } from '@/state/auth-jwt';
import { PersonalProfilePage } from './personal-profile-page/personal-profile-page';
import { PublicProfilePage } from './public-profile-page/public-profile-page';
import './profile-page.scss';

export const ProfilePage = () => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <AsyncProfilePage />
    </Suspense>
  );
};

export const AsyncProfilePage = () => {
  const { username } = useParams();
  const userData = useRecoilValue(userInfoStateAsync);

  return username === userData?.username ? <PersonalProfilePage /> : <PublicProfilePage />;
};
