import {assert} from 'chai';
import {describe, it} from 'mocha';

import {NumberFormatter} from '../../formatter/number';
import {TestUtil} from '../../misc/test-util';
import {Disposable} from '../../model/disposable';
import {InputValue} from '../../model/input-value';
import {StringNumberParser} from '../../parser/string-number';
import {TextInputController} from './text';

describe(TextInputController.name, () => {
	it('should get value', () => {
		const value = new InputValue(0);
		const doc = TestUtil.createWindow().document;
		const c = new TextInputController(doc, {
			disposable: new Disposable(),
			formatter: new NumberFormatter(2),
			parser: StringNumberParser,
			value: value,
		});

		assert.strictEqual(c.value, value);
	});

	it('should apply input to value', () => {
		const value = new InputValue(0);
		const win = TestUtil.createWindow();
		const doc = win.document;
		const c = new TextInputController(doc, {
			disposable: new Disposable(),
			formatter: new NumberFormatter(2),
			parser: StringNumberParser,
			value: value,
		});

		c.view.inputElement.value = '3.14';
		c.view.inputElement.dispatchEvent(TestUtil.createEvent(win, 'change'));

		assert.strictEqual(c.value.rawValue, 3.14);
	});

	it('should dispose', () => {
		const value = new InputValue(0);
		const doc = TestUtil.createWindow().document;
		const c = new TextInputController(doc, {
			disposable: new Disposable(),
			formatter: new NumberFormatter(2),
			parser: StringNumberParser,
			value: value,
		});
		c.disposable.dispose();
		assert.strictEqual(c.disposable.disposed, true);
	});
});
