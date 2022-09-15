import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { useUserClient } from '../../hooks/api/use-user-client';
import { paths } from '../../routing/paths';
import { authJwtState } from '../../state/auth-jwt';
import { userDecksSortedState } from '../../state/user-decks';
import { Button } from '../button/button';
import { DropDownOption } from '../drop-down-options/drop-down-options';
import { SearchBar } from '../search-bar/search-bar';
import './header.scss';

interface HeaderProps {
  className?: string;
  showSearchBar?: boolean;
  fixed?: boolean;
}

export const Header = ({ className = '', showSearchBar = true, fixed = true }: HeaderProps) => {
  const authJwt = useRecoilValue(authJwtState);
  const decks = useRecoilValue(userDecksSortedState);
  const userClient = useUserClient();
  const navigate = useNavigate();

  return (
    <div className={`c-header ${fixed ? 'fixed' : ''} ${className}`}>
      <div className="c-header-content">
        <div className="c-header-title">
          <a className="c-header-anchor" href="/">
            <label>
              echo<span>Study</span>
            </label>
          </a>
        </div>

        <div className="c-search-bar-container">
          {showSearchBar && (
            <div className="c-search-bar-sizer">
              <SearchBar
                placeholder="search my decks"
                dropDownData={getDeckOptions()}
                onDropdownClick={({ id }) => navigate(`${paths.deck}/${id}`)}
              />
            </div>
          )}
        </div>

        <div className="c-account-buttons">{getAccountButtons()}</div>
      </div>
    </div>
  );

  function getAccountButtons() {
    if (authJwt && authJwt.accessToken && authJwt.refreshToken) {
      return (
        <Button onClick={handleLogoutClick} className="logout-button">
          logout
        </Button>
      );
    } else {
      return (
        <>
          <Button onClick={handleSignUpClick} className="sign-up-button">
            sign up
          </Button>
          <Button onClick={handleSignInClick} className="sign-in-button">
            sign in
          </Button>
        </>
      );
    }
  }

  function getDeckOptions(): DropDownOption<string>[] {
    return decks.map((deck) => ({ id: deck.metaData.id.toString(), value: deck.metaData.title }));
  }

  function handleSignUpClick() {
    navigate(paths.signUp, { replace: true }); // replace may be a mistake, we'll see
  }

  function handleSignInClick() {
    navigate(paths.signIn, { replace: true }); // replace may be a mistake, we'll see
  }

  function handleLogoutClick() {
    userClient.logout();
  }
};
