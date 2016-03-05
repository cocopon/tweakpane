const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const browserify = require('browserify');
const babelify = require('babelify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');

const config = {
	js: {
		srcPattern: './src/js/**/*.js',
		entryFile: './src/js/seasoner.js',
		dstDir: './www/assets/js',
		dstFile: 'seasoner.js'
	},
	sass: {
		srcPattern: './src/sass/**/*.scss',
		dstDir: './www/assets/css',
		dstFile: 'seasoner.css'
	},
	serverDir: './www'
};

gulp.task('js', () => {
	return browserify(config.js.entryFile)
		.transform(babelify)
		.bundle()
		.pipe(source(config.js.dstFile))
		.pipe(buffer())
		.pipe(gulp.dest(config.js.dstDir));
});

gulp.task('sass', () => {
	return gulp.src(config.sass.srcPattern)
		.pipe($.sass())
		.pipe($.autoprefixer())
		.pipe(gulp.dest(config.sass.dstDir));
});

gulp.task('watch', (callback) => {
	gulp.watch(config.js.srcPattern, () => {
		gulp.start(['js'])
			.on('end', callback);
	});
	gulp.watch(config.sass.srcPattern, () => {
		gulp.start(['sass'])
			.on('end', callback);
	});
});

gulp.task('build', ['sass', 'js']);

gulp.task('webserver', () => {
	return gulp.src(config.serverDir)
		.pipe($.webserver({
			host: '0.0.0.0',
			livereload: true
		}));
});

gulp.task('dev', ['build', 'watch', 'webserver']);
gulp.task('default', ['build']);
