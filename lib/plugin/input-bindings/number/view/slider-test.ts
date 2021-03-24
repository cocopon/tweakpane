import {assert} from 'chai';
import {describe} from 'mocha';

import {TestUtil} from '../../../../misc/test-util';
import {Value} from '../../../common/model/value';
import {ValueMap} from '../../../common/model/value-map';
import {SliderView} from './slider';

describe(SliderView.name, () => {
	it('should apply initial value', () => {
		const doc = TestUtil.createWindow().document;
		const props = new ValueMap({
			maxValue: 200,
			minValue: 0,
		});
		const v = new Value(100);
		const view = new SliderView(doc, {
			props: props,
			value: v,
		});

		assert.strictEqual(view.knobElement.style.width, '50%');
	});

	it('should apply value change', () => {
		const doc = TestUtil.createWindow().document;
		const props = new ValueMap({
			maxValue: 200,
			minValue: 0,
		});
		const v = new Value(100);
		const view = new SliderView(doc, {
			props: props,
			value: v,
		});

		v.rawValue = 0;

		assert.strictEqual(view.knobElement.style.width, '0%');
	});

	it('should apply props change', () => {
		const doc = TestUtil.createWindow().document;
		const props = new ValueMap({
			maxValue: 200,
			minValue: 0,
		});
		const v = new Value(100);
		const view = new SliderView(doc, {
			props: props,
			value: v,
		});

		props.set('maxValue', 100);

		assert.strictEqual(view.knobElement.style.width, '100%');
	});
});
