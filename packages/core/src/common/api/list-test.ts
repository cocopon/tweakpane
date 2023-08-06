import * as assert from 'assert';
import {describe, it} from 'mocha';

import {InputBindingController} from '../../blade/binding/controller/input-binding.js';
import {createBlade} from '../../blade/common/model/blade.js';
import {createTestWindow} from '../../misc/dom-test-util.js';
import {ReadWriteBinding} from '../binding/read-write.js';
import {BindingTarget} from '../binding/target.js';
import {InputBindingValue} from '../binding/value/input-binding.js';
import {ListItem} from '../constraint/list.js';
import {ListController} from '../controller/list.js';
import {numberFromUnknown} from '../converter/number.js';
import {LabelPropsObject} from '../label/view/label.js';
import {ValueMap} from '../model/value-map.js';
import {createValue} from '../model/values.js';
import {ViewProps} from '../model/view-props.js';
import {writePrimitive} from '../primitive.js';
import {ListInputBindingApi} from './list.js';

function createApi(config: {
	options: ListItem<number>[];
}): ListInputBindingApi<number> {
	const doc = createTestWindow().document;
	const v = new InputBindingValue(
		createValue(0),
		new ReadWriteBinding({
			reader: numberFromUnknown,
			target: new BindingTarget({foo: 0}, 'foo'),
			writer: writePrimitive,
		}),
	);
	const c = new InputBindingController<number, ListController<number>>(doc, {
		blade: createBlade(),
		props: ValueMap.fromObject<LabelPropsObject>({
			label: '',
		}),
		value: v,
		valueController: new ListController(doc, {
			props: ValueMap.fromObject({
				options: config.options,
			}),
			value: v,
			viewProps: ViewProps.create(),
		}),
	});
	return new ListInputBindingApi(c);
}

describe(ListInputBindingApi.name, () => {
	it('should get options', () => {
		const opts = [
			{text: 'foo', value: 0},
			{text: 'bar', value: 1},
		];
		const api = createApi({
			options: opts,
		});
		assert.deepStrictEqual(api.options, opts);
	});

	it('should set options', () => {
		const api = createApi({
			options: [
				{text: 'foo', value: 0},
				{text: 'bar', value: 1},
			],
		});
		const opts = [
			{text: 'baz', value: 0},
			{text: 'qux', value: 2},
		];
		api.options = opts;
		assert.deepStrictEqual(api.options, opts);
		assert.strictEqual(
			api.controller.valueController.view.selectElement.children[0].textContent,
			'baz',
		);
	});
});
