import * as assert from 'assert';
import {describe, it} from 'mocha';

import {createTestWindow} from '../../../misc/dom-test-util';
import {createNumberFormatter, numberFromUnknown} from '../../converter/number';
import {ValueMap} from '../../model/value-map';
import {createValue} from '../../model/values';
import {ViewProps} from '../../model/view-props';
import {SliderTextController} from './slider-text';

function createController(doc: Document) {
	return new SliderTextController(doc, {
		baseStep: 1,
		parser: numberFromUnknown,
		sliderProps: ValueMap.fromObject({
			max: 1,
			min: 0,
		}),
		textProps: ValueMap.fromObject({
			draggingScale: 0.1,
			formatter: createNumberFormatter(1),
		}),
		value: createValue(0),
		viewProps: ViewProps.create(),
	});
}

describe(SliderTextController.name, () => {
	it('should export state', () => {
		const doc = createTestWindow().document;
		const c = createController(doc);

		assert.deepStrictEqual(c.exportProps(), {
			max: 1,
			min: 0,
		});
	});

	it('should import state', () => {
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
