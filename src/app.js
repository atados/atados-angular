import React from 'react';
import { Provider } from 'react-redux';
import { render, unmountComponentAtNode } from 'react-dom';
import { Routes, configureStore } from './components/index.js';
import { Presets, LookRoot } from 'react-look'
import appReducer from './components/appReducer';

const initialState = window.atadosInitialState || {};
const store = configureStore(initialState, appReducer);
const mountPoint = document.getElementById('reactRoot');
const path = window.location.pathname;
const stylesConfig = Presets['react-dom'];
stylesConfig.styleElementId = '_look';

render(
  <LookRoot config={stylesConfig}>
    <Provider store={store}>
      <Routes path={path} />
    </Provider>
  </LookRoot>,
  mountPoint
);

export function __reload() {
  store.replaceReducer(appReducer);
}

export function __unload () {
  unmountComponentAtNode(mountPoint);
}
