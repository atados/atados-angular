import {createStore, compose} from 'redux';

let devtools = (f) => f;

if (typeof window === 'object' && typeof window.devToolsExtension !== 'undefined') {
  devtools = window.devToolsExtension();
}

const initialState = {};
const reducer = (state = { number: 0 }, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        number: state.number + 1
      };
      break;
    case 'DECREMENT':
      return {
        ...state,
        number: state.number - 1
      };
      break;
    default:
      return state;
      break;
  }
};

const store = createStore(reducer, compose(devtools));

export default store;
