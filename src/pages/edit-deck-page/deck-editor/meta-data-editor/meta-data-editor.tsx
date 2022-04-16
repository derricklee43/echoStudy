import './meta-data-editor.scss';
import React, { useState } from 'react';
import { DeckLanguages, DeckMetaData, Language } from '../../../../models/deck';
import { Button } from '../../../../components/button/button';
import { TextBox } from '../../../../components/text-box/text-box';
import { BubbleDivider } from '../../../../components/bubble-divider/bubble-divider';
import { DropDown } from '../../../../components/drop-down/drop-down';
import { TextArea } from '../../../../components/text-area/text-area';
import { PopupModal } from '../../../../components/popup-modal/popup-modal';
import { DropDownOption } from '../../../../components/drop-down-options/drop-down-options';

interface DeckEditorProps {
  deckMetaData: DeckMetaData;
  onDeckMetaDataChange: (metaData: DeckMetaData) => void;
  onDeleteClick: (event: React.MouseEvent) => void;
}

export const MetaDataEditor = ({
  deckMetaData,
  onDeckMetaDataChange,
  onDeleteClick,
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

  function handleExportClick() {
    console.log('clicked!');
  }
};
