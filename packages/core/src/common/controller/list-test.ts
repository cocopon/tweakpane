import * as assert from 'assert';
import {describe, it} from 'mocha';

import {createTestWindow} from '../../misc/dom-test-util';
import {TestUtil} from '../../misc/test-util';
import {ListConstraint, ListItem} from '../constraint/list';
import {ValueMap} from '../model/value-map';
import {createValue} from '../model/values';
import {ViewProps} from '../model/view-props';
import {ListController} from './list';

function createController(
	doc: Document,
	config: {
		items: ListItem<number>[];
	},
) {
	const constraint = new ListConstraint(config.items);
	const value = createValue(0, {
		constraint: constraint,
	});
	return {
		controller: new ListController(doc, {
			props: new ValueMap({
				options: constraint.values.value('options'),
			}),
			value: value,
			viewProps: ViewProps.create(),
		}),
		value: value,
	};
}

describe(ListController.name, () => {
	it('should get value', () => {
		const doc = createTestWindow().document;
		const {controller: c, value} = createController(doc, {
			items: [
				{text: 'foo', value: 12},
				{text: 'bar', value: 34},
				{text: 'baz', value: 56},
			],
		});

		assert.strictEqual(c.value, value);
	});

	it('should apply input to value', () => {
		const win = createTestWindow();
		const doc = win.document;
		const {controller: c} = createController(doc, {
			items: [
				{text: 'foo', value: 12},
				{text: 'bar', value: 34},
				{text: 'baz', value: 56},
			],
		});

		c.view.selectElement.value = '34';
		c.view.selectElement.dispatchEvent(TestUtil.createEvent(win, 'change'));

		assert.strictEqual(c.value.rawValue, 34);
	});

	it('should update properties', () => {
		const doc = createTestWindow().document;
		const {controller: c} = createController(doc, {
			items: [
				{text: 'foo', value: 12},
				{text: 'bar', value: 34},
				{text: 'baz', value: 56},
			],
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

	it('should export props', () => {
		const doc = createTestWindow().document;
		const {controller: c} = createController(doc, {
			items: [
				{text: 'foo', value: 12},
				{text: 'bar', value: 34},
				{text: 'baz', value: 56},
			],
		});

		assert.deepStrictEqual(c.exportProps(), {
			options: [
				{text: 'foo', value: 12},
				{text: 'bar', value: 34},
				{text: 'baz', value: 56},
			],
		});
	});

	it('should import props', () => {
		const doc = createTestWindow().document;
		const {controller: c} = createController(doc, {
			items: [{text: 'foo', value: 0}],
		});

		assert.deepStrictEqual(
			c.importProps({
				options: [
					{text: 'foo', value: 12},
					{text: 'bar', value: 34},
					{text: 'baz', value: 56},
				],
			}),
			true,
		);
		assert.deepStrictEqual(c.props.get('options'), [
			{text: 'foo', value: 12},
			{text: 'bar', value: 34},
			{text: 'baz', value: 56},
		]);
	});
});
