import React from 'react';
import TopBar from './TopBar/TopBar';

const Landing = () => (
  <div>
    <TopBar />
    <h1>Landing</h1>
  </div>
);

export default Landing;
export { default as TopBar } from './TopBar/TopBar';
