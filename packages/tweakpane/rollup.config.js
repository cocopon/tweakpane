import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import Alias from '@rollup/plugin-alias';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import Replace from '@rollup/plugin-replace';
import Typescript from '@rollup/plugin-typescript';
import Autoprefixer from 'autoprefixer';
import Postcss from 'postcss';
import Cleanup from 'rollup-plugin-cleanup';
import terser from '@rollup/plugin-terser';
import { compile as sassCompile } from 'sass';

import Package from './package.json' with { type: 'json' };

const dirname = fileURLToPath(new URL('.', import.meta.url));

async function compileCss() {
	const css = (await sassCompile(
		'src/main/sass/bundle.scss',
		{ style: 'compressed' },
	)).css.toString();

	const result = await Postcss([Autoprefixer]).process(css, {
		from: undefined,
	});
	return result.css.replace(/\n/g, '').replace(/'/g, "\\'").trim();
}

function getPlugins(css, shouldMinify) {
	const plugins = [
		Alias({
			entries: [
				{
					find: '@tweakpane/core',
					replacement: resolve(dirname, '../../node_modules/@tweakpane/core/dist/index.js'),
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
			'0.0.0-tweakpane.0': Package.version,
			preventAssignment: true,
		}),
	];
	if (shouldMinify) {
		plugins.push(terser());
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
			format: 'esm',
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
