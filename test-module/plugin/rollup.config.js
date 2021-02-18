import Typescript from '@rollup/plugin-typescript';
import NodeSass from 'node-sass';

export default () => {
	// eslint-disable-next-line no-undef
	console.log(
		NodeSass.renderSync({
			file: 'plugin/src/plugin.scss',
		}).css.toString(),
	);

	return {
		input: 'plugin/src/index.ts',
		external: ['tweakpane'],
		output: {
			file: 'plugin/dist/bundle.js',
			format: 'umd',
			globals: {
				tweakpane: 'Tweakpane',
			},
			name: 'TweakpanePluginExample',
		},
		plugins: [
			// NOTE: `paths` should be set to avoid unexpected type confliction
			// https://github.com/Microsoft/typescript/issues/6496
			Typescript({
				tsconfig: 'plugin/tsconfig.json',
			}),
		],
	};
};
