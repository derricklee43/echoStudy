import './import-cards-popup.scss';
import React, { useState } from 'react';
import { PopupModal } from '../../components/popup-modal/popup-modal';
import { Button } from '../../components/button/button';
import { TextArea } from '../../components/text-area/text-area';
import { Card, createNewCard } from '../../models/card';
import { FileInput, ImportedFile } from '../../components/file-input/file-input';
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

const enum IMPORT_METHODS {
  'FILE' = 'FILE',
  'CLIPBOARD' = 'CLIPBOARD',
}
const importMethodOptions: RadioButtonOptions = {
  [IMPORT_METHODS.FILE]: 'upload file',
  [IMPORT_METHODS.CLIPBOARD]: 'copy and paste',
};

export const ImportCardsPopup = ({ showPopup, onClose }: ImportCardsPopupProps) => {
  const [termDefSeparator, setTermDefSeparator] = useState('');
  const [cardSeparator, setCardSeparator] = useState('');
  const [textAreaValue, setTextAreaValue] = useState('');
  const [importMethod, setImportMethod] = useState('');
  const [importedFile, setImportedFile] = useState<ImportedFile>();

  const isImportable = isImportConfigValid();

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
        <div className="import-cards-list-item-label">3. how to import your cards?</div>
        <RadioButtonGroup
          radioButtonOptions={importMethodOptions}
          selectedButtonKey={importMethod}
          onButtonSelect={setImportMethod}
        />
        <div className="import-cards-input-container"> {getImportComponent()}</div>
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

  function getImportComponent() {
    if (importMethod === IMPORT_METHODS.CLIPBOARD) {
      return (
        <TextArea
          lines={5}
          placeholder="copy and paste your cards here"
          value={textAreaValue}
          onChange={setTextAreaValue}
        />
      );
    }
    if (importMethod === IMPORT_METHODS.FILE) {
      return (
        <FileInput
          className="browse-files-button-container"
          label="browse your files"
          importedFile={importedFile}
          onImportedFileChange={setImportedFile}
        />
      );
    }
    return undefined;
  }

  function handleImportClick() {
    const isImportedFile = importMethod === IMPORT_METHODS.CLIPBOARD;
    const content = isImportedFile ? textAreaValue : importedFile?.content;
    if (content === undefined) {
      return;
    }

    const cardTextArrays = content.split(cardSeparator).map((cardText) => {
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
    setImportedFile(undefined);
    onClose(newCards);
  }

  function isImportConfigValid() {
    if (importMethod === '') {
      return false;
    }
    const content = importMethod === IMPORT_METHODS.FILE ? importedFile?.content : textAreaValue;
    return termDefSeparator && cardSeparator && content?.length;
  }
};
