import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Fade } from '@/animations/fade';
import { BubbleTagList } from '@/components/bubble-tag-list/bubble-tag-list';
import { Button } from '@/components/button/button';
import { NumberedFlashcardSet } from '@/components/numbered-flashcard-set/numbered-flashcard-set';
import { PageHeader } from '@/components/page-header/page-header';
import { Deck } from '@/models/deck';
import { getDeckTags } from '@/pages/view-deck-pages/shared-view-deck-page';
import { paths } from '@/routing/paths';
import './view-personal-deck-page.scss';

interface ViewPersonalDeckPageProps {
  deck: Deck;
}

export const ViewPersonalDeckPage = ({ deck }: ViewPersonalDeckPageProps) => {
  const navigate = useNavigate();
  const tags = [deck.metaData.access.toLocaleLowerCase(), ...getDeckTags(deck)];

  return (
    <Fade className="view-personal-deck-page">
      <div className="view-personal-deck-header">
        <PageHeader label={deck.metaData.title} />
        <div>
          <BubbleTagList tags={['my deck']} variant="blue" />
          <p className="view-personal-deck-description">{deck.metaData.desc}</p>
        </div>

        <div className="action-button-group">
          <Button onClick={() => navigate(`${paths.study}/${deck.metaData.id}`)} size="medium">
            study
          </Button>
          <Button onClick={() => navigate(`${paths.editDeck}/${deck.metaData.id}`)} size="medium">
            edit
          </Button>
        </div>
      </div>
      <BubbleTagList tags={tags} variant="purple" />
      <hr className="view-personal-deck-divider" />
      <NumberedFlashcardSet
        cards={deck.cards}
        emptySetLabel="you currently have no cards in this deck"
      />
    </Fade>
  );
};
