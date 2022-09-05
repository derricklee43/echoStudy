import React from 'react';
import { NavLink } from 'react-router-dom';
import { SIDEBAR_ROUTE_ITEMS } from '../../routing/sidebar-routes';
import './sidebar.scss';

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
