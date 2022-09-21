import React from 'react';
import { NavLink } from 'react-router-dom';
import { SIDEBAR_ROUTE_ITEMS } from '../../routing/sidebar-routes';
import './sidebar.scss';

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className = '' }: SidebarProps) => {
  return (
    <div className={`c-sidebar ${className}`}>
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
