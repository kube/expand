'use strict'

var path = require('path')
var gulp = require('gulp')
var typescript = require('gulp-typescript')
var sourcemaps = require('gulp-sourcemaps')
var mocha = require('gulp-mocha')
var istanbul = require('gulp-istanbul')
var runSequence = require('run-sequence')
var plumber = require('gulp-plumber')

// Library Compilation

var libProject = require('./lib/tsconfig.json')
libProject.files = libProject.files.map(function (name) {
  return path.join('./lib/', name)
})

gulp.task('typescript-lib', function () {
  var tsResult = gulp.src(libProject.files)
    .pipe(sourcemaps.init())
    .pipe(typescript(libProject.compilerOptions))

  return tsResult
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./lib/'))
})

// Spec Compilation

var specProject = require('./spec/tsconfig.json')
specProject.files = specProject.files.map(function (name) {
  return path.join('./spec/', name)
})

gulp.task('typescript-spec', function () {
  var tsResult = gulp.src(specProject.files)
    .pipe(sourcemaps.init())
    .pipe(typescript(specProject.compilerOptions))

  return tsResult
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./spec/dist/'))
})

// Spec testing

gulp.task('mocha', function (next) {
  gulp.src(['./lib/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', function () {
      gulp.src('./spec/dist/**/*.js')
        .pipe(plumber())
        .pipe(mocha())
        .pipe(istanbul.writeReports())
        .pipe(istanbul.enforceThresholds({ thresholds: { global: 75 } }))
        .on('end', next);
    })
})

gulp.task('watch', function () {
  gulp.watch(libProject.files, ['test'])
  gulp.watch(specProject.files, ['test'])
})

gulp.task('test', function () {
  runSequence('build', 'mocha')
})

gulp.task('tdd', function () {
  runSequence('build', ['watch', 'test'])
})

gulp.task('build', ['typescript-lib', 'typescript-spec'])

gulp.task('default', ['tdd'])
