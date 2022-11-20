import React, { ForwardedRef, forwardRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { SIDEBAR_ROUTE_ITEMS } from '@/routing/sidebar-routes';
import { navToggledState } from '@/state/nav';
import './sidebar.scss';

interface SidebarProps {
  className?: string;
  onPathClicked?: (pathName: string) => void;
}

const ForwardedSidebar = (
  { className = '', onPathClicked }: SidebarProps,
  ref: ForwardedRef<HTMLDivElement>
) => {
  const navToggled = useRecoilValue(navToggledState);

  return (
    <div ref={ref} className={`c-sidebar ${navToggled ? 'nav-toggled' : ''} ${className}`}>
      <ul className="c-sidebar-items">
        {SIDEBAR_ROUTE_ITEMS.map((item) => (
          <NavLink
            key={item.name}
            to={item.route}
            className={(state) => `c-sidebar-link ${state.isActive ? 'active' : ''}`}
            onClick={() => onPathClicked?.(item.name)}
          >
            <li className="c-sidebar-item">{item.name}</li>
          </NavLink>
        ))}
      </ul>
    </div>
  );
};

export const Sidebar = forwardRef(ForwardedSidebar);
