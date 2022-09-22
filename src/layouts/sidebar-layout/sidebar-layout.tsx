import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { Header } from '../../components/header/header';
import { Sidebar } from '../../components/sidebar/sidebar';
import { throttle } from '../../helpers/func';
import { navToggledState } from '../../state/nav';
import './sidebar-layout.scss';

export const SidebarLayout = () => {
  const [navToggled, setNavToggled] = useRecoilState(navToggledState);

  // if nav open, listen for resizing to hide if resized to be bigger than breakpoint
  useEffect(() => {
    if (!navToggled) return;

    const resizeHandler = throttle(() => {
      // if greater than medium size (768px), hide nav
      if (window.innerWidth > 768) {
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
      <Header className="sidebar-layout-header" showHamburgerToggle={true} />
      <Sidebar className="sidebar-layout-sidebar" />
      <div className="sidebar-layout-page-wrap">
        <div className="sidebar-layout-content">
          <Outlet />
        </div>
      </div>
    </>
  );
};
