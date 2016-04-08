import {connect} from 'react-redux';
import React, {Component, PropTypes} from 'react';
import {onChange} from './searchActions';

let SearchBox = ({query, dispatch}) => (
  <input
    className="form-control"
    onChange={({target}) => {
      dispatch(onChange(target.value))
    }}
    type="text"
    value={query}
    placeholder="Pesquise vagas de voluntariado"
  />
);

const mapStateToProps = (state, props) => ({
  ...props,
  ...state.search
});

SearchBox = connect(mapStateToProps)(SearchBox);

SearchBox.propTypes = {
  query: PropTypes.string.isRequired
};

export default SearchBox;
