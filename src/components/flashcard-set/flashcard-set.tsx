import React, { useEffect, useState } from 'react';
import { PanInfo, Reorder, useDragControls } from 'framer-motion';
import { TrashIcon } from '@/assets/icons/trash-icon/trash-icon';
import { Button } from '@/components/button/button';
import { Flashcard } from '@/components/flashcard/flashcard';
import { ReorderButtonStrip } from '@/components/flashcard/reorder-button-strip/reorder-button-strip';
import { Card } from '@/models/card';
import './flashcard-set.scss';

interface FlashcardSetProps {
  className?: string;
  cards: Card[];
  initialActiveCardKey: string;
  onDeleteCardClick: (card: Card) => void;
  onCardReorder: (cards: Card[]) => void;
  onCardChange: (card: Card) => void;
  onRecordAudioClick: (card: Card, side: 'front' | 'back') => void;
}

const DRAG_HANDLE = 'DRAG_HANDLE';

export const FlashcardSet = ({
  className = '',
  cards,
  initialActiveCardKey = '',
  onCardReorder,
  onDeleteCardClick,
  onCardChange,
  onRecordAudioClick,
}: FlashcardSetProps) => {
  const [activeCardKey, setActiveCardKey] = useState(initialActiveCardKey);
  const [draggingKey, setDraggingKey] = useState('');
  const dragControls = useDragControls();
  const dragClass = draggingKey ? 'dragging' : '';

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
            onRecordAudioClick={(isFront) => onRecordAudioClick(card, isFront)}
          />
          <Button onClick={() => onDeleteCardClick(card)} variant="invisible" ariaLabel="trash">
            <TrashIcon variant={variant} />
          </Button>
        </Reorder.Item>
      );
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onDragStart(e: any, info: PanInfo, key: string) {
    if (e.target.classList.contains(DRAG_HANDLE)) {
      setDraggingKey(key);
    } else {
      // pass along the event
      // componentControls is marked as private, workaround
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
};
