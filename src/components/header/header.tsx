import './header.scss';
import React from 'react';
import { SearchBar } from '../search-bar/search-bar';
import { Button } from '../button/button';
import { Deck } from '../../models/deck';

interface HeaderProps {
  decks: Deck[];
}

export const Header = ({ decks }: HeaderProps) => {
  return (
    <div className="c-header">
      <div className="c-header-content">
        <div className="c-search-bar-container">
          <SearchBar placeholder="search my decks" dropDownData={getDeckOptions()} />
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

  function getDeckOptions() {
    return decks.map((deck) => ({ id: deck.metaData.id.toString(), value: deck.metaData.title }));
  }

  function handleSignUpClick() {
    console.log('sign up');
  }

  function handleSignInClick() {
    console.log('sign up');
  }
};
