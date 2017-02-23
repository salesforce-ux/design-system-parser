// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

const del = require('del')
const gulp = require('gulp')
const ignore = require('gulp-ignore')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')

gulp.task('clean', () =>
  del('.dist')
)

gulp.task('default', ['clean'], () =>
  gulp
    .src('lib/**/*.js')
    .pipe(ignore.exclude(/__/))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify({
      preserveComments: 'license'
    }))
    .on('error', e => {
      console.log(e)
    })
    .pipe(gulp.dest('.dist'))
)
