import {
	createBlade,
	createValue,
	LabelController,
	LabelPropsObject,
	ListController,
	ListItem,
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
} from '../../../misc/test-util';
import {ListApi} from './list';

describe(ListApi.name, () => {
	it('should dispose', () => {
		const doc = createTestWindow().document;
		const c = new LabelController(doc, {
			blade: createBlade(),
			props: ValueMap.fromObject<LabelPropsObject>({
				label: undefined,
			}),
			valueController: new ListController(doc, {
				props: ValueMap.fromObject<{
					options: ListItem<number>[];
				}>({
					options: [],
				}),
				value: createValue(0),
				viewProps: ViewProps.create(),
			}),
		});
		const api = new ListApi(c);
		assertDisposes(api);
	});

	it('should have initial state', () => {
		const doc = createTestWindow().document;
		const c = new LabelController(doc, {
			blade: createBlade(),
			props: ValueMap.fromObject<LabelPropsObject>({
				label: undefined,
			}),
			valueController: new ListController(doc, {
				props: ValueMap.fromObject({
					options: [
						{text: 'foo', value: 123},
						{text: 'bar', value: 456},
					],
				}),
				value: createValue(0),
				viewProps: ViewProps.create(),
			}),
		});
		const api = new ListApi(c);

		assertInitialState(api);
		assert.strictEqual(api.label, undefined);
		assert.strictEqual(api.value, 0);
		assert.deepStrictEqual(api.options[0], {text: 'foo', value: 123});
		assert.deepStrictEqual(api.options[1], {text: 'bar', value: 456});
	});

	it('should update properties', () => {
		const doc = createTestWindow().document;
		const c = new LabelController(doc, {
			blade: createBlade(),
			props: ValueMap.fromObject<LabelPropsObject>({
				label: undefined,
			}),
			valueController: new ListController(doc, {
				props: ValueMap.fromObject({
					options: [
						{text: 'foo', value: 123},
						{text: 'bar', value: 456},
					],
				}),
				value: createValue(0),
				viewProps: ViewProps.create(),
			}),
		});
		const api = new ListApi(c);

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
		const c = new LabelController(doc, {
			blade: createBlade(),
			props: ValueMap.fromObject<LabelPropsObject>({
				label: undefined,
			}),
			valueController: new ListController(doc, {
				props: ValueMap.fromObject({
					options: [
						{text: 'foo', value: 123},
						{text: 'bar', value: 456},
					],
				}),
				value: createValue(0),
				viewProps: ViewProps.create(),
			}),
		});
		const api = new ListApi(c);

		api.on('change', (ev) => {
			assert.strictEqual(ev.presetKey, undefined);
			assert.strictEqual(ev.target, api);
			assert.strictEqual(ev.value, 123);
			done();
		});
		api.value = 123;
	});
});
