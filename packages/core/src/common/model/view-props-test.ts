import * as assert from 'assert';
import {describe, it} from 'mocha';

import {createTestWindow} from '../../misc/dom-test-util.js';
import {ViewProps, ViewPropsObject} from './view-props.js';

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
		describe(`when ${JSON.stringify(params)}`, () => {
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
		describe(`when ${JSON.stringify(params)}`, () => {
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
				assert.strictEqual(p.globalDisabled.rawValue, expected);
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

	[
		{
			params: {},
			expected: {
				disabled: false,
				tabIndex: 0,
				classModifiers: [],
			},
		},
		{
			params: {
				disabled: true,
				hidden: true,
			},
			expected: {
				disabled: true,
				tabIndex: -1,
				classModifiers: ['tp-v-disabled', 'tp-v-hidden'],
			},
		},
	].forEach(({params, expected}) => {
		describe(`when ${JSON.stringify(params)}`, () => {
			it('should apply initial state to bound targets', () => {
				const p = ViewProps.create(params);
				const doc = createTestWindow().document;

				const divElem = doc.createElement('div');
				p.bindTabIndex(divElem);
				assert.strictEqual(divElem.tabIndex, expected.tabIndex, 'tabIndex');

				p.bindClassModifiers(divElem);
				expected.classModifiers.forEach((m) => {
					assert.ok(divElem.classList.contains(m), `class modifier: '${m}'`);
				});

				const buttonElem = doc.createElement('button');
				p.bindDisabled(buttonElem);

				assert.strictEqual(buttonElem.disabled, expected.disabled, 'disabled');
			});
		});
	});

	it('should bind disabled', () => {
		const p = ViewProps.create({});
		const doc = createTestWindow().document;
		const elem = doc.createElement('button');
		p.bindDisabled(elem);

		assert.strictEqual(elem.disabled, false);
		p.set('disabled', true);
		assert.strictEqual(elem.disabled, true);
	});

	it('should bind tab index', () => {
		const p = ViewProps.create({});
		const doc = createTestWindow().document;
		const elem = doc.createElement('div');
		p.bindTabIndex(elem);

		assert.strictEqual(elem.tabIndex, 0);
		p.set('disabled', true);
		assert.strictEqual(elem.tabIndex, -1);
	});

	it('should bind class modifiers', () => {
		const p = ViewProps.create({});
		const doc = createTestWindow().document;
		const elem = doc.createElement('div');
		p.bindClassModifiers(elem);

		assert.ok(!elem.classList.contains('tp-v-disabled'));
		p.set('disabled', true);
		assert.ok(elem.classList.contains('tp-v-disabled'));

		assert.ok(!elem.classList.contains('tp-v-hidden'));
		p.set('hidden', true);
		assert.ok(elem.classList.contains('tp-v-hidden'));
	});

	it('should export state', () => {
		const p = ViewProps.create({
			disabled: true,
			hidden: true,
		});
		assert.deepStrictEqual(p.exportState(), {
			disabled: true,
			hidden: true,
		});
	});

	it('should import state', () => {
		const p = ViewProps.create();
		p.importState({
			disabled: true,
			hidden: true,
		});
		assert.deepStrictEqual(p.get('disabled'), true);
		assert.deepStrictEqual(p.get('hidden'), true);
	});
});
