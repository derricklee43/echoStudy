import React, { ReactNode, useState } from 'react';
import { Button } from '../../components/button/button';
import { FileInput, ImportedFile } from '../../components/file-input/file-input';
import { PopupModal } from '../../components/popup-modal/popup-modal';
import {
  RadioButtonGroup,
  RadioButtonOption,
} from '../../components/radio-button-group/radio-button-group';
import { TextArea } from '../../components/text-area/text-area';
import { Card, createNewCard } from '../../models/card';
import './import-cards-popup.scss';

type TermSeparator = ' ' | ',';
type CardSeparator = ';' | '\n';
type ImportMethod = 'FILE' | 'CLIPBOARD';

const termDefSeparatorOptions: RadioButtonOption<TermSeparator, string>[] = [
  { id: ',', value: 'commas' },
  { id: ' ', value: 'spaces' },
];

const cardSeparatorOptions: RadioButtonOption<CardSeparator, string>[] = [
  { id: ';', value: 'semicolons' },
  { id: '\n', value: 'new lines' },
];

const importMethodOptions: RadioButtonOption<ImportMethod, string>[] = [
  { id: 'FILE', value: 'upload file' },
  { id: 'CLIPBOARD', value: 'copy and paste' },
];

interface ImportCardsPopupProps {
  showPopup: boolean;
  onClose: (importedCards: Card[]) => void;
}

export const ImportCardsPopup = ({ showPopup, onClose }: ImportCardsPopupProps) => {
  const [termDefSeparator, setTermDefSeparator] = useState<TermSeparator>(',');
  const [cardSeparator, setCardSeparator] = useState<CardSeparator>(';');
  const [textAreaValue, setTextAreaValue] = useState('');
  const [importMethod, setImportMethod] = useState<ImportMethod>('FILE');
  const [importedFile, setImportedFile] = useState<ImportedFile>();

  const isImportable = isImportConfigValid();

  return (
    <PopupModal headerLabel="import cards" showTrigger={showPopup} onClose={() => onClose([])}>
      <div className="import-cards-popup-content">
        <div className="import-cards-list-item-label">
          1. what separates the terms and definitions?
        </div>
        <RadioButtonGroup
          className="import-cards-button-group"
          variant="light"
          radioButtonOptions={termDefSeparatorOptions}
          selectedButtonId={termDefSeparator}
          onButtonSelect={setTermDefSeparator}
        />
        <div className="import-cards-list-item-label">2. what separates each card?</div>
        <RadioButtonGroup
          className="import-cards-button-group"
          variant="light"
          radioButtonOptions={cardSeparatorOptions}
          selectedButtonId={cardSeparator}
          onButtonSelect={setCardSeparator}
        />
        <div className="import-cards-list-item-label">3. how to import your cards?</div>
        <RadioButtonGroup
          className="import-cards-button-group"
          variant="light"
          radioButtonOptions={importMethodOptions}
          selectedButtonId={importMethod}
          onButtonSelect={onImportMethodChange}
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

  function onImportMethodChange(newImportMethod: ImportMethod) {
    if (newImportMethod == importMethod) {
      return;
    }
    setImportedFile(undefined);
    setTextAreaValue('');
    setImportMethod(newImportMethod);
  }

  function getImportComponent() {
    const importComponents: Record<ImportMethod, ReactNode> = {
      CLIPBOARD: (
        <TextArea
          lines={5}
          placeholder="copy and paste your cards here"
          value={textAreaValue}
          onChange={setTextAreaValue}
        />
      ),
      FILE: (
        <FileInput
          className="browse-files-button-container"
          label="choose a file"
          importedFile={importedFile}
          onImportedFileChange={setImportedFile}
        />
      ),
    };

    return importComponents[importMethod];
  }

  function handleImportClick() {
    const isImportedFile = importMethod === 'CLIPBOARD';
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
      card.front.text = frontText.trim();
      card.back.text = backText.trim();
      return card;
    });

    setTextAreaValue('');
    setImportedFile(undefined);
    onClose(newCards);
  }

  function isImportConfigValid() {
    const content = importMethod === 'FILE' ? importedFile?.content : textAreaValue;
    return content?.length;
  }
};
