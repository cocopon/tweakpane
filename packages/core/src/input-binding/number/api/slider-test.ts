import * as assert from 'assert';
import {describe, it} from 'mocha';

import {InputBindingController} from '../../../blade/binding/controller/input-binding';
import {createBlade} from '../../../blade/common/model/blade';
import {LabelPropsObject} from '../../../blade/label/view/label';
import {ReadWriteBinding} from '../../../common/binding/read-write';
import {BindingTarget} from '../../../common/binding/target';
import {InputBindingValue} from '../../../common/binding/value/input-binding';
import {
	createNumberFormatter,
	numberFromUnknown,
	parseNumber,
} from '../../../common/converter/number';
import {ValueMap} from '../../../common/model/value-map';
import {createValue} from '../../../common/model/values';
import {ViewProps} from '../../../common/model/view-props';
import {
	createSliderTextProps,
	SliderTextController,
} from '../../../common/number/controller/slider-text';
import {writePrimitive} from '../../../common/primitive';
import {createTestWindow} from '../../../misc/dom-test-util';
import {SliderInputBindingApi} from './slider';

function createApi(config: {min: number; max: number}): SliderInputBindingApi {
	const doc = createTestWindow().document;
	const v = new InputBindingValue(
		createValue(0),
		new ReadWriteBinding({
			reader: numberFromUnknown,
			target: new BindingTarget({foo: 0}, 'foo'),
			writer: writePrimitive,
		}),
	);
	const c = new InputBindingController<number, SliderTextController>(doc, {
		blade: createBlade(),
		props: ValueMap.fromObject<LabelPropsObject>({
			label: '',
		}),
		value: v,
		valueController: new SliderTextController(doc, {
			...createSliderTextProps({
				formatter: createNumberFormatter(1),
				keyScale: createValue(1),
				max: createValue(config.max),
				min: createValue(config.min),
				pointerScale: 1,
			}),
			parser: parseNumber,
			value: v,
			viewProps: ViewProps.create(),
		}),
	});
	return new SliderInputBindingApi(c);
}

describe(SliderInputBindingApi.name, () => {
	it('should get min/max', () => {
		const api = createApi({min: -100, max: 100});
		assert.strictEqual(api.min, -100);
		assert.strictEqual(api.max, 100);
	});

	it('should set min/max', () => {
		const api = createApi({min: -100, max: 100});
		api.min = -123;
		api.max = 456;
		assert.strictEqual(api.min, -123);
		assert.strictEqual(api.max, 456);
	});
});
