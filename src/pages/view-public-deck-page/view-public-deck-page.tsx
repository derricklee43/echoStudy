import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fade } from '@/animations/fade';
import { UpToggle } from '@/animations/up-toggle';
import { LoadingIcon } from '@/assets/icons/loading-icon/loading-icon';
import { Button } from '@/components/button/button';
import { PageHeader } from '@/components/page-header/page-header';
import { ReadOnlyFlashcard } from '@/components/read-only-flashcard/read-only-flashcard';
import { getFormattedDate } from '@/helpers/time';
import { useDecksClient } from '@/hooks/api/use-decks-client';
import { useLazyAudioPlayer } from '@/hooks/use-lazy-audio-player';
import { Deck } from '@/models/deck';
import { paths } from '@/routing/paths';
import './view-public-deck-page.scss';

interface ViewPublicDeckPageProps {
  deck: Deck;
}

export const ViewPublicDeckPage = ({ deck }: ViewPublicDeckPageProps) => {
  const [isCopying, setIsCopying] = useState(false);
  const { playLazyAudio } = useLazyAudioPlayer();
  const { copyPublicDeck } = useDecksClient();
  const navigate = useNavigate();

  return (
    <Fade className="view-deck-page">
      <div className="view-deck-header">
        <PageHeader label={deck.metaData.title} />
        <p className="view-deck-deck-description">{deck.metaData.desc}</p>
        <div className="action-button-group">
          <Button onClick={copyDeck} size="medium" disabled={isCopying}>
            <UpToggle
              showDefault={!isCopying}
              defaultContent="copy deck"
              alternateContent={
                <div className="copy-deck-loading">
                  <LoadingIcon />
                  copying
                </div>
              }
            />
          </Button>
        </div>
      </div>
      <div>{`${deck.cards.length} cards`}</div>
      <div>{`created ${getFormattedDate(deck.metaData.dateCreated)}`}</div>
      <hr className="view-deck-divider" />
      {deck.cards.length > 0 ? (
        getFlashcards()
      ) : (
        <div className="empty-card-set-placeholder">this deck currently has no cards</div>
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

  async function copyDeck() {
    setIsCopying(true);
    try {
      const newDeckId = await copyPublicDeck(deck.metaData.id);
      navigate(`${paths.deck}/${newDeckId}`);
    } catch (e) {
      console.error(e);
      setIsCopying(false);
    }
  }
};
