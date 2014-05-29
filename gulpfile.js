var gulp = require('gulp'),
    util = require('gulp-util'),
    sass = require('gulp-sass'),
    nodemon = require('gulp-nodemon'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),

    paths = {
        'sass': './server/stylesheets/*.scss',
        'js': './server/js/*.js'
    };

gulp.task('css', function () {
    gulp.src(paths['sass'])
        .pipe(sass())
        .pipe(gulp.dest('./public/css'));
});

gulp.task('js', function () {
    gulp.src('server/js/**.js')
        .pipe(concat('jetstream.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/js/jetstream.min.js'));
});

gulp.task('hint', function () {
    gulp.src(['**.js', '!node_modules/**', '!public/**'])
        .pipe(jshint);
});

gulp.task('watch', function () {
    gulp.watch(paths['sass'], ['css']);
    gulp.watch(paths['js'], ['hint', 'js']);
    nodemon({
        'script': 'server.js',
        'ext': 'js,html',
        'ignore': ['public/**', 'node_modules/**']
    });
});

gulp.task('default', ['css', 'hint', 'js', 'watch']);