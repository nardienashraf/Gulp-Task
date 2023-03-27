const gulp = require("gulp");
const { src, dest, watch, parallel, series } = require("gulp")
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const cleanCss = require('gulp-clean-css');
const browserSync = require('browser-sync');


//All Globs
const globs = {
  html: "project/*.html",
  css: "project/css/**/*.css",
  img: 'project/pics/*',
  js: 'project/js/**/*.js'
}

//Minify Images
function minifyImages() {
  return gulp.src(globs.img)
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'));
}
exports.img = minifyImages



//Minify Html Files
function minifyHtmlFiles() {
  return src(globs.html)
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest('dist'))
}
exports.html = minifyHtmlFiles

//Minify CSS Files
function minifyCssFiles() {
  return src(globs.css)
    .pipe(concat('style.min.css'))
    .pipe(cleanCss())
    .pipe(dest('dist/assets/css'))
}
exports.css = minifyCssFiles

//Minify JS Files
function minifyJsFiles() {
  return src(globs.js, { sourcemaps: true })
    .pipe(concat('all.min.js'))
    .pipe(terser())
    .pipe(dest('dist/assets/js', { sourcemaps: '.' }))
}
exports.js = minifyJsFiles


function serve(cb) {
  browserSync({
    server: {
      baseDir: 'dist/'
    }
  });
  cb()
}

function reloadTask(done) {
  browserSync.reload()
  done()
}

//watch tasks
function watchTask() {
  watch(globs.html, series(minifyHtmlFiles, reloadTask))
  watch(globs.css, series(minifyCssFiles, reloadTask));
  watch(globs.js, series(minifyJsFiles, reloadTask))
  watch(globs.img, series(minifyImages, reloadTask));
}

exports.default = series(parallel(minifyImages, minifyHtmlFiles, minifyCssFiles, minifyJsFiles), serve, watchTask)




