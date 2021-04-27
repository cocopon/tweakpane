import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ListItem} from '../../../common/constraint/list';
import {ListController} from '../../../common/controller/list';
import {ValueMap} from '../../../common/model/value-map';
import {createValue} from '../../../common/model/values';
import {createViewProps} from '../../../common/model/view-props';
import {TestUtil} from '../../../misc/test-util';
import {
	assertDisposes,
	assertInitialState,
	assertUpdates,
} from '../../common/api/test-util';
import {createBlade} from '../../common/model/blade';
import {LabelController} from '../../label/controller/label';
import {LabelPropsObject} from '../../label/view/label';
import {ListApi} from './list';

describe(ListApi.name, () => {
	it('should dispose', () => {
		const doc = TestUtil.createWindow().document;
		const c = new LabelController(doc, {
			blade: createBlade(),
			props: ValueMap.fromObject({
				label: undefined,
			} as LabelPropsObject),
			valueController: new ListController(doc, {
				props: ValueMap.fromObject({
					options: [] as ListItem<number>[],
				}),
				value: createValue(0),
				viewProps: createViewProps(),
			}),
		});
		const api = new ListApi(c);
		assertDisposes(api);
	});

	it('should have initial state', () => {
		const doc = TestUtil.createWindow().document;
		const c = new LabelController(doc, {
			blade: createBlade(),
			props: ValueMap.fromObject({
				label: undefined,
			} as LabelPropsObject),
			valueController: new ListController(doc, {
				props: ValueMap.fromObject({
					options: [
						{text: 'foo', value: 123},
						{text: 'bar', value: 456},
					],
				}),
				value: createValue(0),
				viewProps: createViewProps(),
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
		const doc = TestUtil.createWindow().document;
		const c = new LabelController(doc, {
			blade: createBlade(),
			props: ValueMap.fromObject({
				label: undefined,
			} as LabelPropsObject),
			valueController: new ListController(doc, {
				props: ValueMap.fromObject({
					options: [
						{text: 'foo', value: 123},
						{text: 'bar', value: 456},
					],
				}),
				value: createValue(0),
				viewProps: createViewProps(),
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
		const doc = TestUtil.createWindow().document;
		const c = new LabelController(doc, {
			blade: createBlade(),
			props: ValueMap.fromObject({
				label: undefined,
			} as LabelPropsObject),
			valueController: new ListController(doc, {
				props: ValueMap.fromObject({
					options: [
						{text: 'foo', value: 123},
						{text: 'bar', value: 456},
					],
				}),
				value: createValue(0),
				viewProps: createViewProps(),
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
