import React from 'react';
import './app.scss';
import { useState } from 'react';
import { Sidebar } from './components/sidebar/sidebar';
import { Header } from './components/header/header';
import {
  testEnglishDeck,
  testJapaneseVerbsDeck,
  testNPTEPartNumberDeck,
} from './models/mock/deck.mock';
import { PageRoutes } from './routes';

const testDecks = [testEnglishDeck(0), testJapaneseVerbsDeck(1), testNPTEPartNumberDeck(2, 1)];

function App() {
  const [showDecks, setShowDecks] = useState(true);

  return (
    <div className="App">
      <Header decks={testDecks} />
      <Sidebar />
      <div className="page-wrap">
        <div className="content">
          <PageRoutes />
        </div>
      </div>
    </div>
  );
}

export default App;
