import './header.scss';
import React from 'react';
import { SearchBar } from '../search-bar/search-bar';
import { Button } from '../button/button';

export const Header = () => {
  return (
    <div className="c-header">
      <div className="c-header-content">
        <div className="c-search-bar-container">
          <SearchBar placeholder="search my decks" />
        </div>
        <div className="c-account-buttons">
          <Button onClick={handleSignUpClick} className="sign-up-button">
            sign up
          </Button>
          <Button onClick={handleSignInClick} className="sign-in-button">
            sign in
          </Button>
        </div>
      </div>
    </div>
  );

  function handleSignUpClick() {
    console.log('sign up');
  }

  function handleSignInClick() {
    console.log('sign up');
  }
};
