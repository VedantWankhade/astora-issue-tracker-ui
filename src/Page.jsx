import React from 'react';
import { HashRouter } from 'react-router-dom';
import Contents from './Contents.jsx';

function NavBar() {
  return (
    <nav>
      <a href="/">Home</a>
      {' | '}
      <a href="/#/issues">Issue List</a>
      {' | '}
      <a href="/#/report">Report</a>
    </nav>
  );
}

export default function Page() {
  return (
    <div>
      <NavBar />
      <HashRouter>
        <Contents />
      </HashRouter>
    </div>
  );
}
