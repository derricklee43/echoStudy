import './meta-data-editor.scss';
import React, { useState } from 'react';
import { Deck } from '../../../models/deck';
import { Button } from '../../button/button';
import { TextBox } from '../../text-box/text-box';
import { BubbleDivider } from '../../bubble-divider/bubble-divider';
import { DropDown, DropDownOption } from '../../drop-down/drop-down';
import { Language } from '../../../models/card-content';
import { TextArea } from '../../text-area/text-area';
import { PopupModal } from '../../popup-modal/popup-modal';

// Todo: maybe change Language to be enum instead of type
enum Languages {
  'English' = 'English',
  'Spanish' = 'Spanish',
  'German' = 'German',
  'Japanese' = 'Japanese',
}

interface DeckEditorProps {
  label: string;
  deck: Deck;
  onDeckChange: (deck: Deck) => void;
}

export const MetaDataEditor = ({ label, deck, onDeckChange }: DeckEditorProps) => {
  const [showImportModal, setShowImportModal] = useState(false);

  return (
    <div className="deck-meta">
      <div className="deck-editor-header">
        <label>{label}</label>
        <Button onClick={handleStudyClick} className="editor-button">
          study
        </Button>
      </div>
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
        <Button onClick={handleImportClick} className="editor-button">
          import cards
        </Button>
        {getImportPopupModal()}
        <Button onClick={handleExportClick} className="editor-button">
          export deck
        </Button>
      </div>
      <BubbleDivider
        variant="dark-drop-down"
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
          <Button onClick={handleDeckDeleteClick} className="meta-button">
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

  function handleDeckDeleteClick(event: React.MouseEvent) {
    // Todo: finish
    console.log('clicked!');
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
    return Object.values(Languages).map((l) => ({ id: l, value: l }));
  }

  function handleDeckTitleChange(title: string) {
    //Todo: do deep copy
    onDeckChange({ ...deck, title });
  }

  function handleDeckDescChange(desc: string) {
    //Todo: do deep copy
    onDeckChange({ ...deck, desc });
  }

  function handleImportClick() {
    //Todo: finish
    console.log('clicked!');
    setShowImportModal(true);
  }

  function handleExportClick() {
    // Todo: finish
    console.log('clicked!');
  }

  function handleStudyClick() {
    // Todo: finish
    console.log('clicked!');
  }
};
