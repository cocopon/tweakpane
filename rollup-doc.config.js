import Typescript from '@rollup/plugin-typescript';
import Cleanup from 'rollup-plugin-cleanup';
import {terser as Terser} from 'rollup-plugin-terser';

export default async () => {
	return {
		input: 'src/doc/ts/bundle.ts',
		output: {
			file: `docs/assets/bundle.js`,
		},
		plugins: [
			Typescript({
				tsconfig: 'src/doc/tsconfig.json',
			}),
			Terser(),
			// https://github.com/microsoft/tslib/issues/47
			Cleanup({
				comments: 'none',
			}),
		],
	};
};
