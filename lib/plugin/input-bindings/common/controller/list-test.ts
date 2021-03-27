import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../../../../misc/test-util';
import {ListConstraint} from '../../../common/constraint/list';
import {numberToString} from '../../../common/converter/number';
import {Value} from '../../../common/model/value';
import {createViewProps} from '../../../common/model/view-props';
import {findListItems} from '../../../util';
import {ListController} from './list';

describe(ListController.name, () => {
	it('should get value', () => {
		const value = new Value(0, {
			constraint: new ListConstraint([
				{text: 'foo', value: 12},
				{text: 'bar', value: 34},
				{text: 'baz', value: 56},
			]),
		});
		const doc = TestUtil.createWindow().document;
		const c = new ListController(doc, {
			listItems: findListItems(value.constraint) ?? [],
			stringifyValue: numberToString,
			value: value,
			viewProps: createViewProps(),
		});

		assert.strictEqual(c.value, value);
	});

	it('should apply input to value', () => {
		const value = new Value(0, {
			constraint: new ListConstraint([
				{text: 'foo', value: 12},
				{text: 'bar', value: 34},
				{text: 'baz', value: 56},
			]),
		});
		const win = TestUtil.createWindow();
		const doc = win.document;
		const c = new ListController(doc, {
			listItems: findListItems(value.constraint) ?? [],
			stringifyValue: numberToString,
			value: value,
			viewProps: createViewProps(),
		});

		c.view.selectElement.value = '34';
		c.view.selectElement.dispatchEvent(TestUtil.createEvent(win, 'change'));

		assert.strictEqual(c.value.rawValue, 34);
	});
});
