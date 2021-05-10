import * as assert from 'assert';
import {describe, it} from 'mocha';

import {createTestWindow} from '../../misc/dom-test-util';
import {TestUtil} from '../../misc/test-util';
import {ListConstraint} from '../constraint/list';
import {ValueMap} from '../model/value-map';
import {createValue} from '../model/values';
import {ViewProps} from '../model/view-props';
import {findListItems} from '../util';
import {ListController} from './list';

describe(ListController.name, () => {
	it('should get value', () => {
		const constraint = new ListConstraint([
			{text: 'foo', value: 12},
			{text: 'bar', value: 34},
			{text: 'baz', value: 56},
		]);
		const value = createValue(0, {
			constraint: constraint,
		});
		const doc = createTestWindow().document;
		const c = new ListController(doc, {
			props: ValueMap.fromObject({
				options: findListItems(constraint) ?? [],
			}),
			value: value,
			viewProps: ViewProps.create(),
		});

		assert.strictEqual(c.value, value);
	});

	it('should apply input to value', () => {
		const constraint = new ListConstraint([
			{text: 'foo', value: 12},
			{text: 'bar', value: 34},
			{text: 'baz', value: 56},
		]);
		const value = createValue(0, {
			constraint: constraint,
		});
		const win = createTestWindow();
		const doc = win.document;
		const c = new ListController(doc, {
			props: ValueMap.fromObject({
				options: findListItems(constraint) ?? [],
			}),
			value: value,
			viewProps: ViewProps.create(),
		});

		c.view.selectElement.value = '34';
		c.view.selectElement.dispatchEvent(TestUtil.createEvent(win, 'change'));

		assert.strictEqual(c.value.rawValue, 34);
	});

	it('should update properties', () => {
		const constraint = new ListConstraint([
			{text: 'foo', value: 12},
			{text: 'bar', value: 34},
			{text: 'baz', value: 56},
		]);
		const value = createValue(0, {
			constraint: constraint,
		});
		const doc = createTestWindow().document;
		const c = new ListController(doc, {
			props: ValueMap.fromObject({
				options: findListItems(constraint) ?? [],
			}),
			value: value,
			viewProps: ViewProps.create(),
		});

		c.props.set('options', [
			{text: 'hello', value: 11},
			{text: 'world', value: 22},
		]);
		assert.strictEqual(c.view.selectElement.children[0].textContent, 'hello');
		assert.strictEqual(
			c.view.selectElement.children[0].getAttribute('value'),
			'11',
		);
		assert.strictEqual(c.view.selectElement.children[1].textContent, 'world');
		assert.strictEqual(
			c.view.selectElement.children[1].getAttribute('value'),
			'22',
		);
	});
});
