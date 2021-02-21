import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../../../../misc/test-util';
import {Value} from '../../../common/model/value';
import {ViewModel} from '../../../common/model/view-model';
import {StringNumberParser} from '../../../common/reader/string-number';
import {NumberFormatter} from '../../../common/writer/number';
import {NumberTextController} from './number-text';

describe(NumberTextController.name, () => {
	it('should update value with key', () => {
		const win = TestUtil.createWindow();
		const doc = win.document;
		const c = new NumberTextController(doc, {
			baseStep: 1,
			formatter: new NumberFormatter(0),
			parser: StringNumberParser,
			value: new Value(123),
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
