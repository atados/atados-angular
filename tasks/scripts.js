import gulp from 'gulp';
import glp from 'gulp-load-plugins';

const plugins = glp();

function scripts ({src='app.{js,jsx}', dest='dist'} = {}) {
  return () => gulp.src(src)
  .pipe(plugins.ngAnnotate())
  .pipe(plugins.jspm({
    plugin: 'jsx'
  }))
  .pipe(gulp.dest(dest));
};

export default scripts;
