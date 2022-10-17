import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useRecoilState, useRecoilValue } from 'recoil';
import { CancelIcon } from '@/assets/icons/cancel-icon/cancel-icon';
import { HamburgerMenuIcon } from '@/assets/icons/hamburger-menu-icon/hamburger-menu-icon';
import { Button } from '@/components/button/button';
import { DropDownOption } from '@/components/drop-down-options/drop-down-options';
import { CategorySearchBar } from '@/components/search-bar/category-search-bar/category-search-bar';
import { useAccountClient } from '@/hooks/api/use-account-client';
import { useSearchCategories } from '@/hooks/use-search-categories';
import { useSearchResultFilter } from '@/hooks/use-search-result-filter';
import { paths } from '@/routing/paths';
import { authJwtState, isAuthJwt } from '@/state/auth-jwt';
import { navToggledState } from '@/state/nav';
import { userDecksSortedState } from '@/state/user-decks';
import { WelcomeUser } from './welcome-user/welcome-user';
import './header.scss';

interface HeaderProps {
  className?: string;
  showSearchBar?: boolean;
  fixed?: boolean;
  showHamburgerToggle?: boolean; // hamburger menu on smaller devices for sidebar
}

export const Header = ({
  className = '',
  showSearchBar = true,
  fixed = true,
  showHamburgerToggle = false,
}: HeaderProps) => {
  const authJwt = useRecoilValue(authJwtState);
  const [navToggled, setNavToggled] = useRecoilState(navToggledState);

  const accountClient = useAccountClient();
  const navigate = useNavigate();

  const {
    searchValue,
    searchResults,
    searchCategory,
    searchCategories,
    isLoading,
    setSearchValue,
    setSearchCategory,
    navigateToResult,
  } = useSearchCategories(false);

  const placeholder = `search ${searchCategory.id}...`;

  return (
    <div className={`c-header ${fixed ? 'fixed' : ''} ${className}`}>
      <div className="c-header-content">
        {showHamburgerToggle && (
          <div className="c-header-nav">
            <AnimatePresence exitBeforeEnter>{getAnimatedNavToggleIcon()}</AnimatePresence>
          </div>
        )}

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
              <CategorySearchBar
                searchValue={searchValue}
                selectedCategory={searchCategory}
                searchCategories={searchCategories}
                searchResults={searchResults}
                placeholder={placeholder}
                areResultsLoading={isLoading}
                onSearchValueChange={setSearchValue}
                onCategorySelect={setSearchCategory}
                onSearchResultSelect={navigateToResult}
              />
            </div>
          )}
        </div>

        <div className="c-account-buttons">{getAccountButtons()}</div>
      </div>
    </div>
  );

  function getAnimatedNavToggleIcon() {
    const toggleNavAction = () => setNavToggled((curr) => !curr);
    const iconKey = navToggled ? 'cancel' : 'hamburger';

    return (
      <motion.div
        className="animated-icon"
        key={iconKey}
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, rotate: 180 }}
        transition={{ duration: 0.25 }}
      >
        {navToggled ? (
          <CancelIcon onClick={toggleNavAction} />
        ) : (
          <HamburgerMenuIcon onClick={toggleNavAction} />
        )}
      </motion.div>
    );
  }

  function getAccountButtons() {
    if (isAuthJwt(authJwt)) {
      return (
        <WelcomeUser
          fixed={fixed}
          onProfileClick={handleProfileClick}
          onLogoutClick={handleLogoutClick}
        />
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

  function handleSignUpClick() {
    navigate(paths.signUp);
  }

  function handleSignInClick() {
    navigate(paths.signIn);
  }

  function handleProfileClick() {
    navigate(paths.profile);
  }

  function handleLogoutClick() {
    accountClient.logout();
  }
};
