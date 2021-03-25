import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../../../../misc/test-util';
import {
	createNumberFormatter,
	parseNumber,
} from '../../../common/converter/number';
import {Value} from '../../../common/model/value';
import {ValueMap} from '../../../common/model/value-map';
import {defaultViewProps} from '../../../common/view/view';
import {TextController} from './text';

describe(TextController.name, () => {
	it('should get value', () => {
		const value = new Value(0);
		const doc = TestUtil.createWindow().document;
		const c = new TextController(doc, {
			parser: parseNumber,
			props: new ValueMap({
				formatter: createNumberFormatter(2),
			}),
			value: value,
			viewProps: defaultViewProps(),
		});

		assert.strictEqual(c.value, value);
	});

	it('should apply input to value', () => {
		const value = new Value(0);
		const win = TestUtil.createWindow();
		const doc = win.document;
		const c = new TextController(doc, {
			parser: parseNumber,
			props: new ValueMap({
				formatter: createNumberFormatter(2),
			}),
			value: value,
			viewProps: defaultViewProps(),
		});

		c.view.inputElement.value = '3.14';
		c.view.inputElement.dispatchEvent(TestUtil.createEvent(win, 'change'));

		assert.strictEqual(c.value.rawValue, 3.14);
	});
});
