import * as assert from 'assert';
import {describe, it} from 'mocha';

import {numberToString, parseNumber} from '../../../common/converter/number';
import {PrimitiveValue} from '../../../common/model/primitive-value';
import {ValueMap} from '../../../common/model/value-map';
import {createViewProps} from '../../../common/model/view-props';
import {SliderTextController} from '../../../common/number/controller/slider-text';
import {TestUtil} from '../../../misc/test-util';
import {
	assertDisposes,
	assertInitialState,
	assertUpdates,
} from '../../common/api/test-util';
import {Blade} from '../../common/model/blade';
import {LabeledController} from '../../labeled/controller/labeled';
import {LabeledPropsObject} from '../../labeled/view/labeled';
import {SliderBladeApi} from './slider';

describe(SliderBladeApi.name, () => {
	it('should dispose', () => {
		const doc = TestUtil.createWindow().document;
		const c = new LabeledController(doc, {
			blade: new Blade(),
			props: new ValueMap({
				label: undefined,
			} as LabeledPropsObject),
			valueController: new SliderTextController(doc, {
				baseStep: 1,
				parser: parseNumber,
				sliderProps: new ValueMap({
					maxValue: 100,
					minValue: 0,
				}),
				textProps: new ValueMap({
					draggingScale: 1,
					formatter: numberToString,
				}),
				value: new PrimitiveValue(0),
				viewProps: createViewProps(),
			}),
		});
		const api = new SliderBladeApi(c);
		assertDisposes(api);
	});

	it('should have initial state', () => {
		const doc = TestUtil.createWindow().document;
		const c = new LabeledController(doc, {
			blade: new Blade(),
			props: new ValueMap({
				label: 'foobar',
			} as LabeledPropsObject),
			valueController: new SliderTextController(doc, {
				baseStep: 1,
				parser: parseNumber,
				sliderProps: new ValueMap({
					maxValue: 100,
					minValue: -100,
				}),
				textProps: new ValueMap({
					draggingScale: 1,
					formatter: numberToString,
				}),
				value: new PrimitiveValue(123),
				viewProps: createViewProps(),
			}),
		});
		const api = new SliderBladeApi(c);

		assertInitialState(api);
		assert.strictEqual(api.maxValue, 100);
		assert.strictEqual(api.minValue, -100);
		assert.strictEqual(api.label, 'foobar');
		assert.strictEqual(api.value, 123);
	});

	it('should update properties', () => {
		const doc = TestUtil.createWindow().document;
		const c = new LabeledController(doc, {
			blade: new Blade(),
			props: new ValueMap({
				label: 'foobar',
			} as LabeledPropsObject),
			valueController: new SliderTextController(doc, {
				baseStep: 1,
				parser: parseNumber,
				sliderProps: new ValueMap({
					maxValue: 100,
					minValue: -100,
				}),
				textProps: new ValueMap({
					draggingScale: 1,
					formatter: numberToString,
				}),
				value: new PrimitiveValue(123),
				viewProps: createViewProps(),
			}),
		});
		const api = new SliderBladeApi(c);

		assertUpdates(api);

		api.label = 'buzqux';
		assert.strictEqual(api.label, 'buzqux');

		api.maxValue = 200;
		assert.strictEqual(api.maxValue, 200);
		api.minValue = -200;
		assert.strictEqual(api.minValue, -200);

		api.value = 0;
		assert.strictEqual(api.value, 0);
	});

	it('should handle event', (done) => {
		const doc = TestUtil.createWindow().document;
		const c = new LabeledController(doc, {
			blade: new Blade(),
			props: new ValueMap({
				label: undefined,
			} as LabeledPropsObject),
			valueController: new SliderTextController(doc, {
				baseStep: 1,
				parser: parseNumber,
				sliderProps: new ValueMap({
					maxValue: 100,
					minValue: 0,
				}),
				textProps: new ValueMap({
					draggingScale: 1,
					formatter: numberToString,
				}),
				value: new PrimitiveValue(0),
				viewProps: createViewProps(),
			}),
		});
		const api = new SliderBladeApi(c);

		api.on('change', (ev) => {
			assert.strictEqual(ev.presetKey, undefined);
			assert.strictEqual(ev.target, api);
			assert.strictEqual(ev.value, 100);
			done();
		});
		api.value = 100;
	});
});
