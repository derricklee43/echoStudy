import React, { useEffect, useState } from 'react';
import { BubbleDivider } from '@/components/bubble-divider/bubble-divider';
import { Button } from '@/components/button/button';
import { PopupModal } from '@/components/popup-modal/popup-modal';
import { RadioButtonGroup } from '@/components/radio-button-group/radio-button-group';
import { TextArea } from '@/components/text-area/text-area';
import { Card } from '@/models/card';
import {
  CardSeparator,
  cardSeparatorOptions,
  termDefSeparatorOptions,
  TermSeparator,
} from '@/pages/edit-deck-page/deck-editor/meta-data-editor/popup-types';
import './export-cards-popup.scss';

interface ExportCardsPopupProps {
  title: string;
  cards: Card[];
  showPopup: boolean;
  onClose: () => void;
}

export const ExportCardsPopup = ({ title, cards, showPopup, onClose }: ExportCardsPopupProps) => {
  const [termDefSeparator, setTermDefSeparator] = useState<TermSeparator>(',');
  const [cardSeparator, setCardSeparator] = useState<CardSeparator>(';');
  const [textAreaValue, setTextAreaValue] = useState('');

  const isDownloadable = textAreaValue.length > 0;

  useEffect(() => {
    if (showPopup) {
      const formattedCards = cards
        .filter((card) => card.front.text || card.back.text)
        .map((card) => card.front.text + termDefSeparator + card.back.text)
        .join(cardSeparator);
      setTextAreaValue(formattedCards);
    }
  }, [showPopup, termDefSeparator, cardSeparator]);

  return (
    <PopupModal headerLabel={`export ${title}`} showTrigger={showPopup} onClose={onClose}>
      <div className="export-cards-popup-content">
        <div className="export-cards-list-item-label">
          1. how to separate the terms and definitions?
        </div>
        <RadioButtonGroup
          className="export-cards-button-group"
          variant="light"
          radioButtonOptions={termDefSeparatorOptions}
          selectedButtonId={termDefSeparator}
          onButtonSelect={setTermDefSeparator}
        />
        <div className="export-cards-list-item-label">2. how to separate the cards?</div>
        <RadioButtonGroup
          className="export-cards-button-group"
          variant="light"
          radioButtonOptions={cardSeparatorOptions}
          selectedButtonId={cardSeparator}
          onButtonSelect={setCardSeparator}
        />
        <div className="export-cards-list-item-label">3. export your cards!</div>
        <div className="export-cards-output-container">
          <TextArea
            readonly={true}
            lines={6}
            placeholder="cards you've created will show up here"
            value={textAreaValue}
          />
          <BubbleDivider
            className="export-cards-divider"
            buttonClassName="export-cards-divider-button"
            label={'or'}
            variantColor="light"
          />
          <div className="export-cards-submit-button-container">
            <Button
              className="export-cards-download-button"
              variant="dark"
              disabled={!isDownloadable}
              onClick={handleDownloadClick}
            >
              download file
            </Button>
          </div>
        </div>
      </div>
    </PopupModal>
  );

  function handleDownloadClick() {
    const element = document.createElement('a');
    const file = new Blob([textAreaValue], { type: 'text/plain' });
    const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const safeDate = new Date()
      .toJSON()
      .slice(0, 19)
      .replaceAll(':', '')
      .replaceAll('-', '')
      .replace('T', '-');

    element.href = URL.createObjectURL(file);
    element.download = safeTitle + '-' + safeDate;
    document.body.appendChild(element); // required to work in Firefox

    element.click();
    element.remove();
  }
};
