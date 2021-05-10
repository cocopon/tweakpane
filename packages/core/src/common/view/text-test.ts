import * as assert from 'assert';
import {describe} from 'mocha';

import {createTestWindow} from '../../misc/dom-test-util';
import {ValueMap} from '../model/value-map';
import {createValue} from '../model/values';
import {ViewProps} from '../model/view-props';
import {TextView} from './text';

describe(TextView.name, () => {
	it('should apply initial value', () => {
		const doc = createTestWindow().document;
		const props = ValueMap.fromObject({
			formatter: (v: string) => `hello${v}world`,
		});
		const v = createValue('foo');
		const view = new TextView(doc, {
			props: props,
			value: v,
			viewProps: ViewProps.create(),
		});

		assert.strictEqual(view.inputElement.value, 'hellofooworld');
	});

	it('should apply value change', () => {
		const doc = createTestWindow().document;
		const props = ValueMap.fromObject({
			formatter: (v: string) => `hello${v}world`,
		});
		const v = createValue('foo');
		const view = new TextView(doc, {
			props: props,
			value: v,
			viewProps: ViewProps.create(),
		});

		v.rawValue = 'bar';

		assert.strictEqual(view.inputElement.value, 'hellobarworld');
	});

	it('should apply props change', () => {
		const doc = createTestWindow().document;
		const props = ValueMap.fromObject({
			formatter: (v: string) => `hello${v}world`,
		});
		const v = createValue('foo');
		const view = new TextView(doc, {
			props: props,
			value: v,
			viewProps: ViewProps.create(),
		});

		assert.strictEqual(view.inputElement.value, 'hellofooworld');
		props.set('formatter', (v: string) => v.toUpperCase());
		assert.strictEqual(view.inputElement.value, 'FOO');
	});
});
