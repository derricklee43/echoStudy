import './import-cards-popup.scss';
import React, { useState } from 'react';
import { PopupModal } from '../../components/popup-modal/popup-modal';
import { Button } from '../../components/button/button';
import { noop } from '../../helpers/func';
import { TextArea } from '../../components/text-area/text-area';
import { BubbleDivider } from '../../components/bubble-divider/bubble-divider';
import { Card, createNewCard } from '../../models/card';
import {
  RadioButtonGroup,
  RadioButtonOptions,
} from '../../components/radio-button-group/radio-button-group';

interface ImportCardsPopupProps {
  showPopup: boolean;
  onClose: (importedCards: Card[]) => void;
}

const termDefSeparatorOptions: RadioButtonOptions = {
  ',': 'commas',
  ' ': 'spaces',
};

const cardSeparatorOptions: RadioButtonOptions = {
  ';': 'semicolons',
  '\n': 'new lines',
};

export const ImportCardsPopup = ({ showPopup, onClose }: ImportCardsPopupProps) => {
  const [termDefSeparator, setTermDefSeparator] = useState('');
  const [cardSeparator, setCardSeparator] = useState('');
  const [textAreaValue, setTextAreaValue] = useState('');

  const isImportable = termDefSeparator && cardSeparator && textAreaValue.length !== 0;

  return (
    <PopupModal headerLabel="import cards" showTrigger={showPopup} onClose={() => onClose([])}>
      <div className="import-cards-popup-content">
        <div className="import-cards-list-item-label">
          1. what separates the terms and definitions?
        </div>
        <RadioButtonGroup
          radioButtonOptions={termDefSeparatorOptions}
          selectedButtonKey={termDefSeparator}
          onButtonSelect={setTermDefSeparator}
        />
        <div className="import-cards-list-item-label">2. what separates each card?</div>
        <RadioButtonGroup
          radioButtonOptions={cardSeparatorOptions}
          selectedButtonKey={cardSeparator}
          onButtonSelect={setCardSeparator}
        />
        <div className="import-cards-list-item-label">3. add your cards</div>
        <div className="import-cards-input-container">
          <TextArea
            lines={5}
            placeholder="copy and paste your cards here"
            value={textAreaValue}
            onChange={setTextAreaValue}
          />
          <BubbleDivider
            label={'or'}
            variantColor="light"
            className="import-cards-divider"
            buttonClassName="import-cards-divider-button"
          />
          <div className="browse-files-button-container">
            <Button variant="light" onClick={noop} className="import-cards-popup-button">
              browse your files
            </Button>
          </div>
        </div>
      </div>
      <div className="import-cards-submit-button-container">
        <Button
          variant={isImportable ? 'dark' : 'light'}
          disabled={!isImportable}
          onClick={handleImportClick}
          className="import-cards-popup-button"
        >
          import
        </Button>
      </div>
    </PopupModal>
  );

  function handleImportClick() {
    const cardTextArrays = textAreaValue.split(cardSeparator).map((cardText) => {
      return cardText.split(termDefSeparator);
    });

    const wellFormedCardTextArr = cardTextArrays.filter(
      (cardTextArr) => cardTextArr.length >= 2 && (cardTextArr[0] || cardTextArr[1])
    );

    const newCards = wellFormedCardTextArr.map(([frontText, backText]) => {
      const card = createNewCard();
      card.front.text = frontText;
      card.back.text = backText;
      return card;
    });

    setTextAreaValue('');
    onClose(newCards);
  }
};
