import * as assert from 'assert';
import {describe, it} from 'mocha';

import {
	createNumberFormatter,
	parseNumber,
} from '../../../common/converter/number';
import {BoundValue} from '../../../common/model/bound-value';
import {createViewProps} from '../../../common/model/view-props';
import {TestUtil} from '../../../misc/test-util';
import {NumberTextController} from './number-text';

describe(NumberTextController.name, () => {
	it('should update value with key', () => {
		const win = TestUtil.createWindow();
		const doc = win.document;
		const c = new NumberTextController(doc, {
			baseStep: 1,
			draggingScale: 1,
			formatter: createNumberFormatter(0),
			parser: parseNumber,
			value: new BoundValue(123),
			viewProps: createViewProps(),
		});

		c.view.inputElement.dispatchEvent(
			TestUtil.createKeyboardEvent(win, 'keydown', {
				key: 'ArrowUp',
				shiftKey: true,
			}),
		);
		assert.strictEqual(c.value.rawValue, 123 + 10);
	});
});
