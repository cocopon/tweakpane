import {assert} from 'chai';
import {describe, it} from 'mocha';

import {NumberFormatter} from '../../formatter/number';
import {TestUtil} from '../../misc/test-util';
import {InputValue} from '../../model/input-value';
import {ViewModel} from '../../model/view-model';
import {StringNumberParser} from '../../parser/string-number';
import {NumberTextInputController} from './number-text';

describe(NumberTextInputController.name, () => {
	it('should update value with key', () => {
		const win = TestUtil.createWindow();
		const doc = win.document;
		const c = new NumberTextInputController(doc, {
			baseStep: 1,
			formatter: new NumberFormatter(0),
			parser: StringNumberParser,
			value: new InputValue(123),
			viewModel: new ViewModel(),
		});

		c.view.inputElement.dispatchEvent(
			TestUtil.createKeyboardEvent(win, 'keydown', {
				keyCode: 38,
				shiftKey: true,
			}),
		);
		assert.strictEqual(c.value.rawValue, 123 + 10);
	});
});
