import './meta-data-editor.scss';
import React from 'react';
import { Deck } from '../../../models/deck';
import { Button } from '../../../components/button/button';
import { TextBox } from '../../../components/text-box/text-box';
import { BubbleDivider } from '../../../components/bubble-divider/bubble-divider';
import { DropDown, DropDownOption } from '../../../components/drop-down/drop-down';
import { Language } from '../../../models/card-content';
import { TextArea } from '../../../components/text-area/text-area';

// Todo: maybe change Language to be enum instead of type
enum Languages {
  'English' = 'English',
  'Spanish' = 'Spanish',
  'German' = 'German',
  'Japanese' = 'Japanese',
}

interface DeckEditorProps {
  deck: Deck;
  onDeckChange: (deck: Deck) => void;
  onDeleteClick: (event: React.MouseEvent) => void;
}

export const MetaDataEditor = ({ deck, onDeckChange, onDeleteClick }: DeckEditorProps) => {
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
        <Button onClick={handleImportClick} className="meta-button">
          import cards
        </Button>
        <Button onClick={handleExportClick} className="meta-button">
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
          <Button onClick={onDeleteClick} className="meta-button">
            delete deck
          </Button>
        </div>
      </BubbleDivider>
    </div>
  );

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
  }

  function handleExportClick() {
    // Todo: finish
    console.log('clicked!');
  }
};
