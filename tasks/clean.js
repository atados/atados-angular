import del from 'del';

const clean = (globs = ['dist']) => () => del(globs);

export default clean;
