import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { Header } from './components/header/header';
import { Sidebar } from './components/sidebar/sidebar';
import { userDecksSortedState } from './state/user-decks';
import { PageRoutes } from './routes';
import './app.scss';

function App() {
  const userDecks = useRecoilValue(userDecksSortedState);

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
