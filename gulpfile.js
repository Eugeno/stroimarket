'use strict';

const gulp = require('gulp');
const concatCss = require('gulp-concat-css');
const del = require('del');
const plumber = require('gulp-plumber');
const server = require('browser-sync').create();
const minify = require('gulp-csso');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

gulp.task('style', function () {
  return gulp.src([
    'css/normalize.css',
    'css/fonts.css',
    'css/lib/*.css',
    'css/main.css',
    'css/grid.css',
    'css/form-elements/*.css',
    'css/form.css',
    'css/header/*.css',
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

gulp.task('scripts', function () {
  return gulp.src('js/main.js')
    .pipe(plumber())
    .pipe(babel({
      presets: [
        ['env', {
          'targets': {
            'browsers': ['last 2 versions']
          }
        }]
      ]
    }))
    .pipe(gulp.dest('build/js'))
    .pipe(uglify())
    .pipe(rename('main.min.js'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('copy-html', function () {
  return gulp.src([
    '*.html',
    'pages/**/*.html'
  ])
  .pipe(gulp.dest('build'))
  .pipe(server.stream());
});

gulp.task('copy', ['copy-html', 'scripts', 'style'], function () {
  return gulp.src([
    'fonts/**/*.{woff,woff2}',
    'manifest.json',
    'favicon-16.png',
    'favicon-32.png',
    'apple-touch-icon.png',
    'android-chrome-192.png',
    'android-chrome-512.png',
    'img/**/*.*',
    'js/lib/*.*'
  ], {base: '.'})
  .pipe(gulp.dest('build'));
});

gulp.task('clean', function () {
  return del('build');
});

gulp.task('js-watch', ['scripts'], function (done) {
  server.reload();
  done();
});

gulp.task('css-watch', ['style'], function (done) {
  server.reload();
  done();
});

gulp.task('serve', ['assemble'], function () {
  server.init({
    server: buildPath,
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
