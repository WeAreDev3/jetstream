/*
TODO:
1. Add autoprefixer plugin
*/

// File includes
console.time('Gulp Initialization Time');
var fs = require('fs'), // File system module (built-in)
    path = require('path'), // Path module (built-in)
    es = require('event-stream'), // Event Stream modification utility
    sequence = require('run-sequence'), // Enable sequencing of tasks

    // Gulp + Plugins
    gulp = require('gulp'), // The main gulp module
    sass = require('gulp-sass'), // Compile SASS files
    nodemon = require('gulp-nodemon'), // Start nodemon w/ gulp
    rename = require('gulp-rename'), // Rename piped files
    jshint = require('gulp-jshint'), // Log JSHinting to the console
    stylish = require('jshint-stylish'), // Make JSHint look better
    concat = require('gulp-concat'), // Concatenate files together
    uglify = require('gulp-uglifyjs'), // UglifyJS piped files
    clean = require('gulp-clean'), // Clean out the build folder
    install = require('gulp-install'), // Install new npm packages
    notify = require('gulp-notify'), // Send messages to the system's notifications
    livereload = require('gulp-livereload'), // Set up a LiveReload server

    // Directories and files, for easy access
    files = {
        'sass': './server/stylesheets/**/*.scss',
        'js': './server/**/*.js',
        'allJS': ['*.js', 'server/**/*.js']
    }, dirs = {
        'build': './public',
        'js': './server/js'
    };

// The CSS task
gulp.task('css', function () {
    return gulp.src(files.sass)
        .pipe(sass({
            style: 'compressed',
            errLogToConsole: false,
            onError: function(err) {
                return notify().write(err);
            }
        })) // Compile SASS to CSS
        .pipe(gulp.dest(dirs.build + '/css')) // Write to disk
        .pipe(livereload()); // Start a LiveReload instance
});

// Function that returns an array of all of the
// directories within the given directory
function getFolders(dir){
    // Grab all files & folders, then filter out the ones that
    // aren't directories (i.e. the files)
    return fs.readdirSync(dir).filter(function(file){
        return fs.statSync(path.join(dir, file)).isDirectory();
    });
}

// The JS task
gulp.task('js', function() {
    // For each folder found in server/js, run the following
    return es.concat.apply(null, getFolders(dirs.js).map(function(folder) {
        return gulp.src(path.join(dirs.js, folder, '/*.js')) // All of the files in a folder
            .pipe(concat(folder + '.js')) // Concatenate all files
            .pipe(gulp.dest(dirs.build + '/js')) // Write to disk
            .pipe(uglify()) // Uglify the file
            .pipe(rename(folder + '.min.js')) // Add .min to the filename
            .pipe(gulp.dest(dirs.build + '/js')) // Write to disk
            .pipe(livereload()); // Start a LiveReload Instance
    }));
});

// The JSHint task
gulp.task('hint', function () {
    return gulp.src(files.allJS)
        .pipe(jshint()) // JSHint all of our development files
        // Send the JSHint errors to the OS's notifications api
        .pipe(notify(function (file) {
            if (file.jshint.success) return false;
            var errors = file.jshint.results.map(function (data) {
            if (data.error) {
                return "(" + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
            }
            }).join("\n");
            return file.relative + " (" + file.jshint.results.length + " errors)\n" + errors;
        }))
        .pipe(jshint.reporter('jshint-stylish')); // Use the stylish output

});

// The Build Cleaner
gulp.task('clean', function () {
    return gulp.src(dirs.build).pipe(clean());
});

gulp.task('install', function () {
    return gulp.src('./package.json')
        .pipe(install());
});

gulp.task('watch', function () {
    gulp.watch(files.sass, ['css']); // When sass files are changed run 'css'
    gulp.watch(files.allJS, ['hint', 'js']); // When all js files as changed run 'js'
    nodemon({
        'script': 'server.js',
        'ext': 'js,html',
        'ignore': ['public/**', 'node_modules/**', 'server/*/**']
    });
    console.timeEnd('Gulp Initialization Time');
});

gulp.task('dev', function () {
    sequence('clean', ['install', 'css', 'hint', 'js'], 'watch');
});

gulp.task('default', function () {
    sequence('clean', ['css', 'hint', 'js'], 'watch');
});
