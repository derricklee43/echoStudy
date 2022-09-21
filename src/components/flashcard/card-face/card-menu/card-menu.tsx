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
  const langDropdownId = 'lang';
  const swapOptionId = 'swap';

  const options: DropDownOption<React.ReactNode>[] = [
    { id: langDropdownId, focusable: false, value: getLanguageDropdownOption() },
    { id: swapOptionId, focusable: true, value: getSwapOption() },
  ];

  return (
    <KebabMenu
      className="c-card-menu"
      options={options}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onOptionSelect={handleOptionSelect}
    />
  );

  function handleOptionSelect(option: DropDownOption<React.ReactNode>) {
    if (option.id === swapOptionId) {
      onSwapContentClick();
      setIsOpen(false);
    }
  }

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
      <div className="card-menu-swap-option">
        <SwapIcon variant="dark" className="card-menu-swap-icon" />
        {swapContentLabel}
      </div>
    );
  }
};
