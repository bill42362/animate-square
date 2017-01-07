// gulpfile.js
'use strict'
const gulp = require('gulp');
const util = require('gulp-util');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

// Let watchify can watch unlimited files.
require('events').EventEmitter.defaultMaxListeners = Infinity;

const errorHandler = function(target, error, self) {
    util.log(
        util.colors.red('Browserify error:'),
        util.colors.yellow('[' + target + ']'),
        error.message
    );
    self.emit('end');
}

const jsBundleProcesser = function(bundle, out, dest) {
    return bundle
    .on('error', function(e) { errorHandler(out, e, this); })
    .pipe(source(out))
    .pipe(buffer())
    .pipe(gulp.dest(dest));
}

const browserifyFromPath = function(path) {
    var browserifiedJs = browserify({
        entries: [path.entryPoint],
        transform: [babelify],
        debug: true
    });
    var bundle = browserifiedJs.bundle();
    jsBundleProcesser(bundle, path.out, path.destBuild);
    return true;
}

gulp.task('js-dist', function() {
    browserifyFromPath({
        entryPoint: 'js/App.js', out: 'index.js', destBuild: 'dist/js/'
    });
});

gulp.task('html-dist', function() {
    var tempBundle = gulp.src(['./html/**/*.html']);
    tempBundle.pipe(gulp.dest('dist/html'));
});

gulp.task('dist', ['js-dist', 'html-dist']);
gulp.task('default', ['dist']);
