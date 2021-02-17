import {assert} from 'chai';
import {describe, it} from 'mocha';

import {ListConstraint} from '../../constraint/list';
import * as NumberConverter from '../../converter/number';
import {TestUtil} from '../../misc/test-util';
import {Value} from '../../model/value';
import {ViewModel} from '../../model/view-model';
import {findListItems} from '../../plugin/util';
import {ListController} from './list';

describe(ListController.name, () => {
	it('should get value', () => {
		const value = new Value(0, {
			constraint: new ListConstraint({
				options: [
					{text: 'foo', value: 12},
					{text: 'bar', value: 34},
					{text: 'baz', value: 56},
				],
			}),
		});
		const doc = TestUtil.createWindow().document;
		const c = new ListController(doc, {
			listItems: findListItems(value.constraint) ?? [],
			stringifyValue: NumberConverter.toString,
			value: value,
			viewModel: new ViewModel(),
		});

		assert.strictEqual(c.value, value);
	});

	it('should apply input to value', () => {
		const value = new Value(0, {
			constraint: new ListConstraint({
				options: [
					{text: 'foo', value: 12},
					{text: 'bar', value: 34},
					{text: 'baz', value: 56},
				],
			}),
		});
		const win = TestUtil.createWindow();
		const doc = win.document;
		const c = new ListController(doc, {
			listItems: findListItems(value.constraint) ?? [],
			stringifyValue: NumberConverter.toString,
			value: value,
			viewModel: new ViewModel(),
		});

		c.view.selectElement.value = '34';
		c.view.selectElement.dispatchEvent(TestUtil.createEvent(win, 'change'));

		assert.strictEqual(c.value.rawValue, 34);
	});

	it('should dispose', () => {
		const value = new Value(0, {
			constraint: new ListConstraint({
				options: [
					{text: 'foo', value: 12},
					{text: 'bar', value: 34},
					{text: 'baz', value: 56},
				],
			}),
		});
		const doc = TestUtil.createWindow().document;
		const c = new ListController(doc, {
			listItems: findListItems(value.constraint) ?? [],
			viewModel: new ViewModel(),
			stringifyValue: NumberConverter.toString,
			value: value,
		});
		c.viewModel.dispose();
		assert.strictEqual(c.viewModel.disposed, true);
	});
});
