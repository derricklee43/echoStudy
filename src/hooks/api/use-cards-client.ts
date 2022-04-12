import { Card } from '../../models/card';
import { getTestFoxCard } from '../../models/mock/card.mock';

/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Client targetting endpoints for /api/Cards
 */
export function useCardsClient() {
  return {
    // queries
    getCardById,
    getCardsByEmail,
    getCardsByUserId,
    getCardsByDeckId,
    getAllCards,

    // adds & updates
    addCard,
    updateCardById, // there exists the same endpoint for PATCH, but logic seems to be quite similar
    updateCardScoreById,

    // removals
    deleteCardById,
    deleteCardsByUserId,
    deleteCardsByEmail,
    deleteCardsByDeckId,
  };

  ///////////////
  /// queries ///
  ///////////////

  // GET: /api/Cards/{id}
  async function getCardById(id: number): Promise<Card> {
    throw new Error('Not implemented');
  }

  // GET: /api/Cards/UserEmail={userEmail}
  async function getCardsByEmail(userEmail: string): Promise<Card[]> {
    throw new Error('Not implemented');
  }

  // GET: ​/api​/Cards​/User={userId}
  async function getCardsByUserId(userId: number): Promise<Card[]> {
    throw new Error('Not implemented');
  }

  // GET: ​/api​/Cards​/Deck={deckId}
  async function getCardsByDeckId(deckId: number): Promise<Card[]> {
    throw new Error('Not implemented');
  }

  // GET: /api/Cards
  async function getAllCards(): Promise<Card[]> {
    throw new Error('Not implemented');
  }

  //////////////////////
  /// adds & updates ///
  //////////////////////

  // POST: /api/Cards
  async function addCard(card: Card): Promise<Card> {
    throw new Error('Not implemented');
  }

  // PUT: /api/Cards/{id}
  async function updateCardById(id: number, card: Card): Promise<Card> {
    throw new Error('Not implemented');
  }

  // PATCH: /api/Cards/Touch={id}&{score}
  async function updateCardScoreById(id: number, score: number): Promise<void> {
    // note: potentially might be POST in the future
    throw new Error('Not implemented');
  }

  /////////////////
  /// deletions ///
  /////////////////

  // DELETE: /api/Cards/{id}
  async function deleteCardById(id: number): Promise<void> {
    throw new Error('Not implemented');
  }

  // DELETE: /api/Cards/DeleteUserCards={userId}
  async function deleteCardsByUserId(userId: number): Promise<void> {
    throw new Error('Not implemented');
  }

  // DELETE: ​/api​/Cards​/DeleteUserCardsByEmail={userEmail}
  async function deleteCardsByEmail(userEmail: string): Promise<void> {
    throw new Error('Not implemented');
  }

  // DELETE: /api/Cards/DeleteDeckCards={deckId}
  async function deleteCardsByDeckId(deckId: number): Promise<void> {
    throw new Error('Not implemented');
  }
}
