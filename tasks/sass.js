import gulp from 'gulp';
import glp from 'gulp-load-plugins';

const plugins = glp();

const sass = ({
  src='**/*.sass',
  includePaths=[],
  dest='dist'
} = {}) => () => gulp.src(src)
.pipe(plugins.sourcemaps.init())
.pipe(plugins.sass({ includePaths }))
.pipe(plugins.pleeease({
  mqpacker: true,
  next: true,
  browsers: ['last 3 versions', '> 5%']
}))
.pipe(plugins.sourcemaps.write())
.pipe(gulp.dest(dest));

export default sass;
