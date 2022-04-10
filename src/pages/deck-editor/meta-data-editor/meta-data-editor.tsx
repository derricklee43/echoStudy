import './meta-data-editor.scss';
import React, { useState } from 'react';
import { Deck, DeckLanguages, Language } from '../../../models/deck';
import { Button } from '../../../components/button/button';
import { TextBox } from '../../../components/text-box/text-box';
import { BubbleDivider } from '../../../components/bubble-divider/bubble-divider';
import { DropDown, DropDownOption } from '../../../components/drop-down/drop-down';
import { TextArea } from '../../../components/text-area/text-area';
import { PopupModal } from '../../../components/popup-modal/popup-modal';

interface DeckEditorProps {
  deck: Deck;
  onDeckChange: (deck: Deck) => void;
  onDeleteClick: (event: React.MouseEvent) => void;
}

export const MetaDataEditor = ({ deck, onDeckChange, onDeleteClick }: DeckEditorProps) => {
  const [showImportModal, setShowImportModal] = useState(false);

  return (
    <div className="deck-meta">
      <div className="deck-meta-title">
        <TextBox
          variant="dark"
          onChange={handleDeckTitleChange}
          value={deck.title}
          label="title"
          placeholder="add a title..."
        />
      </div>
      <div className="c-description-and-import-buttons">
        <TextArea
          lines={2}
          label="description"
          variant="dark"
          placeholder="add a description"
          value={deck.desc}
          onChange={handleDeckDescChange}
        />
        <Button onClick={handleImportClick} size="medium">
          import cards
        </Button>
        {getImportPopupModal()}
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
            buttonLabel={deck.frontLang}
            options={getLanguages()}
            onOptionSelect={handleFrontLanguageSelect}
          />

          <DropDown
            label="default definition language"
            buttonLabel={deck.backLang}
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

  function getImportPopupModal() {
    return (
      <PopupModal
        headerLabel="Import Popup"
        showTrigger={showImportModal}
        onClose={() => setShowImportModal(false)}
      >
        <p>example popup example popup example popup example popup</p>
        <p>
          <textarea />
        </p>
        <button onClick={() => alert('clicked in content of modal')}>inner button</button>
        <p>example popup example popup example popup example popup</p>
      </PopupModal>
    );
  }

  function handleFrontLanguageSelect(option: DropDownOption) {
    const frontLang = option.value as Language;
    onDeckChange({ ...deck, frontLang });
  }

  function handleBackLanguageSelect(option: DropDownOption) {
    const backLang = option.value as Language;
    onDeckChange({ ...deck, backLang });
  }

  function getLanguages(): DropDownOption[] {
    return DeckLanguages.map((lang) => ({ id: lang, value: lang }));
  }

  function handleDeckTitleChange(title: string) {
    onDeckChange({ ...deck, title });
  }

  function handleDeckDescChange(desc: string) {
    onDeckChange({ ...deck, desc });
  }

  function handleImportClick() {
    setShowImportModal(true);
  }

  function handleExportClick() {
    console.log('clicked!');
  }
};
