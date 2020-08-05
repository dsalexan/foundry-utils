const gulp = require('gulp')
const clipboard = require('gulp-clipboard')
const run = require('gulp-run')

function bundle() {
  return gulp.src(['.']).pipe(run('yarn bundle'))
}

function copy() {
  return gulp.src(['./dist/iife.js']).pipe(clipboard())
}

exports.bundle = bundle
exports.copy = copy

exports.publish = gulp.series(bundle, copy)
