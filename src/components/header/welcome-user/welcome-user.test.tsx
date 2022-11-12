import React from 'react';
import { screen } from '@testing-library/react';
import { act } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';
import { enableFetchMocks } from 'jest-fetch-mock';
import { MutableSnapshot } from 'recoil';
import { renderWithTestRoots } from '@/app.test';
import { authJwtState, UserInfo } from '@/state/auth-jwt';
import { WelcomeUser } from './welcome-user';

// provide fetchMock global and disable mocking initially
enableFetchMocks();
fetchMock.dontMock();

describe('WelcomeUser', () => {
  beforeEach(() => {
    // setup portal element for modal to render on
    document.body.innerHTML = `<div id="portal"></div>`;
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  it('should render correctly with default props', () => {
    renderWithTestRoots(<WelcomeUser className="test-class-789" />);
    expect(document.querySelectorAll('.test-class-789')).toHaveLength(1);
  });

  it('should render with fallback if user info state is empty', async () => {
    renderWithTestRoots(<WelcomeUser />);
    await flushMacrotasks();

    // fallback is a 'log out' button
    expect(screen.queryAllByText('hi, test1').length).toEqual(0);
    expect(screen.queryAllByText('log out').length).toEqual(1);
  });

  it('should greet user if user info state is empty', async () => {
    renderWithTestRoots(<WelcomeUser />, { recoilState: getInitRecoilState() });
    await flushMacrotasks();

    expect(screen.queryAllByText('hi, test1').length).not.toEqual(0);
  });

  it('should perform actions in account popup', async () => {
    const mockButtonClick = jest.fn();
    renderWithTestRoots(
      <WelcomeUser onProfileClick={mockButtonClick} onLogoutClick={mockButtonClick} />,
      { recoilState: getInitRecoilState() }
    );
    await flushMacrotasks();

    // open account popup (not needed, but in case of any side effects)
    const greetingElement = screen.queryAllByText('hi, test1')[0];
    userEvent.click(greetingElement);
    expect(mockButtonClick).toBeCalledTimes(0);

    // click all buttons
    const actionButtons = document.querySelectorAll('button');
    actionButtons.forEach((button) => userEvent.click(button));
    expect(mockButtonClick).toBeCalledTimes(2);
  });

  /**
   * Provides a recoil state that setups the mocking of the `userInfoStateAsync` selector.
   * Can optionally pass in the UserInfo to be mocked if desired.
   */
  function getInitRecoilState(userInfo?: UserInfo): (snapshot: MutableSnapshot) => void {
    fetchMock.doMock();

    // expected /users request from `userInfoState` selector --> to mocked response
    fetchMock.mockResponse(
      JSON.stringify(
        userInfo ?? {
          username: 'test1',
          email: 'test1@test.com',
        }
      ),
      { headers: { 'content-type': 'application/json' } }
    );

    // setting up this state causes the `userInfoState` selector to asynchronously update
    return (snapshot: MutableSnapshot) => {
      snapshot.set(authJwtState, { accessToken: 'test', refreshToken: 'test' });
    };
  }

  async function flushMacrotasks() {
    return act(
      () =>
        new Promise((resolve) => {
          setTimeout(resolve, 100);
          jest.runAllTimers();
        })
    );
  }
});
