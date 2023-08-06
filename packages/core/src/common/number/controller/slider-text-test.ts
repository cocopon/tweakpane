import * as assert from 'assert';
import {describe, it} from 'mocha';

import {createTestWindow} from '../../../misc/dom-test-util.js';
import {
	createNumberFormatter,
	numberFromUnknown,
} from '../../converter/number.js';
import {createValue} from '../../model/values.js';
import {ViewProps} from '../../model/view-props.js';
import {createSliderTextProps, SliderTextController} from './slider-text.js';

function createController(doc: Document) {
	return new SliderTextController(doc, {
		...createSliderTextProps({
			formatter: createNumberFormatter(1),
			max: createValue(1),
			min: createValue(0),
			keyScale: createValue(1),
			pointerScale: 0.1,
		}),
		parser: numberFromUnknown,
		value: createValue(0),
		viewProps: ViewProps.create(),
	});
}

describe(SliderTextController.name, () => {
	it('should export props', () => {
		const doc = createTestWindow().document;
		const c = createController(doc);

		assert.deepStrictEqual(c.exportProps(), {
			max: 1,
			min: 0,
		});
	});

	it('should import props', () => {
		const doc = createTestWindow().document;
		const c = createController(doc);

		assert.deepStrictEqual(
			c.importProps({
				max: 100,
				min: 50,
			}),
			true,
		);
		assert.strictEqual(c.sliderController.props.get('max'), 100);
		assert.strictEqual(c.sliderController.props.get('min'), 50);
	});
});

describe(createSliderTextProps.name, () => {
	it('should share key scale', () => {
		const ks = createValue(1);
		const props = createSliderTextProps({
			formatter: createNumberFormatter(1),
			keyScale: ks,
			max: createValue(100),
			min: createValue(0),
			pointerScale: 1,
		});

		props.sliderProps.set('keyScale', 2);
		assert.strictEqual(
			props.sliderProps.value('keyScale').rawValue,
			props.textProps.value('keyScale').rawValue,
		);
	});
});
