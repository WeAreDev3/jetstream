var gulp = require('gulp'),
    util = require('gulp-util'),
    sass = require('gulp-sass'),
    nodemon = require('gulp-nodemon'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),

    paths = {
        'sass': './server/stylesheets/*.scss',
        'js': './server/js/*.js'
    };

gulp.task('css', function () {
    gulp.src(paths.sass)
        .pipe(sass())
        .pipe(gulp.dest('./public/css'));
});

gulp.task('js', function () {
    gulp.src(paths.js)
        .pipe(concat('jetstream.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public'));
});

gulp.task('hint', function () {
    gulp.src(['**.js', '!node_modules/**', '!public/**'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('watch', function () {
    gulp.watch(paths.sass, ['css']);
    gulp.watch(paths.js, ['hint', 'js']);
    nodemon({
        'script': 'server.js',
        'ext': 'js,html',
        'ignore': ['public/**', 'node_modules/**']
    });
});

gulp.task('default', ['css', 'hint', 'js', 'watch']);