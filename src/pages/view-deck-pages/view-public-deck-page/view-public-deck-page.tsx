import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fade } from '@/animations/fade';
import { UpToggle } from '@/animations/up-toggle';
import { LoadingIcon } from '@/assets/icons/loading-icon/loading-icon';
import { AuthorTag } from '@/components/author-tag/author-tag';
import { BubbleTagList } from '@/components/bubble-tag-list/bubble-tag-list';
import { Button } from '@/components/button/button';
import { NumberedFlashcardSet } from '@/components/numbered-flashcard-set/numbered-flashcard-set';
import { PageHeader } from '@/components/page-header/page-header';
import { useDecksClient } from '@/hooks/api/use-decks-client';
import { Deck } from '@/models/deck';
import { getDeckTags } from '@/pages/view-deck-pages/shared-view-deck-page';
import { paths } from '@/routing/paths';
import './view-public-deck-page.scss';

interface ViewPublicDeckPageProps {
  deck: Deck;
}

export const ViewPublicDeckPage = ({ deck }: ViewPublicDeckPageProps) => {
  const [isCopying, setIsCopying] = useState(false);
  const { copyPublicDeck } = useDecksClient();
  const navigate = useNavigate();
  const tags = getDeckTags(deck);

  return (
    <Fade className="view-public-deck-page">
      <div className="view-public-deck-header">
        <PageHeader label={deck.metaData.title} />
        <div>
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
      <BubbleTagList tags={['public deck']} variant="green" />
      <p className="view-public-deck-description">{deck.metaData.desc}</p>
      <AuthorTag
        className="view-public-deck-author-tag"
        username={deck.metaData.ownerUsername}
        profilePicUrl={deck.metaData.ownerProfilePicUrl}
        onClick={() => navigate(`${paths.users}/${deck.metaData.ownerUsername}`)}
      />
      <BubbleTagList tags={tags} variant="purple" />
      <hr className="view-public-deck-divider" />
      <NumberedFlashcardSet cards={deck.cards} emptySetLabel="this deck currently has no cards" />
    </Fade>
  );

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
