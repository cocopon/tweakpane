import * as assert from 'assert';
import {describe} from 'mocha';

import {TestUtil} from '../../misc/test-util';
import {BoundValue} from '../model/bound-value';
import {ValueMap} from '../model/value-map';
import {createViewProps} from '../model/view-props';
import {TextView} from './text';

describe(TextView.name, () => {
	it('should apply initial value', () => {
		const doc = TestUtil.createWindow().document;
		const props = new ValueMap({
			formatter: (v: string) => `hello${v}world`,
		});
		const v = new BoundValue('foo');
		const view = new TextView(doc, {
			props: props,
			value: v,
			viewProps: createViewProps(),
		});

		assert.strictEqual(view.inputElement.value, 'hellofooworld');
	});

	it('should apply value change', () => {
		const doc = TestUtil.createWindow().document;
		const props = new ValueMap({
			formatter: (v: string) => `hello${v}world`,
		});
		const v = new BoundValue('foo');
		const view = new TextView(doc, {
			props: props,
			value: v,
			viewProps: createViewProps(),
		});

		v.rawValue = 'bar';

		assert.strictEqual(view.inputElement.value, 'hellobarworld');
	});

	it('should apply props change', () => {
		const doc = TestUtil.createWindow().document;
		const props = new ValueMap({
			formatter: (v: string) => `hello${v}world`,
		});
		const v = new BoundValue('foo');
		const view = new TextView(doc, {
			props: props,
			value: v,
			viewProps: createViewProps(),
		});

		assert.strictEqual(view.inputElement.value, 'hellofooworld');
		props.set('formatter', (v: string) => v.toUpperCase());
		assert.strictEqual(view.inputElement.value, 'FOO');
	});
});
