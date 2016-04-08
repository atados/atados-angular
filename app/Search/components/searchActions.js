export const QUERY = 'QUERY';

export const onChange = (value) => ({
  type: QUERY,
  query: value
});

export default {
  onChange
}
