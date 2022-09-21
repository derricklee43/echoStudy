import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../../components/header/header';
import { Sidebar } from '../../components/sidebar/sidebar';
import './sidebar-layout.scss';

export const SidebarLayout = () => {
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
