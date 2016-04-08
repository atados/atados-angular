const doQuery = () => [];

const searchReducer = function (state = {}, action) {
  switch (action.type) {
    case 'QUERY':
      return {
        ...state,
        query: action.query,
        result: doQuery(action.query)
      }
    default:
      return state;
  }
}

export default searchReducer;
