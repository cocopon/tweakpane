import * as assert from 'assert';
import {describe, it} from 'mocha';

import {InputBindingController} from '../../blade/binding/controller/input-binding';
import {createBlade} from '../../blade/common/model/blade';
import {LabeledValueController} from '../../blade/label/controller/value-label';
import {LabelPropsObject} from '../../blade/label/view/label';
import {createTestWindow} from '../../misc/dom-test-util';
import {ReadWriteBinding} from '../binding/read-write';
import {BindingTarget} from '../binding/target';
import {InputBindingValue} from '../binding/value/input-binding';
import {ListItem} from '../constraint/list';
import {ListController} from '../controller/list';
import {numberFromUnknown} from '../converter/number';
import {ValueMap} from '../model/value-map';
import {createValue} from '../model/values';
import {ViewProps} from '../model/view-props';
import {writePrimitive} from '../primitive';
import {ListInputBindingApi} from './list';

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
	const c: InputBindingController<
		number,
		ListController<number>
	> = new LabeledValueController(doc, {
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
			api['controller_'].valueController.view.selectElement.children[0]
				.textContent,
			'baz',
		);
	});
});
