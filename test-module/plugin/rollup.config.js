import Replace from '@rollup/plugin-replace';
import Typescript from '@rollup/plugin-typescript';
import Sass from 'sass';

export default () => {
	const css = Sass.renderSync({
		file: 'plugin/src/plugin.scss',
		outputStyle: 'compressed',
	})
		.css.toString()
		.replace(/'/g, "\\'")
		.trim();

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
			Replace({
				__css__: css,
			}),
		],
	};
};
