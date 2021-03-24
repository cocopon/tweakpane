import {assert} from 'chai';
import {describe} from 'mocha';

import {TestUtil} from '../../../../misc/test-util';
import {Value} from '../../../common/model/value';
import {ValueMap} from '../../../common/model/value-map';
import {TextView} from './text';

describe(TextView.name, () => {
	it('should apply initial value', () => {
		const doc = TestUtil.createWindow().document;
		const props = new ValueMap({
			formatter: (v: string) => `hello${v}world`,
		});
		const v = new Value('foo');
		const view = new TextView(doc, {
			props: props,
			value: v,
		});

		assert.strictEqual(view.inputElement.value, 'hellofooworld');
	});

	it('should apply value change', () => {
		const doc = TestUtil.createWindow().document;
		const props = new ValueMap({
			formatter: (v: string) => `hello${v}world`,
		});
		const v = new Value('foo');
		const view = new TextView(doc, {
			props: props,
			value: v,
		});

		v.rawValue = 'bar';

		assert.strictEqual(view.inputElement.value, 'hellobarworld');
	});

	it('should apply props change', () => {
		const doc = TestUtil.createWindow().document;
		const props = new ValueMap({
			formatter: (v: string) => `hello${v}world`,
		});
		const v = new Value('foo');
		const view = new TextView(doc, {
			props: props,
			value: v,
		});

		props.set('formatter', (v: string) => v.toUpperCase());

		assert.strictEqual(view.inputElement.value, 'FOO');
	});
});
