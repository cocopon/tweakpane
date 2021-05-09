import * as assert from 'assert';
import {describe} from 'mocha';

import {ValueMap} from '../../../common/model/value-map';
import {createTestWindow} from '../../../misc/dom-test-util';
import {createValue} from '../../model/values';
import {ViewProps} from '../../model/view-props';
import {SliderView} from './slider';

describe(SliderView.name, () => {
	it('should apply initial value', () => {
		const doc = createTestWindow().document;
		const props = ValueMap.fromObject({
			maxValue: 200,
			minValue: 0,
		});
		const v = createValue(100);
		const view = new SliderView(doc, {
			props: props,
			value: v,
			viewProps: ViewProps.create(),
		});

		assert.strictEqual(view.knobElement.style.width, '50%');
	});

	it('should apply value change', () => {
		const doc = createTestWindow().document;
		const props = ValueMap.fromObject({
			maxValue: 200,
			minValue: 0,
		});
		const v = createValue(100);
		const view = new SliderView(doc, {
			props: props,
			value: v,
			viewProps: ViewProps.create(),
		});

		v.rawValue = 0;

		assert.strictEqual(view.knobElement.style.width, '0%');
	});

	it('should apply props change', () => {
		const doc = createTestWindow().document;
		const props = ValueMap.fromObject({
			maxValue: 200,
			minValue: 0,
		});
		const v = createValue(100);
		const view = new SliderView(doc, {
			props: props,
			value: v,
			viewProps: ViewProps.create(),
		});

		props.set('maxValue', 100);

		assert.strictEqual(view.knobElement.style.width, '100%');
	});
});
