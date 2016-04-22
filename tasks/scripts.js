import gulp from 'gulp';
import glp from 'gulp-load-plugins';

const plugins = glp();

const scripts = ({
  src = 'app.{js,jsx}',
  dest = 'dist'
} = {}) => () => gulp.src(src)
.pipe(plugins.jspm({
  plugin: true
}))
.pipe(gulp.dest(dest));

export default scripts;
