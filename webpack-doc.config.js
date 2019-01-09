const Path = require('path');

module.exports = (_env) => {
	return {
		mode: 'development',
		devtool: false,
		entry: {
			bundle: Path.resolve(__dirname, 'src/doc/js/bundle.ts'),
		},
		output: {
			path: Path.resolve(__dirname, 'docs/assets/'),
			filename: 'bundle.js',
		},
		module: {
		rules: [
			{
				test: /\.ts$/,
				include: [Path.resolve(__dirname, 'src/doc/js/')],
				exclude: /node_modules/,
				loader: 'awesome-typescript-loader',
				options: {
					configFileName: 'src/doc/tsconfig.json',
				},
			},
		],
		},
		resolve: {
			extensions: ['.js', '.ts'],
		},
	};
};
