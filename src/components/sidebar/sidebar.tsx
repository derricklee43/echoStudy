import './sidebar.scss';
import React from 'react';
import { SIDEBAR_ROUTE_ITEMS } from './sidebar-routes';
import { NavLink } from 'react-router-dom';

export const Sidebar = () => {
  return (
    <div className="c-sidebar">
      <label className="c-sidebar-title">
        echo<span>Study</span>
      </label>
      <hr className="c-sidebar-divider" />
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
