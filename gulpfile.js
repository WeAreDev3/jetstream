// File includes
var fs = require('fs'), // File system module (built-in)
    path = require('path'), // Path module (built-in)
    es = require('event-stream'), // Event Stream modification utility

    // Gulp + Plugins
    gulp = require('gulp'), // The main gulp module
    util = require('gulp-util'), // gulp utilities
    sass = require('gulp-sass'), // Compile SASS files
    nodemon = require('gulp-nodemon'), // Start nodemon w/ gulp
    rename = require('gulp-rename'), // Rename piped files
    jshint = require('gulp-jshint'), // Log JSHinting to the console
    stylish = require('jshint-stylish'), // Make JSHint look better
    concat = require('gulp-concat'), // Concatenate files together
    uglify = require('gulp-uglifyjs'), // UglifyJS piped files
    changed = require('gulp-changed'), // Filters out the unchanged files

    // Directories and files, for easy access
    files = {
        'sass': './server/stylesheets/**.scss',
        'js': './server/js/**.js',
        'allJS': ['**.js', '!node_modules/**', '!public/**']
    }, dirs = {
        'build': './public',
        'js': './server/js'
    };

// The CSS task
gulp.task('css', function () {
    return gulp.src(files.sass)
        .pipe(changed(dirs.build + '/css')) // Filter out unchanged files
        .pipe(sass()) // Compile SASS to CSS
        .pipe(gulp.dest(dirs.build + '/css')); // Write to disk
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
        return gulp.src(path.join(dirs.js, folder, '/*.js'))
            .pipe(concat(folder + '.js')) // Concatenate all files
            .pipe(gulp.dest(dirs.build)) // Write to disk
            .pipe(uglify()) // Uglify the file
            .pipe(rename(folder + '.min.js')) // Add .min to the filename
            .pipe(gulp.dest(dirs.build)); // Write to disk
    }));
});

// The JSHint task
gulp.task('hint', function () {
    return gulp.src(files.allJS)
        .pipe(jshint()) // JSHint all of our development files
        .pipe(jshint.reporter('jshint-stylish')); // Use the stylish output
});

gulp.task('default', ['css', 'hint', 'js'], function () {
    gulp.watch(files.sass, ['css']); // When sass files are changed run 'css'
    gulp.watch(files.allJS, ['hint', 'js']); // When all js files as changed run 'js'
    nodemon({
        'script': 'server.js',
        'ext': 'js,html',
        'ignore': ['public/**', 'node_modules/**', files.js]
    });
});