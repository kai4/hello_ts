const gulp = require('gulp');
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const tsify = require("tsify");
const watchify = require('watchify');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');

const destDir = "dist";

const paths = {
    pages:['src/*.html']
};

const watchedBrowserify = watchify(browserify({
    basedir: '.',
    debug: true,
    entries: ['src/main.ts'],
    cache: {},
    packageCache: {}
}).plugin(tsify));

gulp.task("copy-html", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest(destDir));
});

function bundle() {
    return watchedBrowserify
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write('./', /*{
            sourceRoot: function (file) {
                return "../src";
            }
        }*/))
        .pipe(gulp.dest(destDir));
}

gulp.task("default", gulp.parallel('copy-html', bundle));
watchedBrowserify.on("update", bundle);