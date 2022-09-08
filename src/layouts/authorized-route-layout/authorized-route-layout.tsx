import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { paths } from '../../routing/paths';
import { authJwtState } from '../../state/auth-jwt';

export const AuthorizedRouteLayout = () => {
  const authJwt = useRecoilValue(authJwtState);
  const isAuthorized = authJwt && authJwt.accessToken && authJwt.refreshToken;

  return isAuthorized ? <Outlet /> : <Navigate to={paths.login} />;
};
