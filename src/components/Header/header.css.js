const styles = ({ color = '#0189BB' } = {}) => {
  const navbar = {
    background: color,
    margin: 0,
    padding: 0,
    border: 'none',
    height: 30
  };
  const menu = {
    margin: 0,
    padding: 0,
    paddingRight: 15,
    float: 'right',
    listStyle: 'none'
  };
  const item = {
    display: 'inline-block'
  };
  const highlight = {
    backgroundColor: '#e27f2e'
  };
  const link = {
    padding: '0 10px',
    textDecoration: 'none',
    display: 'block',
    color: '#fff',
    transition: '0.15s linear all',
    lineHeight: `${navbar.height}px`,
    ':hover': {
      backgroundColor: 'rgba(0,0,0,0.2)'
    }
  };

  return {
    navbar,
    menu,
    item,
    highlight,
    link
  };
};

export default styles;
