import { createStore } from 'redux';

const configureStore = (initialState, appReducer) => createStore(appReducer, initialState);

export default configureStore;
