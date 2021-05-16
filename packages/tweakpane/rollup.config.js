import Alias from '@rollup/plugin-alias';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import Replace from '@rollup/plugin-replace';
import Typescript from '@rollup/plugin-typescript';
import Autoprefixer from 'autoprefixer';
import NodeSass from 'node-sass';
import Postcss from 'postcss';
import Cleanup from 'rollup-plugin-cleanup';
import {terser as Terser} from 'rollup-plugin-terser';

import Package from './package.json';

async function compileCss() {
	const css = NodeSass.renderSync({
		file: 'src/main/sass/bundle.scss',
		outputStyle: 'compressed',
	}).css.toString();

	const result = await Postcss([Autoprefixer]).process(css, {
		from: undefined,
	});
	return result.css.replace(/'/g, "\\'").trim();
}

function getPlugins(css, shouldMinify) {
	const plugins = [
		Alias({
			entries: [
				{
					find: '@tweakpane/core',
					replacement: './node_modules/@tweakpane/core/dist/es6/index.js',
				},
			],
		}),
		Typescript({
			tsconfig: 'src/main/tsconfig.json',
		}),
		nodeResolve({
			preferBuiltins: false,
		}),
		Replace({
			__css__: css,
			'3.14.16': Package.version,
			preventAssignment: true,
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
	// eslint-disable-next-line no-undef
	const production = process.env.BUILD === 'production';
	const postfix = production ? '.min' : '';

	const css = await compileCss();
	return {
		input: 'src/main/ts/index.ts',
		output: {
			banner: `/*! Tweakpane ${Package.version} (c) 2016 cocopon, licensed under the MIT license. */`,
			file: `docs/assets/tweakpane${postfix}.js`,
			format: 'umd',
			name: 'Tweakpane',
		},
		plugins: getPlugins(css, production),

		onwarn(warning, warn) {
			if (warning.code === 'CIRCULAR_DEPENDENCY') {
				return;
			}
			warn(warning);
		},
	};
};
