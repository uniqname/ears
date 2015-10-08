import gulp from 'gulp';
import gutil from 'gulp-util';
import babelify from 'babelify';
import browserify from 'browserify';
import uglify from 'gulp-uglify';
import source from 'vinyl-source-stream';
import streamify from 'gulp-streamify';
import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';


gulp.task('default', ['build', 'copy']);

gulp.task('build', function (done) {
    let bundler = browserify({ debug: true });

    bundler.transform(babelify);
    bundler.add('./src/ears.js');

    bundler.bundle()
        .on('error', gutil.log)
        .pipe(source('./ears.js'))
        .pipe(streamify(sourcemaps.init()))
        .pipe(gulp.dest('./dist'))
        .pipe(streamify(uglify()))
        .pipe(streamify(sourcemaps.write()))
        .pipe(rename('ears.min.js'))
        .pipe(gulp.dest('./dist'));

    done();
});

gulp.task('copy', function () {
    return gulp.src('ears.html')
        .pipe(gulp.dest('./dist'));
});
