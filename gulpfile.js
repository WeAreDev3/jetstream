var fs = require('fs'),
    path = require('path'),
    es = require('event-stream')
    gulp = require('gulp'),
    util = require('gulp-util'),
    sass = require('gulp-sass'),
    nodemon = require('gulp-nodemon'),
    rename = require('gulp-rename'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),

    files = {
        'sass': './server/stylesheets/**.scss',
        'js': './server/js/**.js'
    }, dirs = {
        'build': './public',
        'js': './server/js'
    };

gulp.task('css', function () {
    return gulp.src(files.sass)
        .pipe(sass())
        .pipe(gulp.dest('./public/css'));
});

function getFolders(dir){
    return fs.readdirSync(dir).filter(function(file){
        return fs.statSync(path.join(dir, file)).isDirectory();
    });
}

gulp.task('js', function() {
    return es.concat.apply(null, getFolders(dirs.js).map(function(folder) {
        return gulp.src(path.join(dirs.js, folder, '/*.js'))
            .pipe(concat(folder + '.js'))
            .pipe(gulp.dest(dirs.build))
            .pipe(uglify())
            .pipe(rename(folder + '.min.js'))
            .pipe(gulp.dest(dirs.build));
    }));
});

gulp.task('hint', function () {
    return gulp.src(['**.js', '!node_modules/**', '!public/**'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('default', ['css', 'hint', 'js'], function () {
    gulp.watch(files.sass, ['css']);
    gulp.watch(files.js, ['hint', 'js']);
    nodemon({
        'script': 'server.js',
        'ext': 'js,html',
        'ignore': ['public/**', 'node_modules/**', files.js]
    });
});