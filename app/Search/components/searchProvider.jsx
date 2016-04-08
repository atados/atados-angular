import React, {PropTypes} from 'react';
import {Provider} from 'react-redux';
import configureStore from './configureStore';
import SearchBox from './SearchBox.jsx!';

const SearchProvider = (props) => (
  <Provider store={configureStore()}>
    <SearchBox {...props} />
  </Provider>
);

SearchProvider.propTypes = {
  query: PropTypes.string.isRequired
};

export default SearchProvider;
