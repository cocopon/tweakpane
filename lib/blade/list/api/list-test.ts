import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ListItem} from '../../../common/constraint/list';
import {PrimitiveValue} from '../../../common/model/primitive-value';
import {ValueMap} from '../../../common/model/value-map';
import {createViewProps} from '../../../common/model/view-props';
import {ListController} from '../../../input-binding/common/controller/list';
import {TestUtil} from '../../../misc/test-util';
import {Blade} from '../../common/model/blade';
import {LabeledController} from '../../labeled/controller';
import {LabeledPropsObject} from '../../labeled/view';
import {ListBladeApi} from './list';

describe(ListBladeApi.name, () => {
	it('should dispose', () => {
		const doc = TestUtil.createWindow().document;
		const c = new LabeledController(doc, {
			blade: new Blade(),
			props: new ValueMap({
				label: undefined,
			} as LabeledPropsObject),
			valueController: new ListController(doc, {
				props: new ValueMap({
					options: [] as ListItem<number>[],
				}),
				value: new PrimitiveValue(0),
				viewProps: createViewProps(),
			}),
		});
		const api = new ListBladeApi(c);
		api.dispose();
		assert.strictEqual(api.controller_.blade.disposed, true);
	});

	it('should have initial state', () => {
		const doc = TestUtil.createWindow().document;
		const c = new LabeledController(doc, {
			blade: new Blade(),
			props: new ValueMap({
				label: undefined,
			} as LabeledPropsObject),
			valueController: new ListController(doc, {
				props: new ValueMap({
					options: [
						{text: 'foo', value: 123},
						{text: 'bar', value: 456},
					],
				}),
				value: new PrimitiveValue(0),
				viewProps: createViewProps(),
			}),
		});
		const api = new ListBladeApi(c);
		assert.strictEqual(api.disabled, false);
		assert.strictEqual(api.hidden, false);
		assert.strictEqual(api.label, undefined);
		assert.strictEqual(api.value, 0);
		assert.deepStrictEqual(api.options[0], {text: 'foo', value: 123});
		assert.deepStrictEqual(api.options[1], {text: 'bar', value: 456});
	});

	it('should update properties', () => {
		const doc = TestUtil.createWindow().document;
		const c = new LabeledController(doc, {
			blade: new Blade(),
			props: new ValueMap({
				label: undefined,
			} as LabeledPropsObject),
			valueController: new ListController(doc, {
				props: new ValueMap({
					options: [
						{text: 'foo', value: 123},
						{text: 'bar', value: 456},
					],
				}),
				value: new PrimitiveValue(0),
				viewProps: createViewProps(),
			}),
		});
		const api = new ListBladeApi(c);

		api.disabled = true;
		assert.strictEqual(api.disabled, true);

		api.hidden = true;
		assert.strictEqual(api.hidden, true);

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
		const doc = TestUtil.createWindow().document;
		const c = new LabeledController(doc, {
			blade: new Blade(),
			props: new ValueMap({
				label: undefined,
			} as LabeledPropsObject),
			valueController: new ListController(doc, {
				props: new ValueMap({
					options: [
						{text: 'foo', value: 123},
						{text: 'bar', value: 456},
					],
				}),
				value: new PrimitiveValue(0),
				viewProps: createViewProps(),
			}),
		});
		const api = new ListBladeApi(c);

		api.on('change', (ev) => {
			assert.strictEqual(ev.presetKey, undefined);
			assert.strictEqual(ev.target, api);
			assert.strictEqual(ev.value, 123);
			done();
		});
		api.value = 123;
	});
});
