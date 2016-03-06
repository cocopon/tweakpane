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
		dstDir: './doc/assets',
		dstFile: 'seasoner.js'
	},
	nunjucks: {
		pattern: './src/nunjucks/**/*.html',
		srcPattern: './src/nunjucks/**/!(_)*.html',
		dstDir: './doc'
	},
	sass: {
		srcPattern: './src/sass/**/*.scss',
		dstDir: './doc/assets',
		dstFile: 'seasoner.css'
	},
	serverDir: './doc'
};

gulp.task('js', () => {
	return browserify(config.js.entryFile)
		.transform(babelify)
		.bundle()
		.pipe(source(config.js.dstFile))
		.pipe(buffer())
		.pipe(gulp.dest(config.js.dstDir));
});

gulp.task('nunjucks', () => {
	return gulp.src(config.nunjucks.srcPattern)
		.pipe($.nunjucks.compile())
		.pipe(gulp.dest(config.nunjucks.dstDir));
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
	gulp.watch(config.nunjucks.pattern, () => {
		gulp.start(['nunjucks'])
			.on('end', callback);
	});
	gulp.watch(config.sass.srcPattern, () => {
		gulp.start(['sass'])
			.on('end', callback);
	});
});

gulp.task('build', ['sass', 'js', 'nunjucks']);

gulp.task('webserver', () => {
	return gulp.src(config.serverDir)
		.pipe($.webserver({
			host: '0.0.0.0',
			livereload: true
		}));
});

gulp.task('dev', ['build', 'watch', 'webserver']);
gulp.task('default', ['build']);
