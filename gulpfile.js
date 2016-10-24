/*

REQUIRED STUFF
==============
*/

var changed     = require('gulp-changed');
var gulp        = require('gulp');
var sass        = require('gulp-sass');
var sourcemaps  = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var notify      = require('gulp-notify');
var prefix      = require('gulp-autoprefixer');
var minifycss   = require('gulp-minify-css');
var uglify      = require('gulp-uglify');
var cache       = require('gulp-cache');
var concat      = require('gulp-concat');
var util        = require('gulp-util');
var header      = require('gulp-header');
var pixrem      = require('gulp-pixrem');
var minifyhtml  = require('gulp-htmlmin');
var runSequence = require('run-sequence');
var exec        = require('child_process').exec;


/*

ERROR HANDLING
==============
*/

var handleError = function(task) {
  return function(err) {

      notify.onError({
        message: task + ' failed, check the logs..',
        sound: true
      })(err);

    util.log(util.colors.bgRed(task + ' error:'), util.colors.red(err));
  };
};

/*

FILE PATHS
==========
*/

var projectName = 'peikko'
var sassSrc = 'src/sass/**/*.{sass,scss}';
var sassFile = 'src/sass/layout.scss';
var cssDest = 'css';
var jsSrc = 'src/js';
var markupSrc = 'src/*.php';
var markupDest = './';


/*

BROWSERSYNC
===========
*/

gulp.task('browserSync', function() {

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

gulp.task('styles', function() {
  gulp.src(sassFile)

  .pipe(sass({
    compass: false,
    bundleExec: true,
    sourcemap: false,
    style: 'compressed',
    debugInfo: true,
    lineNumbers: true,
    errLogToConsole: true,
    includePaths: [
      'node_modules/',
      // 'bower_components/',
      // require('node-bourbon').includePaths
    ],
  }))

  .on('error', handleError('styles'))
  .pipe(prefix('last 3 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
  .pipe(minifycss({keepBreaks:false,keepSpecialComments:0,}))
  .pipe(pixrem())
  .pipe(gulp.dest(cssDest))
  .pipe(browserSync.stream());

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
          jsSrc + '/ws.js',
          jsSrc + '/sysmon.js',
          jsSrc + '/scripts.js',
        ])
        .pipe(concat('all.js'))
        .pipe(uglify({preserveComments: false, compress: true, mangle: true}).on('error',function(e){console.log('\x07',e.message);return this.end();}))
        .pipe(header(banner, {pkg: pkg, currentDate: currentDate}))
        .pipe(gulp.dest('./js/'));
});


/*

MARKUP
=======
*/

gulp.task('minify-html', function() {
  gulp.src('src/index.php')
    // .pipe(minifyhtml({
    //   collapseWhitespace: false,
    //   removeComments: false,
    //   removeScriptTypeAttributes: true,
    //   removeStyleLinkTypeAttributes: true,
    //   minifyJS: true,
    //   minifyCSS: true
    // }))
    .pipe(gulp.dest('./'))
});

/*

WATCH
=====

Notes:
   - browserSync automatically reloads any files
     that change within the directory it's serving from
*/

// Run the JS task followed by a reload
gulp.task('js-watch', ['js'], browserSync.reload);

gulp.task('watch', ['browserSync'], function() {

  gulp.watch(sassSrc, ['styles']);
  gulp.watch(markupSrc, ['minify-html']);
  gulp.watch(jsSrc + '/**/*.js', ['js-watch']);
});
