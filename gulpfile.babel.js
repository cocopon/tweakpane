require('babel-core/register');

const fs = require('fs');
const path = require('path');

const $ = require('gulp-load-plugins')();
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const del = require('del');
const gulp = require('gulp');
const runSequence = require('run-sequence');
const source = require('vinyl-source-stream');

const GulpConfig = require('./gulp_config');
const config = new GulpConfig(!!$.util.env.production);

const through = require('through2');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const postcssModules = require('postcss-modules');

gulp.task('clean', () => {
	return del(config.clean.patterns);
});

gulp.task('main:cjs', () => {
	return gulp.src(config.main.js.srcPattern)
		.pipe($.babel())
		.pipe(gulp.dest(config.main.js.cjsDir));
});

gulp.task('main:js', ['main:cjs'], () => {
	return browserify(config.main.js.indexFile)
		.bundle()
		.pipe(source(config.main.js.dstName))
		.pipe(buffer())
		.pipe(config.forProduction ?
			$.uglify({
				compress: config.uglify.compressor
			}) :
			$.util.noop())
		.pipe(gulp.dest(config.main.js.dstDir))
		.pipe(gulp.dest(config.doc.js.dstDir));
});

gulp.task('doc:js', () => {
	return gulp.src(config.doc.js.srcPattern)
		.pipe($.babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest(config.doc.js.dstDir));
});

gulp.task('doc:nunjucks', () => {
	return gulp.src(config.doc.nunjucks.srcPattern)
		.pipe($.nunjucks.compile(config.getNunjucksData()))
		.pipe(gulp.dest(config.doc.nunjucks.dstDir));
});

gulp.task('main:sass', function(done){
	const tokens = {}
	const processors = [
		autoprefixer(),
		postcssModules({
			generateScopedName: function(name, filename, css) {
				const cursor = css.indexOf('.' + name);
				const line = css.substr(0, cursor).split(/[\r\n]/).length;
				const file = path.basename(filename, '.css');
				return '_' + file + '_' + line + '_' + name + '_';
			},
			getJSON: function(cssFile, json) {
				tokens[cssFile] = json;
			}
		})
	];
	return gulp.src(config.main.sass.srcPattern)
		.pipe($.sass(config.main.sass.options))
		.on('error', $.sass.logError)
		.pipe(postcss(processors))
		.pipe(through.obj(function(chunk, enc, callback){
			const base64 = chunk.contents.toString('base64');
			const contents = {
				tokens: tokens[chunk.path],
				styles: base64
			};
			const code = `module.exports = ${JSON.stringify(contents, null, '  ')}`;
			chunk.contents = new Buffer(code, enc);
			callback(null, chunk);
		}))
		.pipe($.rename(config.main.sass.cjsName))
		.pipe(gulp.dest(config.main.js.cjsDir));
});

gulp.task('doc:sass', () => {
	return gulp.src(config.doc.sass.srcPattern)
		.pipe($.sass()).on('error', $.sass.logError)
		.pipe($.autoprefixer())
		.pipe(gulp.dest(config.doc.sass.dstDir));
});

gulp.task('main:watch', (callback) => {
	gulp.watch(config.main.js.srcPattern, () => {
		gulp.start(['main:js'])
			.on('end', callback);
	});
	gulp.watch(config.main.sass.srcPattern, () => {
		gulp.start(['main:build'])
			.on('end', callback);
	});
});

gulp.task('doc:watch', (callback) => {
	gulp.watch(config.doc.js.srcPattern, () => {
		gulp.start(['doc:js'])
			.on('end', callback);
	});
	gulp.watch(config.doc.nunjucks.pattern, () => {
		gulp.start(['doc:nunjucks'])
			.on('end', callback);
	});
	gulp.watch(config.doc.sass.srcPattern, () => {
		gulp.start(['doc:sass'])
			.on('end', callback);
	});
});

gulp.task('webserver', () => {
	return gulp.src(config.serverDirs)
		.pipe($.webserver({
			host: '0.0.0.0',
			livereload: true
		}));
});

gulp.task('dev', (callback) => {
	runSequence(
		['main:build', 'doc:build'],
		['main:watch', 'doc:watch', 'webserver'],
		callback
	);
});

gulp.task('prerelease', ['main:build'], () => {
	return gulp.src(config.prerelease.js.srcFile)
		.pipe($.rename(config.prerelease.js.dstName))
		.pipe(gulp.dest(config.prerelease.js.dstDir));
});

gulp.task('prepublish', (callback) => {
	runSequence(
		['clean'],
		['main:build'],
		callback
	);
});

gulp.task('main:build', () => runSequence('main:sass', 'main:js'));
gulp.task('doc:build', ['doc:js', 'doc:nunjucks', 'doc:sass']);
gulp.task('default', ['main:build', 'doc:build']);
