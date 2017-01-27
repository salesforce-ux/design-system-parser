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
