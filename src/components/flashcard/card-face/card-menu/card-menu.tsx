import React, { useState } from 'react';
import { SwapIcon } from '../../../../assets/icons/swap-icon/swap-icon';
import { AllCardLanguages, CardLanguage } from '../../../../models/language';
import { DropDownOption } from '../../../drop-down-options/drop-down-options';
import { KebabMenu } from '../../../kebab-menu/kebab-menu';
import { LanguageDropDown } from '../../../language-drop-down/drop-down-options/language-drop-down';
import './card-menu.scss';

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
  const [isOpen, setIsOpen] = useState(false);

  const a: DropDownOption<React.ReactNode>[] = [
    { id: 'lang', focusable: false, value: getLanguageDropdownOption() },
    { id: 'swap', focusable: true, value: getSwapOption() },
  ];

  return <KebabMenu className="c-card-menu" options={a} isOpen={isOpen} setIsOpen={setIsOpen} />;

  function getLanguageDropdownOption() {
    return (
      <LanguageDropDown
        className="card-menu-language-dropdown"
        languages={AllCardLanguages}
        language={language}
        onLanguageSelect={onLanguageChange}
        label={changeLanguageLabel}
        variant="light"
      />
    );
  }

  function getSwapOption() {
    return (
      <div className="card-menu-swap-option" onClick={handleSwapContentClick}>
        <SwapIcon variant="dark" className="card-menu-swap-icon" />
        {swapContentLabel}
      </div>
    );
  }

  function handleSwapContentClick() {
    onSwapContentClick();
    setIsOpen(false);
  }
};
