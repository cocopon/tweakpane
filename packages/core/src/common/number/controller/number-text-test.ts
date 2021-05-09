import * as assert from 'assert';
import {describe, it} from 'mocha';

import {createTestWindow} from '../../../misc/dom-test-util';
import {TestUtil} from '../../../misc/test-util';
import {createNumberFormatter, parseNumber} from '../../converter/number';
import {ValueMap} from '../../model/value-map';
import {createValue} from '../../model/values';
import {ViewProps} from '../../model/view-props';
import {NumberTextController} from './number-text';

describe(NumberTextController.name, () => {
	it('should update value with key', () => {
		const win = createTestWindow();
		const doc = win.document;
		const c = new NumberTextController(doc, {
			baseStep: 1,
			parser: parseNumber,
			props: ValueMap.fromObject({
				draggingScale: 1,
				formatter: createNumberFormatter(0),
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
			baseStep: 1,
			parser: parseNumber,
			props: ValueMap.fromObject({
				draggingScale: 1,
				formatter: createNumberFormatter(0),
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
