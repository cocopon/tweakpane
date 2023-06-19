import * as assert from 'assert';
import {describe, it} from 'mocha';

import {createTestWindow} from '../../misc/dom-test-util.js';
import {ValueMap} from '../model/value-map.js';
import {createValue} from '../model/values.js';
import {ViewProps} from '../model/view-props.js';
import {ListView} from './list.js';

describe(ListView.name, () => {
	it('should apply text', () => {
		const doc = createTestWindow().document;
		const opts = [
			{text: 'foo', value: {id: 'foo'}},
			{text: 'bar', value: {id: 'bar'}},
		];
		const view = new ListView(doc, {
			props: ValueMap.fromObject({
				options: opts,
			}),
			value: createValue(opts[0].value),
			viewProps: ViewProps.create(),
		});

		assert.strictEqual(
			(view.selectElement.querySelector('option') as HTMLOptionElement)
				.textContent,
			'foo',
		);
		assert.strictEqual(
			(
				view.selectElement.querySelector(
					'option:nth-child(2)',
				) as HTMLOptionElement
			).textContent,
			'bar',
		);
	});

	it('should select initial complex value', () => {
		const doc = createTestWindow().document;
		const opts = [
			{text: 'foo', value: {id: 'foo'}},
			{text: 'bar', value: {id: 'bar'}},
		];
		const view = new ListView(doc, {
			props: ValueMap.fromObject({
				options: opts,
			}),
			value: createValue(opts[1].value),
			viewProps: ViewProps.create(),
		});

		assert.strictEqual(view.selectElement.value, 'bar');
	});

	it('should update selection when options are updated', () => {
		const doc = createTestWindow().document;
		const props = ValueMap.fromObject({
			options: [
				{text: 'foo', value: 123},
				{text: 'bar', value: 456},
			],
		});
		const view = new ListView(doc, {
			props: props,
			value: createValue(123),
			viewProps: ViewProps.create(),
		});

		props.set('options', [
			{text: 'baz', value: 789},
			{text: 'qux', value: 123},
		]);
		assert.strictEqual(view.selectElement.value, 'qux');
	});

	it("should not select value when new options don't contain current value", () => {
		const doc = createTestWindow().document;
		const props = ValueMap.fromObject({
			options: [
				{text: 'foo', value: 12},
				{text: 'bar', value: 34},
			],
		});
		const view = new ListView(doc, {
			props: props,
			value: createValue(12),
			viewProps: ViewProps.create(),
		});

		props.set('options', [
			{text: 'baz', value: 56},
			{text: 'qux', value: 78},
		]);
		assert.strictEqual(view.selectElement.selectedIndex, -1);
	});
});
