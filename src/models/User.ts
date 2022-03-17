import { Language } from './CardContent';
import { Deck } from './Deck';
import { DeckCategory } from './DeckCategory';
import { Session } from './Session';

// highly WIP, refers to EchoUser
// iterate on this as backend is created [MS Identity]
export interface User {
  id: number;
  username: string;
  settings: UserSettings;
  ownedDecks: Deck[];
  ownedDeckCategories: DeckCategory[];
  session?: Session;
}

export interface UserSettings {
  playbackSpeed: number;
  language: Language;
}
