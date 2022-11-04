import React, { ReactNode, useState } from 'react';
import { MicrophoneIcon } from '@/assets/icons/microphone-icon/microphone-icon';
import { SwapIcon } from '@/assets/icons/swap-icon/swap-icon';
import { DropDownOption } from '@/components/drop-down-options/drop-down-options';
import { KebabMenu } from '@/components/kebab-menu/kebab-menu';
import { LanguageDropDown } from '@/components/language-drop-down/drop-down-options/language-drop-down';
import { CardContent } from '@/models/card-content';
import { AllCardLanguages, CardLanguage } from '@/models/language';
import './card-menu.scss';

const langDropdownId = 'lang';
const swapOptionId = 'swap';
const recordAudioOptionId = 'recordAudio';

const dropDownOptionIDs = [langDropdownId, swapOptionId, recordAudioOptionId] as const;
type CardMenuDropdownID = typeof dropDownOptionIDs[number];

interface CardMenuProps {
  cardContent: CardContent;
  changeLanguageLabel: string;
  swapContentLabel: string;
  onCardContentChange: (cardContent: CardContent) => void;
  onSwapContentClick: () => void;
  onRecordAudioClick: () => void;
}

export const CardMenu = ({
  cardContent,
  changeLanguageLabel,
  swapContentLabel,
  onCardContentChange,
  onSwapContentClick,
  onRecordAudioClick,
}: CardMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const options: DropDownOption<CardMenuDropdownID, ReactNode>[] = [
    { id: langDropdownId, focusable: false, value: getLanguageDropdownOption() },
    { id: swapOptionId, focusable: true, value: getSwapOption() },
    { id: recordAudioOptionId, focusable: true, value: getRecordAudioOption() },
  ];

  return (
    <KebabMenu
      className="c-card-menu"
      options={options}
      isOpen={isOpen}
      variant="blue"
      setIsOpen={setIsOpen}
      onOptionSelect={handleOptionSelect}
    />
  );

  function handleOptionSelect(option: DropDownOption<CardMenuDropdownID, ReactNode>) {
    if (option.id === swapOptionId) {
      onSwapContentClick();
      setIsOpen(false);
    }
    if (option.id === recordAudioOptionId) {
      onRecordAudioClick();
    }
  }

  function getLanguageDropdownOption() {
    return (
      <LanguageDropDown
        className="card-menu-language-dropdown"
        languages={AllCardLanguages}
        language={cardContent.language}
        onLanguageSelect={(language) => onCardContentChange({ ...cardContent, language })}
        label={changeLanguageLabel}
        variant="light"
      />
    );
  }

  function getSwapOption() {
    return (
      <div className="card-menu-swap-option">
        <SwapIcon variant="dark" className="card-menu-swap-icon card-menu-icon" />
        {swapContentLabel}
      </div>
    );
  }

  function getRecordAudioOption() {
    return (
      <div className="card-menu-swap-option">
        <MicrophoneIcon className="card-menu-record-audio-icon card-menu-icon" />
        record audio
      </div>
    );
  }
};
