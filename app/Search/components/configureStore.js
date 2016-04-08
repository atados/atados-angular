import {createStore, combineReducers} from 'redux';
import search from './searchReducer';

const appReducer = combineReducers({
  search
});

export default function configureStore (initialState) {
  if (System.trace) {
    if (window.store == undefined) {
      window.store = createStore(appReducer, initialState);
      window.store.replaceReducer(appReducer);
    }
    return window.store;
  } else {
      return createStore(appReducer, initialState);
  }
};
