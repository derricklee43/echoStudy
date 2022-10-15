export interface UpdateCardScoreRequest {
  id: number;
  score: number;
}

export interface NewCardsResponse {
  ids: number[];
  dateCreated: Date; // shared for all created cards
}
