import { resolve } from 'path';
import { fileURLToPath } from 'url';
import Alias from '@rollup/plugin-alias';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import Typescript from '@rollup/plugin-typescript';
import Cleanup from 'rollup-plugin-cleanup';
import terser from '@rollup/plugin-terser';

const dirname = fileURLToPath(new URL('.', import.meta.url));

export default async () => {
	return {
		input: 'src/doc/ts/bundle.ts',
		external: ['dat.gui', 'tweakpane'],
		output: {
			file: `docs/assets/bundle.js`,
			format: 'umd',
			globals: {
				'dat.gui': 'dat',
				tweakpane: 'Tweakpane',
			},
		},
		plugins: [
			Alias({
				entries: [
					{
						find: '@tweakpane/core',
						replacement: resolve(dirname, '../../node_modules/@tweakpane/core/dist/index.js'),
					},
				],
			}),
			Typescript({
				tsconfig: 'src/doc/tsconfig.json',
			}),
			nodeResolve({
				preferBuiltins: false,
			}),
			terser(),
			// https://github.com/microsoft/tslib/issues/47
			Cleanup({
				comments: 'none',
			}),
		],

		onwarn(warning, warn) {
			if (warning.code === 'CIRCULAR_DEPENDENCY') {
				return;
			}
			warn(warning);
		},
	};
};
