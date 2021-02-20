import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../../../../misc/test-util';
import {NumberFormatter} from '../../../common/formatter/number';
import {Point2d} from '../../../common/model/point-2d';
import {Value} from '../../../common/model/value';
import {ViewModel} from '../../../common/model/view-model';
import {StringNumberParser} from '../../../common/parser/string-number';
import {Point2dTextController} from './point-2d-text';

describe(Point2dTextController.name, () => {
	it('should dispose', () => {
		const win = TestUtil.createWindow();
		const doc = win.document;
		const c = new Point2dTextController(doc, {
			parser: StringNumberParser,
			value: new Value(new Point2d()),
			viewModel: new ViewModel(),
			xBaseStep: 1,
			xFormatter: new NumberFormatter(0),
			yBaseStep: 1,
			yFormatter: new NumberFormatter(0),
		});
		c.viewModel.dispose();
		assert.strictEqual(c.viewModel.disposed, true);
	});

	it('should update value with user operation', () => {
		const win = TestUtil.createWindow();
		const doc = win.document;
		const c = new Point2dTextController(doc, {
			parser: StringNumberParser,
			value: new Value(new Point2d(12, 34)),
			viewModel: new ViewModel(),
			xBaseStep: 1,
			xFormatter: new NumberFormatter(0),
			yBaseStep: 1,
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
