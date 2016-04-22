import React from 'react';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { Routes } from './components/index.js';
import { LookRoot } from 'react-look';

const main = (path, store, stylesConfig) => renderToString(
  <LookRoot config={stylesConfig}>
    <Provider store={store}>
      <Routes path={path} />
    </Provider>
  </LookRoot>
);

export default main;
