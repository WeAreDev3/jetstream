var gulp = require('gulp'),
    sass = require('gulp-sass'),
    nodemon = require('gulp-nodemon'),

    paths = {
        'sass': './server/stylesheets/*.scss',
        'js': './public/js/*.js'
    };

gulp.task('css', function () {
    gulp.src(paths['sass'])
        .pipe(sass())
        .pipe(gulp.dest('./public/css'));
});

gulp.task('watch', function () {
    gulp.watch(paths['sass'], ['css']);
    nodemon({
        'script': 'server.js',
        'ignore': ['node_modules']
    })
});

gulp.task('default', ['css', 'watch']);