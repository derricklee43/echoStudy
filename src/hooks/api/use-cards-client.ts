import { Card } from '../../models/card';

/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Client targetting endpoints for /Cards
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

  // GET: /Cards/{id}
  async function getCardById(id: number): Promise<Card> {
    throw new Error('Not implemented');
  }

  // GET: /Cards/UserEmail={userEmail}
  async function getCardsByEmail(userEmail: string): Promise<Card[]> {
    throw new Error('Not implemented');
  }

  // GET: ​/Cards​/User={userId}
  async function getCardsByUserId(userId: number): Promise<Card[]> {
    throw new Error('Not implemented');
  }

  // GET: /Cards​/Deck={deckId}
  async function getCardsByDeckId(deckId: number): Promise<Card[]> {
    throw new Error('Not implemented');
  }

  // GET: /Cards
  async function getAllCards(): Promise<Card[]> {
    throw new Error('Not implemented');
  }

  //////////////////////
  /// adds & updates ///
  //////////////////////

  // POST: /Cards
  async function addCard(card: Card): Promise<Card> {
    throw new Error('Not implemented');
  }

  // PUT: /Cards/{id}
  async function updateCardById(id: number, card: Card): Promise<Card> {
    throw new Error('Not implemented');
  }

  // PATCH: /Cards/Touch={id}&{score}
  async function updateCardScoreById(id: number, score: number): Promise<void> {
    // note: potentially might be POST in the future
    throw new Error('Not implemented');
  }

  /////////////////
  /// deletions ///
  /////////////////

  // DELETE: /Cards/{id}
  async function deleteCardById(id: number): Promise<void> {
    throw new Error('Not implemented');
  }

  // DELETE: /Cards/DeleteUserCards={userId}
  async function deleteCardsByUserId(userId: number): Promise<void> {
    throw new Error('Not implemented');
  }

  // DELETE: /Cards​/DeleteUserCardsByEmail={userEmail}
  async function deleteCardsByEmail(userEmail: string): Promise<void> {
    throw new Error('Not implemented');
  }

  // DELETE: /Cards/DeleteDeckCards={deckId}
  async function deleteCardsByDeckId(deckId: number): Promise<void> {
    throw new Error('Not implemented');
  }
}
