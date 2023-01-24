import * as assert from 'assert';
import {describe, it as context, it} from 'mocha';

import {ViewProps, ViewPropsObject} from './view-props';

describe(ViewProps.name, () => {
	(
		[
			{
				params: undefined,
				expected: {
					disabled: false,
					disposed: false,
					hidden: false,
				},
			},
			{
				params: {},
				expected: {
					disabled: false,
					disposed: false,
					hidden: false,
				},
			},
			{
				params: {disabled: true},
				expected: {
					disabled: true,
					disposed: false,
					hidden: false,
				},
			},
			{
				params: {hidden: true},
				expected: {
					disabled: false,
					disposed: false,
					hidden: true,
				},
			},
		] as {
			params: Partial<ViewPropsObject>;
			expected: {
				disabled: boolean;
				disposed: boolean;
				hidden: boolean;
			};
		}[]
	).forEach(({params, expected}) => {
		context(`when ${JSON.stringify(params)}`, () => {
			it('should set initial value', () => {
				const p = ViewProps.create(params);
				assert.strictEqual(p.get('disabled'), expected.disabled);
				assert.strictEqual(p.get('disposed'), expected.disposed);
				assert.strictEqual(p.get('hidden'), expected.hidden);
			});
		});
	});

	[
		{
			params: {
				disabled: false,
				parentDisabled: null,
			},
			expected: false,
		},
		{
			params: {
				disabled: true,
				parentDisabled: null,
			},
			expected: true,
		},
		{
			params: {
				disabled: false,
				parentDisabled: false,
			},
			expected: false,
		},
		{
			params: {
				disabled: false,
				parentDisabled: true,
			},
			expected: true,
		},
		{
			params: {
				disabled: true,
				parentDisabled: false,
			},
			expected: true,
		},
		{
			params: {
				disabled: true,
				parentDisabled: true,
			},
			expected: true,
		},
	].forEach(({params, expected}) => {
		context(`when ${JSON.stringify(params)}`, () => {
			it('should update globalDisabled', () => {
				const p = ViewProps.create({
					disabled: params.disabled,
				});
				p.set(
					'parent',
					params.parentDisabled !== null
						? ViewProps.create({
								disabled: params.parentDisabled,
						  })
						: null,
				);
				assert.strictEqual(p.get('disabled'), expected);
			});
		});
	});

	it('should apply parent globalDisabled to child', () => {
		const p = ViewProps.create({
			disabled: false,
			parent: ViewProps.create({
				disabled: false,
				parent: ViewProps.create({disabled: true}),
			}),
		});
		assert.strictEqual(p.globalDisabled.rawValue, true);
	});

	it('should apply parent updates', () => {
		const p = ViewProps.create({
			disabled: false,
			parent: ViewProps.create({
				disabled: false,
			}),
		});

		p.get('parent')?.set('disabled', true);
		assert.strictEqual(p.globalDisabled.rawValue, true);
	});
});
