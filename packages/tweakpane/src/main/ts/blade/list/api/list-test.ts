import {
	createBlade,
	createValue,
	LabeledValueBladeController,
	LabelPropsObject,
	ListController,
	ListItem,
	ListProps,
	ValueMap,
	ViewProps,
} from '@tweakpane/core';
import * as assert from 'assert';
import {describe, it} from 'mocha';

import {
	assertDisposes,
	assertInitialState,
	assertUpdates,
	createTestWindow,
} from '../../../misc/test-util.js';
import {ListBladeApi} from './list.js';

function createApi(
	doc: Document,
	initialValue: number,
	props: ListProps<number>,
): ListBladeApi<number> {
	const v = createValue(initialValue);
	const c = new LabeledValueBladeController<number, ListController<number>>(
		doc,
		{
			blade: createBlade(),
			props: ValueMap.fromObject<LabelPropsObject>({
				label: undefined,
			}),
			value: v,
			valueController: new ListController(doc, {
				props: props,
				value: v,
				viewProps: ViewProps.create(),
			}),
		},
	);
	return new ListBladeApi(c);
}

describe(ListBladeApi.name, () => {
	it('should dispose', () => {
		const doc = createTestWindow().document;
		const api = createApi(
			doc,
			0,
			ValueMap.fromObject<{options: ListItem<number>[]}>({options: []}),
		);
		assertDisposes(api);
	});

	it('should have initial state', () => {
		const doc = createTestWindow().document;
		const api = createApi(
			doc,
			0,
			ValueMap.fromObject({
				options: [
					{text: 'foo', value: 123},
					{text: 'bar', value: 456},
				],
			}),
		);

		assertInitialState(api);
		assert.strictEqual(api.label, undefined);
		assert.strictEqual(api.value, 0);
		assert.deepStrictEqual(api.options[0], {text: 'foo', value: 123});
		assert.deepStrictEqual(api.options[1], {text: 'bar', value: 456});
	});

	it('should update properties', () => {
		const doc = createTestWindow().document;
		const api = createApi(
			doc,
			0,
			ValueMap.fromObject({
				options: [
					{text: 'foo', value: 123},
					{text: 'bar', value: 456},
				],
			}),
		);

		assertUpdates(api);

		api.value = 789;
		assert.strictEqual(api.value, 789);

		api.label = 'buzqux';
		assert.strictEqual(api.label, 'buzqux');

		api.options = [
			{text: 'baz', value: 234},
			{text: 'qux', value: 345},
		];
		assert.deepStrictEqual(api.options[0], {text: 'baz', value: 234});
		assert.deepStrictEqual(api.options[1], {text: 'qux', value: 345});
	});

	it('should handle event', (done) => {
		const doc = createTestWindow().document;
		const api = createApi(
			doc,
			0,
			ValueMap.fromObject({
				options: [
					{text: 'foo', value: 123},
					{text: 'bar', value: 456},
				],
			}),
		);

		api.on('change', (ev) => {
			assert.strictEqual(ev.target, api);
			assert.strictEqual(ev.value, 123);
			done();
		});
		api.value = 123;
	});

	it('should unlisten event', () => {
		const doc = createTestWindow().document;
		const api = createApi(
			doc,
			0,
			ValueMap.fromObject({
				options: [
					{text: 'foo', value: 123},
					{text: 'bar', value: 456},
				],
			}),
		);

		const handler = () => {
			assert.fail('should not be called');
		};
		api.on('change', handler);
		api.off('change', handler);
		api.value = 123;
	});
});
