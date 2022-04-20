import './meta-data-editor.scss';
import React, { useState } from 'react';
import { DeckLanguages, DeckMetaData, Language } from '../../../../models/deck';
import { Button } from '../../../../components/button/button';
import { TextBox } from '../../../../components/text-box/text-box';
import { BubbleDivider } from '../../../../components/bubble-divider/bubble-divider';
import { DropDown } from '../../../../components/drop-down/drop-down';
import { TextArea } from '../../../../components/text-area/text-area';
import { DropDownOption } from '../../../../components/drop-down-options/drop-down-options';
import { ImportCardsPopup } from '../../../import-cards-popup/import-cards-popup';
import { Card } from '../../../../models/card';

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
          onChange={handleDeckTitleChange}
          value={deckMetaData.title}
          label="title"
          placeholder="add a title"
        />
      </div>
      <div className="c-description-and-import-buttons">
        <TextArea
          lines={2}
          label="description"
          variant="dark"
          placeholder="add a description"
          value={deckMetaData.desc}
          onChange={handleDeckDescChange}
        />
        <Button onClick={handleImportClick} size="medium">
          import cards
        </Button>
        <ImportCardsPopup showPopup={showImportModal} onClose={handleImportCardsPopupClose} />
        <Button onClick={handleExportClick} size="medium">
          export deck
        </Button>
      </div>
      <BubbleDivider
        variantType="drop-down"
        variantColor="dark"
        label="advanced settings"
        className="advanced-settings-divider"
      >
        <div className="advanced-settings">
          <DropDown
            label="default term language"
            buttonLabel={deckMetaData.frontLang}
            options={getLanguages()}
            onOptionSelect={handleFrontLanguageSelect}
          />

          <DropDown
            label="default definition language"
            buttonLabel={deckMetaData.backLang}
            options={getLanguages()}
            onOptionSelect={handleBackLanguageSelect}
          />
          <Button onClick={onDeleteClick} size="medium">
            delete deck
          </Button>
        </div>
      </BubbleDivider>
    </div>
  );

  function handleFrontLanguageSelect(option: DropDownOption) {
    const frontLang = option.value as Language;
    onDeckMetaDataChange({ ...deckMetaData, frontLang });
  }

  function handleBackLanguageSelect(option: DropDownOption) {
    const backLang = option.value as Language;
    onDeckMetaDataChange({ ...deckMetaData, backLang });
  }

  function getLanguages(): DropDownOption[] {
    return DeckLanguages.map((lang) => ({ id: lang, value: lang }));
  }

  function handleDeckTitleChange(title: string) {
    onDeckMetaDataChange({ ...deckMetaData, title });
  }

  function handleDeckDescChange(desc: string) {
    onDeckMetaDataChange({ ...deckMetaData, desc });
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
