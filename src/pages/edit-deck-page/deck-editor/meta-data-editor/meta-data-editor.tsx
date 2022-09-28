import React, { useState } from 'react';
import { BubbleDivider } from '../../../../components/bubble-divider/bubble-divider';
import { Button } from '../../../../components/button/button';
import { LanguageDropDown } from '../../../../components/language-drop-down/drop-down-options/language-drop-down';
import {
  RadioButtonGroup,
  RadioButtonOption,
} from '../../../../components/radio-button-group/radio-button-group';
import { TextArea } from '../../../../components/text-area/text-area';
import { TextBox } from '../../../../components/text-box/text-box';
import { Card } from '../../../../models/card';
import { Access, DeckMetaData } from '../../../../models/deck';
import { AllDeckLanguages } from '../../../../models/language';
import { ImportCardsPopup } from '../../../import-cards-popup/import-cards-popup';
import './meta-data-editor.scss';

interface DeckEditorProps {
  deckMetaData: DeckMetaData;
  onDeckMetaDataChange: (metaData: DeckMetaData) => void;
  onDeleteClick: (event: React.MouseEvent) => void;
  onImportedCardsAdd: (cards: Card[]) => void;
}

export const MetaDataEditor = ({
  deckMetaData,
  onDeckMetaDataChange,
  onDeleteClick,
  onImportedCardsAdd,
}: DeckEditorProps) => {
  const [showImportModal, setShowImportModal] = useState(false);
  return (
    <div className="deck-meta">
      <div className="deck-meta-title">
        <TextBox
          variant="dark"
          onChange={(title) => handleDeckUpdate('title', title)}
          value={deckMetaData.title}
          label="title"
          placeholder="add a title"
        />
      </div>
      <div className="c-description-and-import-buttons">
        <TextArea
          className="description-text-area"
          lines={2}
          label="description"
          variant="dark"
          placeholder="add a description"
          value={deckMetaData.desc}
          onChange={(desc) => handleDeckUpdate('desc', desc)}
        />
        <div className="popup-buttons">
          <Button onClick={handleImportClick} size="medium">
            import cards
          </Button>
          <ImportCardsPopup showPopup={showImportModal} onClose={handleImportCardsPopupClose} />
          <Button onClick={handleExportClick} size="medium">
            export deck
          </Button>
        </div>
      </div>
      <BubbleDivider
        variantType="drop-down"
        variantColor="dark"
        label="advanced settings"
        className="advanced-settings-divider"
      >
        <div className="advanced-settings">
          <LanguageDropDown
            languages={AllDeckLanguages}
            label="default term language"
            language={deckMetaData.frontLang}
            onLanguageSelect={(lang) => handleDeckUpdate('frontLang', lang)}
            variant="dark"
          />
          <LanguageDropDown
            label="default definition language"
            languages={AllDeckLanguages}
            language={deckMetaData.backLang}
            onLanguageSelect={(lang) => handleDeckUpdate('backLang', lang)}
            variant="dark"
          />
          <div>
            <div className="deck-meta-access-level-label">who can see your deck?</div>
            <RadioButtonGroup
              variant="dark"
              onButtonSelect={(access) => handleDeckUpdate('access', access)}
              selectedButtonId={deckMetaData.access}
              radioButtonOptions={getAccessOptions()}
            />
          </div>
          <Button onClick={onDeleteClick} size="medium">
            delete deck
          </Button>
        </div>
      </BubbleDivider>
    </div>
  );

  function getAccessOptions(): RadioButtonOption<Access, string>[] {
    return [
      { id: 'Private', value: 'just me' },
      { id: 'Public', value: 'everyone' },
    ];
  }

  function handleDeckUpdate<T extends keyof DeckMetaData>(key: T, value: DeckMetaData[T]) {
    onDeckMetaDataChange({ ...deckMetaData, [key]: value });
  }

  function handleImportClick() {
    setShowImportModal(true);
  }

  function handleImportCardsPopupClose(cards: Card[]) {
    setShowImportModal(false);
    onImportedCardsAdd(cards);
  }

  function handleExportClick() {
    console.log('clicked!');
  }
};
