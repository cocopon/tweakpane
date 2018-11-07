const Path = require('path');

module.exports = (_env) => {
	return {
		mode: 'development',
		devtool: false,
		entry: {
		bundle: Path.resolve(__dirname, 'src/doc/js/bundle.js'),
		},
		output: {
		path: Path.resolve(__dirname, 'docs/assets/'),
		filename: 'bundle.js',
		},
		module: {
		rules: [
			{
				test: /\.js$/,
				include: [Path.resolve(__dirname, 'src/doc/js/')],
				exclude: /node_modules/,
				loader: 'babel-loader',
			},
		],
		},
		resolve: {
			extensions: ['.js'],
		},
	};
};
