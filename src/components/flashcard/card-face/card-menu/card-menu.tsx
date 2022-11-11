import React, { ReactNode, useState } from 'react';
import { MicrophoneIcon } from '@/assets/icons/microphone-icon/microphone-icon';
import { SwapIcon } from '@/assets/icons/swap-icon/swap-icon';
import { DropDownOption } from '@/components/drop-down-options/drop-down-options';
import { KebabMenu } from '@/components/kebab-menu/kebab-menu';
import { LanguageDropDown } from '@/components/language-drop-down/drop-down-options/language-drop-down';
import { CardSide } from '@/models/card';
import { CardContent } from '@/models/card-content';
import { AllCardLanguages } from '@/models/language';
import './card-menu.scss';

const langDropdownId = 'lang';
const swapOptionId = 'swap';
const recordAudioOptionId = 'recordAudio';

const dropDownOptionIDs = [langDropdownId, swapOptionId, recordAudioOptionId] as const;
type CardMenuDropdownID = typeof dropDownOptionIDs[number];

interface CardMenuProps {
  cardSide: CardSide;
  cardContent: CardContent;
  onCardContentChange: (cardContent: CardContent) => void;
  onSwapContentClick: () => void;
  onRecordAudioClick: () => void;
}

export const CardMenu = ({
  cardContent,
  cardSide,
  onCardContentChange,
  onSwapContentClick,
  onRecordAudioClick,
}: CardMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const termDef = ['term', 'definition'];
  const [sideLabel, oppositeSideLabel] = cardSide === 'front' ? termDef : termDef.reverse();

  const changeLanguageLabel = `${sideLabel} language`;
  const swapContentLabel = `swap with ${oppositeSideLabel}`;

  const options: DropDownOption<CardMenuDropdownID, ReactNode>[] = [
    { id: langDropdownId, focusable: false, value: getLanguageDropdownOption() },
    { id: swapOptionId, focusable: true, value: getSwapOption() },
    { id: recordAudioOptionId, focusable: !!cardContent.text, value: getRecordAudioOption() },
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
      setIsOpen(false);
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
      <div className="card-menu-option">
        <SwapIcon variant="dark" className="card-menu-swap-icon card-menu-icon" />
        {swapContentLabel}
      </div>
    );
  }

  function getRecordAudioOption() {
    const isDisabled = !cardContent.text;
    const containerClass = isDisabled ? 'disabled-card-menu-option' : '';
    const microphoneVariant = isDisabled ? 'grey' : 'dark';
    return (
      <div className={`card-menu-option ${containerClass}`}>
        <MicrophoneIcon
          className="card-menu-record-audio-icon card-menu-icon"
          variant={microphoneVariant}
        />
        record audio
      </div>
    );
  }
};
