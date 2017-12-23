'use strict';

const gulp = require('gulp');
const concatCss = require('gulp-concat-css');
const del = require('del');
const plumber = require('gulp-plumber');
const server = require('browser-sync').create();
const minify = require('gulp-csso');
const rename = require('gulp-rename');

gulp.task('style', function () {
  return gulp.src([
    'css/normalize.css',
    'css/fonts.css',
    'css/main.css',
    'css/**/*.css'
  ])
  .pipe(concatCss('style.css'))
  .pipe(plumber())
  .pipe(gulp.dest('build/css'))
  .pipe(server.stream())
  .pipe(minify())
  .pipe(rename('style.min.css'))
  .pipe(gulp.dest('build/css'));
});

gulp.task('copy-html', function () {
  return gulp.src([
    '*.{html,ico}',
    'pages/**/*.html'
  ])
  .pipe(gulp.dest('build'))
  .pipe(server.stream());
});

gulp.task('copy', ['copy-html', 'style'], function () {
  return gulp.src([
    'fonts/**/*.{woff,woff2}',
    'img/*.*'
  ], {base: '.'})
  .pipe(gulp.dest('build'));
});

gulp.task('clean', function () {
  return del('build');
});

gulp.task('css-watch', ['style'], function (done) {
  server.reload();
  done();
});

gulp.task('serve', ['assemble'], function () {
  server.init({
    server: './build',
    notify: false,
    open: true,
    port: 3502,
    ui: false
  });

  gulp.watch(['*.html', 'pages/**/*.html']).on('change', function (e) {
    if (e.type !== 'deleted') {
      gulp.start('copy-html');
    }
  });
  gulp.watch('js/**/*.js', ['js-watch']);
  gulp.watch('css/**/*.css', ['css-watch']);
});

gulp.task('assemble', ['clean'], function () {
  gulp.start('copy', 'style');
});

gulp.task('build', ['assemble']);
