import {assert} from 'chai';
import {describe, it} from 'mocha';

import {NumberFormatter} from '../../formatter/number';
import {TestUtil} from '../../misc/test-util';
import {InputValue} from '../../model/input-value';
import {Point2d} from '../../model/point-2d';
import {StringNumberParser} from '../../parser/string-number';
import {Point2dTextInputController} from './point-2d-text';

describe(Point2dTextInputController.name, () => {
	it('should dispose', () => {
		const win = TestUtil.createWindow();
		const doc = win.document;
		const c = new Point2dTextInputController(doc, {
			parser: StringNumberParser,
			value: new InputValue(new Point2d()),
			xFormatter: new NumberFormatter(0),
			yFormatter: new NumberFormatter(0),
		});
		c.dispose();
		assert.strictEqual(c.view.disposed, true);
	});

	it('should update value with user operation', () => {
		const win = TestUtil.createWindow();
		const doc = win.document;
		const c = new Point2dTextInputController(doc, {
			parser: StringNumberParser,
			value: new InputValue(new Point2d(12, 34)),
			xFormatter: new NumberFormatter(0),
			yFormatter: new NumberFormatter(0),
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
