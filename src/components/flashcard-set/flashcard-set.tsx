import './flashcard-set.scss';
import React from 'react';
import { Flashcard } from '../flashcard/flashcard';
import { useState } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { Card } from '../../models/card';
import { useEffect } from 'react';
import { ReorderButtonStrip } from '../flashcard/reorder-button-strip/reorder-button-strip';
import { Button } from '../button/button';
import { TrashIcon } from '../../assets/icons/trash-icon/trash-icon';

interface FlashcardSetProps {
  className?: string;
  cards: Card[];
  initialActiveCardKey: string;
  onDeleteCardClick: (card: Card) => void;
  onCardReorder: (cards: Card[]) => void;
  onCardChange: (card: Card) => void;
}

const DRAG_HANDLE = 'DRAG_HANDLE';

export const FlashcardSet = ({
  className = '',
  cards,
  initialActiveCardKey = '',
  onCardReorder,
  onDeleteCardClick,
  onCardChange,
}: FlashcardSetProps) => {
  const [activeCardKey, setActiveCardKey] = useState(initialActiveCardKey);
  const [draggingKey, setDraggingKey] = useState('');
  const dragControls = useDragControls();
  const dragClass = draggingKey && 'dragging';

  console.log(dragClass);

  useEffect(() => {
    setActiveCardKey(initialActiveCardKey);
  }, [initialActiveCardKey]);

  return (
    <div className={`c-flashcard-set ${className} ${dragClass}`}>
      <Reorder.Group axis="y" values={cards} onReorder={onCardReorder}>
        {getCards()}
      </Reorder.Group>
    </div>
  );

  function getCards() {
    return cards.map((card, index) => {
      const variant = card.key === activeCardKey ? 'active' : 'inactive';
      return (
        <Reorder.Item
          key={card.key}
          className="card-with-buttons"
          value={card}
          onDragStart={(e, info) => onDragStart(e, info, card.key)}
          onDragEnd={() => setDraggingKey('')}
          dragControls={dragControls}
        >
          <ReorderButtonStrip
            variant={variant}
            isDragging={card.key === draggingKey}
            dragHandle={DRAG_HANDLE}
            index={index + 1}
            onUpClick={() => handleUpClick(index)}
            onDownClick={() => handleDownClick(index)}
          />
          <Flashcard
            card={card}
            variant={variant}
            onFocus={() => setActiveCardKey(card.key)}
            onCardChange={onCardChange}
            onSpeakerClick={handleSpeakerClick}
          />
          <Button onClick={() => onDeleteCardClick(card)} variant="invisible" ariaLabel="trash">
            <TrashIcon variant={variant} />
          </Button>
        </Reorder.Item>
      );
    });
  }

  function onDragStart(e: any, info: any, key: string) {
    if (e.target.classList.contains(DRAG_HANDLE)) {
      setDraggingKey(key);
    } else {
      // pass along the event
      // componentControls is marked as private, workaround
      (dragControls as any).componentControls.forEach((entry: any) => entry.stop(e, info));
    }
  }

  function handleUpClick(index: number) {
    const newCards = [...cards];
    if (index === 0) {
      const [firstCard] = newCards.splice(index, 1);
      onCardReorder([...newCards, firstCard]);
    } else {
      newCards[index] = newCards.splice(index - 1, 1, cards[index])[0];
      onCardReorder(newCards);
    }
  }

  function handleDownClick(index: number) {
    if (index === cards.length - 1) {
      const newCards = [...cards];
      const [lastCard] = newCards.splice(index, 1);
      onCardReorder([lastCard, ...newCards]);
    } else {
      const newCards = [...cards];
      newCards[index] = newCards.splice(index + 1, 1, cards[index])[0];
      onCardReorder(newCards);
    }
  }

  function handleSpeakerClick(audioFile?: HTMLAudioElement) {
    if (audioFile === undefined) {
      console.log('Audio file was undefined');
      return;
    }
    console.log('played audio', audioFile);
    audioFile?.play();
  }
};
