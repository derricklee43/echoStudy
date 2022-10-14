import React from 'react';
import { NavLink } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { SIDEBAR_ROUTE_ITEMS } from '@/routing/sidebar-routes';
import { navToggledState } from '@/state/nav';
import './sidebar.scss';

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className = '' }: SidebarProps) => {
  const navToggled = useRecoilValue(navToggledState);

  return (
    <div className={`c-sidebar ${navToggled ? 'nav-toggled' : ''} ${className}`}>
      <ul className="c-sidebar-items">
        {SIDEBAR_ROUTE_ITEMS.map((item) => (
          <NavLink
            key={item.name}
            to={item.route}
            className={(state) => `c-sidebar-link ${state.isActive ? 'active' : ''}`}
          >
            <li className="c-sidebar-item">{item.name}</li>
          </NavLink>
        ))}
      </ul>
    </div>
  );
};
