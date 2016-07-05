const packageJson = require('./package.json');

class GulpConfig {
	constructor(forProduction) {
		this.forProduction = forProduction;
		this.version = packageJson.version;

		this.main = {
			js: {
				srcPattern: './src/main/js/**/*.js',
				entryFile: './src/main/js/browser.js',
				dstDir: './dst',
				dstFile: forProduction ?
					`tweakpane-${this.version}.min.js` :
					`tweakpane-${this.version}.js`
			},
			sass: {
				srcPattern: './src/main/sass/**/*.scss',
				dstDir: './dst',
				dstFile: forProduction ?
					`tweakpane-${this.version}.min.css` :
					`tweakpane-${this.version}.css`,
				options: forProduction ? {
					outputStyle: 'compressed'
				} : {
					outputStyle: 'expanded'
				}
			}
		};

		this.doc = {
			js: {
				srcPattern: './src/doc/js/**/*.js',
				entryFile: './src/doc/js/main.js',
				dstFile: 'doc.js',
				dstDir: './doc/assets/js'
			},
			nunjucks: {
				pattern: './src/doc/nunjucks/**/*.html',
				srcPattern: './src/doc/nunjucks/**/!(_)*.html',
				dstDir: './doc'
			},
			sass: {
				srcPattern: './src/doc/sass/**/*.scss',
				dstDir: './doc/assets/css'
			}
		};

		this.uglify = {
			compressor: this.UGLIFY_COMPRESSOR
		};

		this.serverDirs = [
			'./doc'
		];
	}

	getNunjucksData() {
		return {
			config: {
				production: this.forProduction,
				version: this.version
			}
		};
	}
};

GulpConfig.UGLIFY_COMPRESSOR = {
	sequences: true,
	properties: true,
	dead_code: true,
	drop_debugger: true,
	conditionals: true,
	comparisons: true,
	evaluate: true,
	booleans: true,
	loops: true,
	unused: true,
	hoist_funs: true,
	hoist_vars: false,
	if_return: true,
	join_vars: true,
	cascade: true,
	collapse_vars: true,
	keep_fargs: false,
	keep_fnames: false
};

module.exports = GulpConfig;
