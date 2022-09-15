import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { paths } from '../../routing/paths';
import { authJwtState } from '../../state/auth-jwt';

// an inverse of the AuthorizedRoute
export const AlreadyAuthorizedLayout = () => {
  const authJwt = useRecoilValue(authJwtState);

  // might be smart to send a test request
  // otherwise users might lose data in pages like in create-deck
  // see this source to handle async code:
  // https://stackoverflow.com/questions/61388307/render-component-in-jsx-based-on-async-function-returning-boolean
  return authJwt ? <Navigate to={paths.decks} /> : <Outlet />;
};
