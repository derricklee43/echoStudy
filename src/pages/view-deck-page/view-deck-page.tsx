import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Fade } from '../../animations/fade';
import { Button } from '../../components/button/button';
import { PageHeader } from '../../components/page-header/page-header';
import { ReadOnlyFlashcard } from '../../components/read-only-flashcard/read-only-flashcard';
import { getFormattedDate } from '../../helpers/time';
import { useLazyAudioPlayer } from '../../hooks/use-lazy-audio-player';
import { Deck } from '../../models/deck';
import { paths } from '../../routing/paths';
import './view-deck-page.scss';

interface ViewDeckPageProps {
  deck: Deck;
}

export const ViewDeckPage = ({ deck }: ViewDeckPageProps) => {
  const { playLazyAudio } = useLazyAudioPlayer();
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
        getFlashcards()
      ) : (
        <div className="empty-card-set-placeholder">you currently have no cards in this deck</div>
      )}
    </Fade>
  );

  function getFlashcards() {
    return deck.cards.map((card, index) => (
      <div className="view-deck-flashcard-container" key={card.key}>
        <div className="view-deck-flashcard-index">{`${index + 1}.`}</div>
        <ReadOnlyFlashcard
          className="view-deck-flashcard"
          variant="light-blue"
          frontText={card.front.text}
          backText={card.back.text}
          onFrontSpeakerClick={() => playLazyAudio(card.front.audio)}
          onBackSpeakerClick={() => playLazyAudio(card.back.audio)}
        />
      </div>
    ));
  }

  function navigateBackToDecks() {
    navigate(paths.decks);
  }
};
