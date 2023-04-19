import * as assert from 'assert';
import {describe, it} from 'mocha';

import {createTestWindow} from '../../../misc/dom-test-util.js';
import {TestUtil} from '../../../misc/test-util.js';
import {createNumberFormatter, parseNumber} from '../../converter/number.js';
import {ValueMap} from '../../model/value-map.js';
import {createValue} from '../../model/values.js';
import {ViewProps} from '../../model/view-props.js';
import {NumberTextController} from './number-text.js';

describe(NumberTextController.name, () => {
	it('should update value with key', () => {
		const win = createTestWindow();
		const doc = win.document;
		const c = new NumberTextController(doc, {
			parser: parseNumber,
			props: ValueMap.fromObject({
				formatter: createNumberFormatter(0),
				keyScale: 1,
				pointerScale: 1,
			}),
			value: createValue(123),
			viewProps: ViewProps.create(),
		});

		c.view.inputElement.dispatchEvent(
			TestUtil.createKeyboardEvent(win, 'keydown', {
				key: 'ArrowUp',
				shiftKey: true,
			}),
		);
		assert.strictEqual(c.value.rawValue, 123 + 10);
	});

	it('should revert value for invalid input', () => {
		const win = createTestWindow();
		const doc = win.document;
		const c = new NumberTextController(doc, {
			parser: parseNumber,
			props: ValueMap.fromObject({
				formatter: createNumberFormatter(0),
				keyScale: 1,
				pointerScale: 1,
			}),
			value: createValue(123),
			viewProps: ViewProps.create(),
		});

		const inputElem = c.view.inputElement;
		inputElem.value = 'foobar';
		inputElem.dispatchEvent(TestUtil.createEvent(win, 'change'));
		assert.strictEqual(inputElem.value, '123');
	});
});
