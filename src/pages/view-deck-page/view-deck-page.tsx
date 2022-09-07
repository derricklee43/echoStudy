import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Fade } from '../../animations/fade';
import { Button } from '../../components/button/button';
import { PageHeader } from '../../components/page-header/page-header';
import { ReadOnlyFlashcardSet } from '../../components/read-only-flashcard-set/read-only-flashcard-set';
import { Deck } from '../../models/deck';
import { paths } from '../../routing/paths';
import './view-deck-page.scss';

interface ViewDeckPageProps {
  deck: Deck;
}

export const ViewDeckPage = ({ deck }: ViewDeckPageProps) => {
  const navigate = useNavigate();

  return (
    <Fade className="view-deck-page">
      <div className="view-deck-header">
        <PageHeader
          label={deck.metaData.title}
          onGoBackClick={navigateBackToDecks}
          goBackLabel="back to decks"
        />
        <div>
          <Button onClick={() => navigate(`${paths.study}/${deck.metaData.id}`)} size="medium">
            study
          </Button>
          <Button onClick={() => navigate(`${paths.editDeck}/${deck.metaData.id}`)} size="medium">
            edit
          </Button>
        </div>
      </div>
      <p className="view-deck-deck-description">{deck.metaData.desc}</p>
      <div>{`${deck.cards.length} cards`}</div>
      <div>{`created ${getFormattedDate(deck.metaData.dateCreated)}`}</div>
      <hr className="view-deck-divider" />
      {deck.cards.length > 0 ? (
        <ReadOnlyFlashcardSet cards={deck.cards} />
      ) : (
        <div className="empty-card-set-placeholder">you currently have no cards in this deck</div>
      )}
    </Fade>
  );

  function navigateBackToDecks() {
    navigate(paths.decks);
  }

  function getFormattedDate(date: Date) {
    const year = date.getFullYear();

    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
  }
};
