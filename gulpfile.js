'use strict';
 
const gulp        = require('gulp');
const sass        = require('gulp-sass');
const sourcemaps  = require('gulp-sourcemaps');
const rename      = require("gulp-rename");

const pathApp   = "";
const pathDist  = "./app/styles";

gulp.task('sass', function () {
  return gulp.src('sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(sourcemaps.write('map/' ))
    .pipe(rename('style.css'))
    .pipe(gulp.dest( pathDist ));
});
 
gulp.task('watch', ['sass'], function () {
  gulp.watch('./'+pathApp+'/sass/**/*.scss', ['sass']);
  // Other watchers
});