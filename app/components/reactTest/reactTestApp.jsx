import 'systemjs-hot-reloader/default-listener.js';
import React from 'react';
import {render} from 'react-dom';
import {createStore, compose} from 'redux';
import Hello from './Hello.jsx!';
import store from './store';

const renderApp = () => {
  render(
    <Hello {...store.getState()} onClick={() => store.dispatch({ type: 'INCREMENT' })} />,
    document.getElementById('reactTestApp')
  );
};

const unsubscribe = store.subscribe(renderApp);
renderApp();
