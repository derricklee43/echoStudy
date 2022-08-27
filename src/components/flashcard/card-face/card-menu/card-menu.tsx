import './card-menu.scss';
import React, { useRef, useState } from 'react';
import { Button } from '../../../button/button';
import { KebabMenuIcon } from '../../../../assets/icons/kebab-menu-icon/kebab-menu-icon';
import { SwapIcon } from '../../../../assets/icons/swap-icon/swap-icon';
import { useOutsideClick } from '../../../../hooks/use-outside-click';
import { LanguageDropDown } from '../../../language-drop-down/drop-down-options/language-drop-down';
import { Fade } from '../../../../animations/fade';
import { AnimatePresence } from 'framer-motion';
import { AllCardLanguages, CardLanguage } from '../../../../models/card-content';

interface CardFaceProps {
  language: CardLanguage;
  changeLanguageLabel: string;
  swapContentLabel: string;
  onLanguageChange: (language: CardLanguage) => void;
  onSwapContentClick: () => void;
}

export const CardMenu = ({
  language,
  changeLanguageLabel,
  swapContentLabel,
  onLanguageChange,
  onSwapContentClick,
}: CardFaceProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const dropDownMenuRef = useRef(null);
  useOutsideClick(dropDownMenuRef, () => setShowMenu(false));
  return (
    <div className="c-card-menu" ref={dropDownMenuRef}>
      <Button
        onClick={() => setShowMenu(!showMenu)}
        variant="invisible"
        bubbleOnClickEvent={false}
        className="card-face-button card-face-kebab-menu"
        ariaLabel="kebab-menu"
      >
        <KebabMenuIcon />
      </Button>
      <AnimatePresence>
        {showMenu && (
          <Fade fadeIn={false} className="floating-menu">
            <div className="menu-item language-menu-item">
              <LanguageDropDown
                languages={AllCardLanguages}
                language={language}
                onLanguageSelect={onLanguageChange}
                label={changeLanguageLabel}
                variant="light"
              />
            </div>
            <div className="menu-item button-item" onClick={handleSwapContentClick}>
              <SwapIcon variant="dark" className="menu-item-icon" />
              {swapContentLabel}
            </div>
          </Fade>
        )}
      </AnimatePresence>
    </div>
  );

  function handleSwapContentClick() {
    onSwapContentClick();
    setShowMenu(false);
  }
};
