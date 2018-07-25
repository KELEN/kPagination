const gulp = require('gulp');
const uglify = require('gulp-uglify');
const pump = require('pump');
const rename = require('gulp-rename');


gulp.task('compile', function (cb) {
    pump([
        gulp.src('./src/kPagination.js'),
        uglify({
            mangle: {
                toplevel: true
            }
        }),
        rename('kPagination.min.js'),
        gulp.dest('dist')
    ], cb)
});

gulp.task('watch', function () {
    gulp.watch('./src/kPagination.js', ['compile'])
})