import './header.scss';
import React from 'react';
import { SearchBar } from '../search-bar/search-bar';
import { Button } from '../button/button';
import { Deck } from '../../models/deck';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../routes';
import { DropDownOption } from '../drop-down-options/drop-down-options';

interface HeaderProps {
  decks: Deck[];
}

export const Header = ({ decks }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="c-header">
      <div className="c-header-content">
        <div className="c-search-bar-container">
          <SearchBar
            placeholder="search my decks"
            dropDownData={getDeckOptions()}
            onDropdownClick={({ id }) => navigate(`${paths.deck}/${id}`)}
          />
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

  function getDeckOptions(): DropDownOption<string>[] {
    return decks.map((deck) => ({ id: deck.metaData.id.toString(), value: deck.metaData.title }));
  }

  function handleSignUpClick() {
    console.log('sign up');
  }

  function handleSignInClick() {
    console.log('sign up');
  }
};
