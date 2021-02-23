import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../../../../misc/test-util';
import {
	NumberFormatter,
	StringNumberParser,
} from '../../../common/converter/number';
import {Value} from '../../../common/model/value';
import {Point2d} from '../model/point-2d';
import {Point2dTextController} from './point-2d-text';

describe(Point2dTextController.name, () => {
	it('should update value with user operation', () => {
		const win = TestUtil.createWindow();
		const doc = win.document;
		const c = new Point2dTextController(doc, {
			axes: [
				{baseStep: 1, formatter: new NumberFormatter(0)},
				{baseStep: 1, formatter: new NumberFormatter(0)},
			],
			parser: StringNumberParser,
			value: new Value(new Point2d(12, 34)),
		});

		c.view.inputElements[0].value = '3.14';
		c.view.inputElements[0].dispatchEvent(TestUtil.createEvent(win, 'change'));
		assert.strictEqual(c.value.rawValue.x, 3.14);

		c.view.inputElements[1].dispatchEvent(
			TestUtil.createKeyboardEvent(win, 'keydown', {
				keyCode: 38,
				shiftKey: true,
			}),
		);
		assert.strictEqual(c.value.rawValue.y, 34 + 10);
	});
});
