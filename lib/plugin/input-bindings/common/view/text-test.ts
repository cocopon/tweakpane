import {assert} from 'chai';
import {describe} from 'mocha';

import {TestUtil} from '../../../../misc/test-util';
import {Value} from '../../../common/model/value';
import {ValueMap} from '../../../common/model/value-map';
import {defaultViewProps} from '../../../common/view/view';
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
			viewProps: defaultViewProps(),
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
			viewProps: defaultViewProps(),
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
			viewProps: defaultViewProps(),
		});

		assert.strictEqual(view.inputElement.value, 'hellofooworld');
		props.set('formatter', (v: string) => v.toUpperCase());
		assert.strictEqual(view.inputElement.value, 'FOO');
	});
});
