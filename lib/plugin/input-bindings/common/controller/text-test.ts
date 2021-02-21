import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../../../../misc/test-util';
import {Value} from '../../../common/model/value';
import {ViewModel} from '../../../common/model/view-model';
import {StringNumberParser} from '../../../common/reader/string-number';
import {NumberFormatter} from '../../../common/writer/number';
import {TextController} from './text';

describe(TextController.name, () => {
	it('should get value', () => {
		const value = new Value(0);
		const doc = TestUtil.createWindow().document;
		const c = new TextController(doc, {
			viewModel: new ViewModel(),
			formatter: new NumberFormatter(2),
			parser: StringNumberParser,
			value: value,
		});

		assert.strictEqual(c.value, value);
	});

	it('should apply input to value', () => {
		const value = new Value(0);
		const win = TestUtil.createWindow();
		const doc = win.document;
		const c = new TextController(doc, {
			viewModel: new ViewModel(),
			formatter: new NumberFormatter(2),
			parser: StringNumberParser,
			value: value,
		});

		c.view.inputElement.value = '3.14';
		c.view.inputElement.dispatchEvent(TestUtil.createEvent(win, 'change'));

		assert.strictEqual(c.value.rawValue, 3.14);
	});

	it('should dispose', () => {
		const value = new Value(0);
		const doc = TestUtil.createWindow().document;
		const c = new TextController(doc, {
			viewModel: new ViewModel(),
			formatter: new NumberFormatter(2),
			parser: StringNumberParser,
			value: value,
		});
		c.viewModel.dispose();
		assert.strictEqual(c.viewModel.disposed, true);
	});
});
