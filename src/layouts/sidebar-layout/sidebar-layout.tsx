import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { sign } from 'crypto';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Header } from '@/components/header/header';
import { Sidebar } from '@/components/sidebar/sidebar';
import { throttle } from '@/helpers/func';
import { authJwtState, isAuthJwt } from '@/state/auth-jwt';
import { navToggledState } from '@/state/nav';
import './sidebar-layout.scss';

export const SidebarLayout = () => {
  const authJwt = useRecoilValue(authJwtState);
  const [navToggled, setNavToggled] = useRecoilState(navToggledState);

  const isSignedIn = isAuthJwt(authJwt);
  const signedInClass = isSignedIn ? 'signed-in' : '';

  // if nav open, listen for resizing to hide if resized to be bigger than breakpoint
  useEffect(() => {
    if (!navToggled) return;

    const resizeHandler = throttle(() => {
      // if greater than large size (1024px), hide nav
      if (window.innerWidth > 1024) {
        setNavToggled(false);
      }
    }, 250);
    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, [navToggled]);

  return (
    <>
      <Header
        className={`sidebar-layout-header ${signedInClass}`}
        showHamburgerToggle={isSignedIn}
        showSearchBar={isSignedIn}
      />
      {isSignedIn && <Sidebar className="sidebar-layout-sidebar" />}
      <div className={`sidebar-layout-page-wrap ${signedInClass}`}>
        <div className="sidebar-layout-content">
          <Outlet />
        </div>
      </div>
    </>
  );
};
