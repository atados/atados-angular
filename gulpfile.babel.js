import gulp from 'gulp';
import requireDir from 'require-dir';
import sequence from 'run-sequence';

const tasks = requireDir('./tasks');

gulp.task('clean', tasks.clean());
gulp.task('scripts', tasks.scripts({
  src: 'src/app.js'
}));

gulp.task('build', () => sequence('clean', ['scripts']));

gulp.task('default', ['build']);
