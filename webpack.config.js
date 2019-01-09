const Path = require('path');

module.exports = (_env, argv) => {
	const postfix = (argv.mode === 'production') ?
		'.min' :
		'';
	return {
		devtool: false,
		entry: {
			bundle: Path.resolve(__dirname, 'src/main/js/index.ts'),
		},
		output: {
			path: Path.resolve(__dirname, 'docs/assets/'),
			filename: `tweakpane${postfix}.js`,
			// See: https://github.com/webpack/webpack/issues/6522
			globalObject: 'typeof self !== \'undefined\' ? self : this',
			library: {
				amd: 'tweakpane',
				commonjs: 'tweakpane',
				root: 'Tweakpane',
			},
			libraryExport: 'default',
			libraryTarget: 'umd',
		},
		module: {
			rules: [
				{
					test: /\.ts$/,
					include: [Path.resolve(__dirname, 'src/main/js/')],
					exclude: /node_modules/,
					loader: 'awesome-typescript-loader',
					options: {
						configFileName: 'src/main/tsconfig.json',
					},
				}, {
					test: /\.s?css$/,
					include: [Path.resolve(__dirname, 'src/main/sass/')],
					exclude: /node_modules/,
					use: [
						{
							loader: 'css-loader',
						}, {
							loader: 'postcss-loader',
						}, {
							loader: 'sass-loader',
							options: {
								outputStyle: 'compressed',
							},
						}
					],
				},
			],
		},
		resolve: {
			extensions: ['.js', '.ts'],
		},
	};
};
