import React from 'react';
import { PageRoutes } from './routing/routes';
import { initGlobalState } from './state/init';
import './app.scss';

function App() {
  initGlobalState();
  return (
    <div className="App">
      <PageRoutes />
    </div>
  );
}

export default App;
