class GulpConfig {
	static get(forProduction) {
		return {
			main: {
				js: {
					srcPattern: './src/main/js/**/*.js',
					entryFile: './src/main/js/tweakpane.js',
					tmpDir: './tmp/js',
					dstFile: forProduction ?
						'tweakpane.min.js' :
						'tweakpane.js',
					dstDir: './dst'
				},
				sass: {
					srcPattern: './src/main/sass/**/*.scss',
					tmpDir: './tmp/css',
					dstFile: 'tweakpane.css'
				},
				cssMarker: '.css_replace_me{}'
			},
			doc: {
				nunjucks: {
					pattern: './src/doc/nunjucks/**/*.html',
					srcPattern: './src/doc/nunjucks/**/!(_)*.html',
					dstDir: './doc'
				},
				sass: {
					srcPattern: './src/doc/sass/**/*.scss',
					dstDir: './doc'
				}
			},
			uglify: {
				compressor: this.UGLIFY_COMPRESSOR
			},
			serverDirs: [
				'./doc',
				'./dst'
			]
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
