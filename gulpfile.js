//var batch = require('gulp-batch');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var browserSync = require('browser-sync').create();

var clean = require('gulp-clean');
var clearFix = require('postcss-clearfix');

var cssMqpacker = require('css-mqpacker');

var cssNext = require('postcss-cssnext');
var discardComments = require('postcss-discard-comments');
var focus = require('postcss-focus');
var gulp = require('gulp');
var htmlHint = require('gulp-htmlhint');
//var imageOp = require('gulp-image-optimization');
var pug = require('gulp-pug');
var postcss = require('gulp-postcss');
var postcssSVG = require('postcss-svg');
var precss = require('precss');
var px2Rem = require('postcss-pxtorem');
//var responsiveImages = require('postcss-responsive-images');
var short = require ('postcss-short');
//var size = require('postcss-size');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var calc = require("postcss-calc");
var atImport = require("postcss-import");
//var runSequence = require('run-sequence');
rename = require('gulp-rename');

var sass = require('gulp-sass');
//var scss = require('gulp-scss');
var del = require('del');

gulp.task('default', ['server'], function() {
    gulp.watch('src/pug/**', ['pug']);
    gulp.watch('src/html/**',['html']);
    gulp.watch('src/css/**', function(event) {
        gulp.run('css');
    });
    gulp.watch('src/js/**', function(event) {
        gulp.run('scripts');
    });
    gulp.watch('src/images/**/*',['img']);

});
//img
var imagemin     = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
    pngquant     = require('imagemin-pngquant') // Подключаем библиотеку для работы с png
  //  iconfont     = require('gulp-iconfont')

    //cache        = require('gulp-cache') // Подключаем библиотеку кеширования
    ;
function errorHandler(error){
  gutil.log([
    gutil.colors.red.bold(error.name + ' in ' + error.plugin),
    '',
    error.message,
    ''
  ].join('\n'));

  this.emit('end');
}

gulp.task('pug', function() {
  gulp.src('src/pug/**/*.pug')
      .pipe(plumber({errorHandler: errorHandler}))
      .pipe(pug({
        pretty: true,
      }))
      .pipe(gulp.dest('src/html/'))
});

// HTML

gulp.task('html', function() {
  gulp.src('src/html/**/*.html')
      .pipe(plumber({errorHandler: errorHandler}))
      .pipe(htmlHint())
      .pipe(gulp.dest('dist/'))
      .pipe(browserSync.stream());
});

//



// PostCSS
gulp.task('css', function () {

  var processors = [
    focus,
      short,
      postcssSVG({
          paths: ['./dist/images', './dist/images/ico/category'],
          ei:false
      }),
    precss,
    //calc,
    clearFix,
    px2Rem,
    cssMqpacker,
    discardComments,
  ];
  return gulp.src('src/css/*.css')
     // .pipe(plumber({errorHandler: errorHandler}))
      .pipe(sass())
      .pipe(postcss(processors))
      .pipe(rename('main.css'))
      .pipe(gulp.dest('dist/css/'))
      .pipe(browserSync.stream());
});

// Fonts
gulp.task('fonts',function () {
    return gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
});


// JavaScript

gulp.task('scripts', function () {
  return gulp.src([
      'src/js/jquery.js',
      'src/js/common.js',
  ])
      .pipe(uglify())
      .pipe(gulp.dest('dist/js'))
      .pipe(browserSync.stream());
});

//svg-font
// Image files

gulp.task('img', function() {
    return gulp.src('src/images/**/*')
        .pipe(plumber({errorHandler: errorHandler}))
        .pipe(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            une: [pngquant()]
        }))
        .pipe(gulp.dest('dist/images'));
});


//Server

gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "dist"
        },
        open: false
    });

});






