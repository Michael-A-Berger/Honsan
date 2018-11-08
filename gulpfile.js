// Getting the Gulp libraries
const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const nodemon = require('gulp-nodemon');
const eslint = require('gulp-eslint');

// Task Names
const clientTask = 'client';
const sassTask = 'sass';
const lintTask = 'lint';

// File locations
const clientLoc = './client/*.js';
const scssLoc = './scss/*.scss';
const appLoc = './server/app.js';

// ===== GULP TASKS =====

// Client ES6 to ES5
gulp.task(clientTask, () => {
  // WRITTEN
  
  return gulp.src(clientLoc)
          .pipe(babel({
            presets: ['env']
          }))
            .pipe(gulp.dest('hosted'));
});

// SCSS to CSS
gulp.task(sassTask, () => {
  return gulp.src(scssLoc)
          .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest('./hosted/'));
});

// ESLint check
gulp.task(lintTask, () => {
  return gulp.src(['./server/*.js'])
          .pipe(eslint())
            .pipe(eslint.format())
              .pipe(eslint.failAfterError());
});

// Watch
gulp.task('watch', () => {
  // Watching for client ES6 changes
  gulp.watch(clientLoc, [clientTask]);
  
  // Watching for SCSS changes
  gulp.watch(scssLoc, [sassTask]);
  
  // Watching for server-side changes
  nodemon({
    script: appLoc,
    ext: 'js',
    tasks: [lintTask]
  });
});

// Build
gulp.task('build', () => {
  // Starting the defined Gulp tasks
  gulp.start(clientTask);
  gulp.start(sassTask);
  gulp.start(lintTask);
});




















