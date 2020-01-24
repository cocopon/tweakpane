module.exports = {
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
		'prettier/@typescript-eslint',
	],
	parser: '@typescript-eslint/parser',
	plugins: [
		'@typescript-eslint',
		'simple-import-sort',
	],
	root: true,
	rules: {
		camelcase: 'off',
		'no-unused-vars': 'off',
		'sort-imports': 'off',

		'prettier/prettier': 'error',
		'simple-import-sort/sort': 'error',
		'@typescript-eslint/camelcase': ['error', {
			allow: ['^opt_'],
		}],
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-unused-vars': ['error', {
			argsIgnorePattern: '^_',
		}],
	}
};
