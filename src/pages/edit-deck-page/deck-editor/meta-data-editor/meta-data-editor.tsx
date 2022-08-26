import './meta-data-editor.scss';
import React, { useState } from 'react';
import {
  DeckMetaData,
  AllDeckLanguages,
  DeckLanguage,
  DeckLanguages,
} from '../../../../models/deck';
import { Button } from '../../../../components/button/button';
import { TextBox } from '../../../../components/text-box/text-box';
import { BubbleDivider } from '../../../../components/bubble-divider/bubble-divider';
import { TextArea } from '../../../../components/text-area/text-area';
import { ImportCardsPopup } from '../../../import-cards-popup/import-cards-popup';
import { Card } from '../../../../models/card';
import { LanguageDropDown } from '../../../../components/language-drop-down/drop-down-options/language-drop-down';
import { SwapIcon } from '../../../../assets/icons/swap-icon/swap-icon';
import { noop } from '../../../../helpers/func';
import { TrashIcon } from '../../../../assets/icons/trash-icon/trash-icon';
import { CardLanguage } from '../../../../models/card-content';

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
          <LanguageDropDown
            languages={AllDeckLanguages}
            label="default term language"
            language={deckMetaData.frontLang}
            onLanguageSelect={handleFrontLanguageSelect}
            variant="dark"
          />
          <LanguageDropDown
            label="default definition language"
            languages={AllDeckLanguages}
            language={deckMetaData.backLang}
            onLanguageSelect={handleBackLanguageSelect}
            variant="dark"
          />
          <Button onClick={onDeleteClick} size="medium">
            delete deck
          </Button>
        </div>
      </BubbleDivider>
    </div>
  );

  function handleFrontLanguageSelect(frontLang: DeckLanguage) {
    onDeckMetaDataChange({ ...deckMetaData, frontLang });
  }

  function handleBackLanguageSelect(backLang: DeckLanguage) {
    onDeckMetaDataChange({ ...deckMetaData, backLang });
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
