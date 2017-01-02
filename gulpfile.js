// gulpfile.js
'use strict'
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var util = require('gulp-util');

var browserify = require('browserify');
var shimify = require('browserify-shim');
var babelify = require('babelify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

// Let watchify can watch unlimited files.
require('events').EventEmitter.defaultMaxListeners = Infinity;

var distTargets = ['index'];

var runServer = function() {
    const App = require('./app.js');
    return true;
}
gulp.task('server', function() {
    var shouldRunServer = (-1 != process.argv.indexOf('-s'));
    if(shouldRunServer) { runServer(); }
    return true;
});

var errorHandler = function(target, error, self) {
    util.log(
        util.colors.red('Browserify error:'),
        util.colors.yellow('[' + target + ']'),
        error.message
    );
    self.emit('end');
}

var jsBundleProcesser = function(bundle, out, dest) {
    var shouldUglify = (-1 != process.argv.indexOf('-u'));

    var tempBuffer = bundle
    .on('error', function(e) { errorHandler(out, e, this); })
    .pipe(source(out))
    .pipe(buffer());

    if(shouldUglify) { tempBuffer = tempBuffer.pipe(uglify()); }

    tempBuffer.pipe(gulp.dest(dest));
    return true;
}

var browserifyFromPath = function(target, path, opt_debug) {
    var browserifiedJs = browserify({
        entries: [path.entryPoint], transform: [babelify, shimify],
        cache: {}, packageCache: {}, fullPaths: false, // Requirement of watchify
        debug: opt_debug || false
    });
    if(-1 != process.argv.indexOf('-w')) {
        var watcher = watchify(browserifiedJs);
        watcher
        .on('update', function (event) {
            var updateStart = Date.now();
            util.log(
                util.colors.cyan('Updating'),
                util.colors.yellow('`' + path.destBuild + '/' + path.out + '`'),
                util.colors.white('by'),
                util.colors.yellow('`' + event[0].replace(__dirname, '.') + '`'),
                util.colors.white('...')
            );
            jsBundleProcesser(watcher.bundle(), path.out, path.destBuild);
            util.log(
                util.colors.cyan('Updated'),
                util.colors.yellow('`' + path.destBuild + '/' + path.out + '`'),
                util.colors.white('for'),
                util.colors.magenta((Date.now() - updateStart) + ' ms')
            );
        });
    }
    var bundle = browserifiedJs.bundle();
    jsBundleProcesser(bundle, path.out, path.destBuild);
    return true;
}

var compileFromTargetToPath = function(app, destPath, debug) {
    var reactPath = {
        entryPoint: './js/' + app + '/react/App.react.js',
        destBuild: destPath + '/js/',
        out: app + '.react.js'
    };
    var corePath = {
        entryPoint: './js/' + app + '/core/App.js',
        destBuild: destPath + '/js/',
        out: app + '.js'
    };

    if(-1 != process.argv.indexOf('-w')) {
        gulp.watch('./js/common/react/*.js', function(event) {
            browserifyFromPath(app, reactPath, debug);
            browserifyFromPath(app, corePath, debug);
        });
    }
    browserifyFromPath(app, reactPath, debug);
    browserifyFromPath(app, corePath, debug);
}

gulp.task('js-dist', function() {
    distTargets.map(function(app) {
        compileFromTargetToPath(app, 'dist/', false);
    })
});

gulp.task('html-dist', function() {
    var tempBundle = gulp.src(['./html/**/*.html']);
    tempBundle.pipe(gulp.dest('dist/html'));
});

gulp.task('compile-lib', function() {
    var bundle = browserify({
        entries: ['./js/lib/lib.js'], transform: [babelify],
        presets: ["react"], debug: false
    })
    .bundle();
    jsBundleProcesser(bundle, 'compiledLib.js', 'dist/js');
    return true;
});

gulp.task('js-lib', function() {
    var shouldUglify = (-1 != process.argv.indexOf('-u'));

    var tmpOutput = gulp.src([
        './js/lib/*.js',
        '!./js/lib/lib.js',
    ])
    .pipe(concat('lib.js'));

    if(shouldUglify) { tmpOutput = tmpOutput.pipe(uglify()); }

    tmpOutput.pipe(gulp.dest('dist/js'));
    
    var tempBundle = gulp.src(['./js/lib/third-party/**/*', './node_modules/jquery/dist/jquery.min.js']);
    tempBundle.pipe(gulp.dest('dist/js/lib'));

});

gulp.task('lib', ['js-lib', 'compile-lib']);
gulp.task('dist', ['js-dist', 'html-dist', 'lib', 'server']);
