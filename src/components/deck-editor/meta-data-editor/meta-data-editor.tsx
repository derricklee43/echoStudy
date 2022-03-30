import './meta-data-editor.scss';
import React from 'react';
import { Deck } from '../../../models/deck';
import { Button } from '../../button/button';
import { TextBox } from '../../text-box/text-box';
import { BubbleDivider } from '../../bubble-divider/bubble-divider';

interface DeckEditorProps {
  deck: Deck;
  onDeckChange: (deck: Deck) => void;
}

export const MetaDataEditor = ({ deck, onDeckChange }: DeckEditorProps) => {
  return (
    <div className="deck-meta">
      <div className="deck-editor-header">
        <label>edit a deck</label>
        <Button onClick={handleStudyClick} className="editor-button">
          study
        </Button>
      </div>
      <div className="title">
        <TextBox
          variant="dark"
          placeholder="title"
          onChange={handleDeckTitleChange}
          value={deck.title}
        />
      </div>
      <div className="c-description-and-import-buttons">
        <TextBox
          variant="dark"
          placeholder="add a description"
          value={deck.desc}
          onChange={handleDeckDescChange}
        />
        <Button onClick={handleImportClick} className="editor-button">
          import cards
        </Button>
        <Button onClick={handleExportClick} className="editor-button">
          export deck
        </Button>
      </div>
      <BubbleDivider
        variant="dark-drop-down"
        label="advanced settings"
        className="advanced-settings"
      >
        hello world
      </BubbleDivider>
    </div>
  );

  function handleDeckTitleChange(title: string) {
    //Todo do deep copy
    onDeckChange({ ...deck, title });
  }

  function handleDeckDescChange(desc: string) {
    //Todo do deep copy
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

  function handleStudyClick() {
    // Todo: finish
    console.log('clicked!');
  }
};
