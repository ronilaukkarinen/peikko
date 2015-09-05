/* 

REQUIRED STUFF
==============
*/

var changed     = require('gulp-changed');
var gulp        = require('gulp');
var imagemin    = require('gulp-imagemin');
var sass        = require('gulp-sass');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
var notify      = require('gulp-notify');
var prefix      = require('gulp-autoprefixer');
var minifycss   = require('gulp-minify-css');
var uglify      = require('gulp-uglify');
var cache       = require('gulp-cache');
var concat      = require('gulp-concat');
var util        = require('gulp-util');
var header      = require('gulp-header');
var pixrem      = require('gulp-pixrem');
var pagespeed   = require('psi');
var minifyhtml  = require('gulp-minify-html');
var runSequence = require('run-sequence');
var exec        = require('child_process').exec;


/* 

FILE PATHS
==========
*/

var projectName = 'peikko'
var imgSrc = 'src/images/*.{png,jpg,jpeg,gif}';
var imgDest = 'images';
var sassSrc = 'src/sass/**/*.{sass,scss}';
var sassFile = 'src/sass/layout.scss';
var cssDest = 'css';
var jsSrc = 'src/js';
var jsDest = 'js';
var markupSrc = 'src/*.php';
var markupDest = './';


/* 

BROWSERSYNC
===========
*/

gulp.task('browsersync', function() {

  var files = [
    cssDest + '/**/*.{css}',
    jsSrc + '/**/*.js',
    markupSrc
  ];

  browserSync.init(files, {
    proxy: projectName + '.dev',
    browser: "Google Chrome",
    notify: true
  });

});


/* 

SASS
====
*/

gulp.task('sass', function() {
  gulp.src(sassFile)

    .pipe(sass({
        compass: false,
        bundleExec: true,
        sourcemap: false,
        style: 'compressed',
        debugInfo: true,
        lineNumbers: true,
        errLogToConsole: true
      })) 

  .pipe(prefix('last 3 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4')) //adds browser prefixes (eg. -webkit, -moz, etc.)
  .pipe(minifycss({keepBreaks:false,keepSpecialComments:0,}))
  .pipe(pixrem())
  .pipe(gulp.dest(cssDest))
  .pipe(browserSync.stream())

  });


/* 

SCRIPTS
=======
*/

var currentDate   = util.date(new Date(), 'dd-mm-yyyy HH:ss');
var pkg           = require('./package.json');
var banner        = '/*! <%= pkg.name %> <%= currentDate %> - <%= pkg.author %> */\n';

gulp.task('js', function() {

      gulp.src(
        [
          jsSrc + '/jquery.js',
          jsSrc + '/pace.js',
          jsSrc + '/jquery.zlastfm.js',
          jsSrc + '/ws.js',
          jsSrc + '/sysmon.js',
          jsSrc + '/scripts.js',
        ])
        .pipe(concat('all.js'))
        .pipe(uglify({preserveComments: false, compress: true, mangle: true}).on('error',function(e){console.log('\x07',e.message);return this.end();}))
        .pipe(header(banner, {pkg: pkg, currentDate: currentDate}))
        .pipe(gulp.dest(jsDest));
});


/* 

MARKUP
=======
*/

gulp.task('minify-html', function() {

  gulp.src(markupSrc)
    .pipe(minifyhtml({
      empty: true,
      cdata: false,
      comments: true,
      conditionals: false,
      spare: false,
      quotes: true,
      loose: false
    }))
    .pipe(gulp.dest(markupDest))
    exec("cp index.php /Volumes/Root/var/www/html/");

});

/*

WATCH
=====

*/

// Run the JS task followed by a reload
gulp.task('js-watch', ['js'], browserSync.reload);
gulp.task('watch', ['browsersync'], function() {

  gulp.watch(sassSrc, ['sass']);
  gulp.watch(markupSrc, ['minify-html']);
  gulp.watch(jsSrc, ['js']);

});