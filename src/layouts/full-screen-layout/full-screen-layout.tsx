import React from 'react';
import { Outlet } from 'react-router-dom';
import './full-screen-layout.scss';

export const FullscreenLayout = () => {
  return (
    <div className="full-screen-layout-content">
      <Outlet />
    </div>
  );
};
