'use strict';


// Path variable
//---
var path = {
	src: 'src/',
	views: 'views/',
	sass: 'src/scss/**/*.scss',
	mainSass: 'src/scss/main.scss',
	script: 'src/js/**/*.js',
	dist: 'public/',
	node: 'node_modules/'
};


// Include gulp
var gulp = require('gulp'); 
// Unsure how to get these to work with gulp-load-plugins
var autoprefixer	= require('autoprefixer-core');
var browserSync		= require('browser-sync').create();
var mqpacker			= require('css-mqpacker');
var nodemon				= require('gulp-nodemon');
var focus					= require('postcss-focus');

// Load all gulp plugins automatically and attach them to the `plugins` object
var plugins = require('gulp-load-plugins')();


// Gulp default task -> what will run if you do "$ gulp" in terminal
//---
gulp.task('default', ['watch'], function () {
});


// Start Browser sync proxy server
//---
gulp.task('browser-sync', ['nodemon'], function() {
	browserSync.init(null, {
		proxy: "http://localhost:5000",
		files: ["public/**/*.*"],
		browser: "google chrome",
		port: 5000
	});
});


// Use nodemon to start express app
//---
gulp.task('nodemon', function (cb) {
	var started = false;
	return nodemon({ script: 'app.js' }).on('start', function () {
		// to avoid nodemon being started multiple times
		// thanks @matthisk
		if (!started) {
			started = true; 
			cb();
		} 
	});
});


// Gulp is AMAZING!
//---
gulp.task('watch', function () {
	gulp.watch( path.sass, ['sass']);
	gulp.watch( path.script, ['script']);
});

// Compile Our less
gulp.task('sass', function() {
	// Make sure our css is compatible with the last two versions of all browsers
	// For all ::hover styles duplicate a ::focus style
	// Condense mediaquery calls
	var processors = [
		autoprefixer({browsers: ['last 2 version']}),
		focus,
		mqpacker,
	];

	return gulp.src( path.mainSass )
	.pipe(plugins.plumber(function(error) {
		plugins.util.log(
			plugins.util.colors.red(error.message),
			plugins.util.colors.yellow('\r\nOn line: '+error.line)
			);
		this.emit('end');
	}))
	.pipe(plugins.sass())
	.pipe(plugins.postcss( processors ))
	.pipe(plugins.minifyCss())
	.pipe(plugins.rename('main.min.css'))
	.pipe(gulp.dest( path.dist + '/stylesheets/' ))
	// .pipe(browserSync.reload({stream:true}));
});

// Concatenate & Minify JS
gulp.task('script', function() {
	return gulp.src( path.script )
	.pipe(plugins.plumber(function(error) {
		plugins.util.log(
			plugins.util.colors.red(error.message),
			plugins.util.colors.yellow('\r\nOn line: '+error.loc.line)
			);
		this.emit('end');
	}))
	.pipe(plugins.concat('main.js'))
	.pipe(plugins.babel())
	.pipe(gulp.dest( path.dist + 'javascripts/'))
	.pipe(plugins.uglify())
	.pipe(plugins.rename('main.min.js'))
	.pipe(gulp.dest( path.dist + 'javascripts/'))
	// .pipe(browserSync.reload({stream:true}));
});

// Migrate Vendor Dependencies 
gulp.task('vendor', function() {

	// materialize sass files
	gulp.src( path.node + 'materialize-css/sass/components/**' )
	.pipe(gulp.dest( path.src + 'scss/materialize' ));

	// materialize js files
	gulp.src( path.node + 'materialize-css/dist/js/materialize.min.js' )
	.pipe(gulp.dest( path.dist + 'javascripts/plugins/' ));

	// materialize font (roboto)
	gulp.src( path.node + 'materialize-css/font/**' )
	.pipe(gulp.dest( path.dist + 'font/' ));

	// jquery dependency
	gulp.src( path.node + 'jquery/dist/jquery.min.js' )
	.pipe(gulp.dest( path.dist + 'javascripts/plugins/' ));

});
