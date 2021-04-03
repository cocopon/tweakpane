import * as assert from 'assert';
import {describe, it} from 'mocha';

import {TestUtil} from '../../misc/test-util';
import {createNumberFormatter, parseNumber} from '../converter/number';
import {BoundValue} from '../model/bound-value';
import {ValueMap} from '../model/value-map';
import {createViewProps} from '../model/view-props';
import {TextController} from './text';

describe(TextController.name, () => {
	it('should get value', () => {
		const value = new BoundValue(0);
		const doc = TestUtil.createWindow().document;
		const c = new TextController(doc, {
			parser: parseNumber,
			props: new ValueMap({
				formatter: createNumberFormatter(2),
			}),
			value: value,
			viewProps: createViewProps(),
		});

		assert.strictEqual(c.value, value);
	});

	it('should apply input to value', () => {
		const value = new BoundValue(0);
		const win = TestUtil.createWindow();
		const doc = win.document;
		const c = new TextController(doc, {
			parser: parseNumber,
			props: new ValueMap({
				formatter: createNumberFormatter(2),
			}),
			value: value,
			viewProps: createViewProps(),
		});

		c.view.inputElement.value = '3.14';
		c.view.inputElement.dispatchEvent(TestUtil.createEvent(win, 'change'));

		assert.strictEqual(c.value.rawValue, 3.14);
	});
});
