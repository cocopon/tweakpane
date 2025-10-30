import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import Alias from '@rollup/plugin-alias';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import Typescript from '@rollup/plugin-typescript';

const dirname = fileURLToPath(new URL('.', import.meta.url));

export default () => {
	return {
		input: 'plugin/src/index.ts',
		external: ['tweakpane'],
		output: {
			file: 'plugin/dist/bundle.js',
			format: 'esm',
			globals: {
				tweakpane: 'Tweakpane',
			},
			name: 'TweakpanePluginExample',
		},
		plugins: [
			Alias({
				entries: [
					{
						find: '@tweakpane/core',
						replacement: resolve(dirname, '../node_modules/@tweakpane/core/dist/index.js'),
					},
				],
			}),
			Typescript({
				tsconfig: 'plugin/tsconfig.json',
			}),
			nodeResolve(),
		],

		onwarn(warning, warn) {
			if (warning.code === 'CIRCULAR_DEPENDENCY') {
				return;
			}
			warn(warning);
		},
	};
};
