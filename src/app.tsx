import React from 'react';
import './app.scss';
import { useState } from 'react';
import { Sidebar } from './components/sidebar/sidebar';
import { Header } from './components/header/header';
import { PageRoutes } from './routes';
import { userDecksState } from './state/user-decks';
import { useRecoilValue } from 'recoil';

function App() {
  const userDecks = useRecoilValue(userDecksState);

  return (
    <div className="App">
      <Header decks={userDecks} />
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
