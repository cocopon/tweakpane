import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	prettierConfig,
	{
		files: ['**/*.ts'],
		plugins: {
			'prettier': prettierPlugin,
			'simple-import-sort': simpleImportSort,
		},
		rules: {
			'camelcase': 'off',
			'no-console': ['warn', {allow: ['warn', 'error']}],
			'no-unused-vars': 'off',
			'sort-imports': 'off',

			'prettier/prettier': 'error',
			'simple-import-sort/imports': 'error',
			'@typescript-eslint/naming-convention': [
				'error',
				{
					selector: 'variable',
					format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
					custom: {
						regex: '^opt_',
						match: false,
					},
				},
			],
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/no-empty-function': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
				},
			],

			// TODO: Resolve latest lint warnings
			'@typescript-eslint/explicit-module-boundary-types': 'off',
		},
	},
);
