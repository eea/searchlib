const path = require('path');
const gulp = require('gulp');
const less = require('gulp-less');
const replace = require('gulp-replace');


function defaultTask(cb) {
  console.log(path.resolve( '../../node_modules'));
  gulp.src('semantic-ui.less')
    .pipe(replace("~semantic-ui-less", "semantic-ui-less"))
    .pipe(replace("../../theme.config", "theme/theme.config"))
    .pipe(less({
      paths: [path.join(__dirname, 'theme'), '../../node_modules']
    }))
    .pipe(gulp.dest('./dest'));

  cb();
}

exports.default = defaultTask
