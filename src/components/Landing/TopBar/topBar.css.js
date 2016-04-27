const item = {
  padding: 0,
  paddingLeft: 15,
  paddingRight: 15
};

const navbar = {
  padding: 15,
  backgroundColor: '#009bd4'
};

const brand = {
  ...item,
  extend: item,
  paddingRight: 30,
  float: 'left'
};

const link = {
  ...item,
  extend: item,
  color: '#fff',
  fontWeight: 700,
  lineHeight: '50px'
};

const styles = () => ({
  navbar,
  brand,
  link
});

export default styles;
