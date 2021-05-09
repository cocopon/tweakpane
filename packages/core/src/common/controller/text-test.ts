import * as assert from 'assert';
import {describe, it} from 'mocha';

import {createTestWindow} from '../../misc/dom-test-util';
import {TestUtil} from '../../misc/test-util';
import {createNumberFormatter, parseNumber} from '../converter/number';
import {ValueMap} from '../model/value-map';
import {createValue} from '../model/values';
import {ViewProps} from '../model/view-props';
import {TextController} from './text';

describe(TextController.name, () => {
	it('should get value', () => {
		const value = createValue(0);
		const doc = createTestWindow().document;
		const c = new TextController(doc, {
			parser: parseNumber,
			props: ValueMap.fromObject({
				formatter: createNumberFormatter(2),
			}),
			value: value,
			viewProps: ViewProps.create(),
		});

		assert.strictEqual(c.value, value);
	});

	it('should apply input to value', () => {
		const value = createValue(0);
		const win = createTestWindow();
		const doc = win.document;
		const c = new TextController(doc, {
			parser: parseNumber,
			props: ValueMap.fromObject({
				formatter: createNumberFormatter(2),
			}),
			value: value,
			viewProps: ViewProps.create(),
		});

		c.view.inputElement.value = '3.14';
		c.view.inputElement.dispatchEvent(TestUtil.createEvent(win, 'change'));

		assert.strictEqual(c.value.rawValue, 3.14);
	});

	it('should revert value for invalid input', () => {
		const win = createTestWindow();
		const doc = win.document;
		const c = new TextController(doc, {
			parser: parseNumber,
			props: ValueMap.fromObject({
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
