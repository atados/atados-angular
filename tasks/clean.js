import gulp from 'gulp';
import del from 'del';

export default function (globs=['dist']) {
  return () => del(globs);
};
