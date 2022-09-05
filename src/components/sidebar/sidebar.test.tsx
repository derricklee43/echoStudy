import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sidebar } from './sidebar';
import { renderWithHistoryRouter } from '../../app.test';
import { SIDEBAR_ROUTE_ITEMS } from '../../routing/sidebar-routes';

const FIRST_SIDEBAR_ITEM_NAME = SIDEBAR_ROUTE_ITEMS[0].name;
const FIRST_SIDEBAR_ITEM_ROUTE = SIDEBAR_ROUTE_ITEMS[0].route;

describe('SideBar', () => {
  it('should render correctly with default props', () => {
    renderWithHistoryRouter(<Sidebar />);
    expect(screen.getByText(FIRST_SIDEBAR_ITEM_NAME)).toBeInTheDocument();
  });

  it('should change url when clicking link item', () => {
    const { history } = renderWithHistoryRouter(<Sidebar />);
    expect(history.location.pathname).toBe('/');

    userEvent.click(screen.getByText(FIRST_SIDEBAR_ITEM_NAME));
    expect(history.location.pathname).toBe(FIRST_SIDEBAR_ITEM_ROUTE);
  });
});
