import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ReadWriteBinding} from '../../../common/binding/read-write.js';
import {BindingTarget} from '../../../common/binding/target.js';
import {InputBindingValue} from '../../../common/binding/value/input-binding.js';
import {
	createNumberFormatter,
	numberFromUnknown,
	parseNumber,
} from '../../../common/converter/number.js';
import {LabelPropsObject} from '../../../common/label/view/label.js';
import {ValueMap} from '../../../common/model/value-map.js';
import {createValue} from '../../../common/model/values.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {NumberTextController} from '../../../common/number/controller/number-text.js';
import {writePrimitive} from '../../../common/primitive.js';
import {createTestWindow} from '../../../misc/dom-test-util.js';
import {createBlade} from '../../common/model/blade.js';
import {InputBindingController} from '../controller/input-binding.js';
import {BindingApi} from './binding.js';
import {InputBindingApi} from './input-binding.js';

function createApi(target: BindingTarget): InputBindingApi<number, unknown> {
	const doc = createTestWindow().document;
	const binding = new ReadWriteBinding({
		reader: numberFromUnknown,
		target: target,
		writer: writePrimitive,
	});
	const v = new InputBindingValue(createValue(0), binding);
	const ic = new NumberTextController(doc, {
		parser: parseNumber,
		props: ValueMap.fromObject({
			formatter: createNumberFormatter(0),
			keyScale: 1,
			pointerScale: 1,
		}),
		value: v,
		viewProps: ViewProps.create(),
	});
	const bc = new InputBindingController<number>(doc, {
		blade: createBlade(),
		props: ValueMap.fromObject<LabelPropsObject>({
			label: 'label',
		}),
		value: v,
		valueController: ic,
	});
	return new BindingApi(bc);
}

describe(BindingApi.name, () => {
	it('should remove event listener', () => {
		const api = createApi(new BindingTarget({foo: 0}, 'foo'));
		const handler = () => {
			assert.fail('should not be called');
		};
		api.on('change', handler);
		api.off('change', handler);

		api.controller.value.rawValue += 1;
	});
});
