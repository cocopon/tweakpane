import Replace from '@rollup/plugin-replace';
import Typescript from '@rollup/plugin-typescript';
import Autoprefixer from 'autoprefixer';
import Postcss from 'postcss';
import Cleanup from 'rollup-plugin-cleanup';
import { terser as Terser } from 'rollup-plugin-terser';
import Sass from 'sass';

import Package from './package.json';

async function compileCss() {
	const css = Sass.renderSync({
		file: 'lib/sass/bundle.scss',
		outputStyle: 'compressed',
	}).css.toString();

	const result = await Postcss([Autoprefixer]).process(css, {
		from: undefined,
	});
	return result.css.replace(/'/g, "\\'").trim();
}

function getPlugins(css, shouldMinify) {
	const plugins = [
		Typescript({
			tsconfig: 'lib/tsconfig.json',
		}),
		Replace({
			__css__: css,
		}),
	];
	if (shouldMinify) {
		plugins.push(Terser());
	}
	return [
		...plugins,
		// https://github.com/microsoft/tslib/issues/47
		Cleanup({
			comments: 'none',
		}),
	];
}

export default async () => {
	const production = process.env.BUILD === 'production';
	const postfix = production ? '.min' : '';

	const css = await compileCss();
	return {
		input: 'lib/index.ts',
		output: {
			banner: `/*! Tweakpane ${Package.version} (c) 2016 cocopon, licensed under the MIT license. */`,
			file: `docs/assets/tweakpane${postfix}.js`,
			format: 'umd',
			name: 'Tweakpane',
		},
		plugins: getPlugins(css, production),
	};
};
