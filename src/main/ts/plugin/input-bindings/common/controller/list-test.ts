import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../../../../misc/test-util';
import {ListConstraint} from '../../../common/constraint/list';
import {numberToString} from '../../../common/formatter/number';
import {Value} from '../../../common/model/value';
import {ViewModel} from '../../../common/model/view-model';
import {findListItems} from '../../../util';
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
			stringifyValue: numberToString,
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
			stringifyValue: numberToString,
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
			stringifyValue: numberToString,
			value: value,
		});
		c.viewModel.dispose();
		assert.strictEqual(c.viewModel.disposed, true);
	});
});
