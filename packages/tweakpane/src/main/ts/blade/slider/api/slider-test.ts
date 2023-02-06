import {
	createBlade,
	createValue,
	LabeledValueController,
	LabelPropsObject,
	numberToString,
	parseNumber,
	SliderTextController,
	ValueMap,
	ViewProps,
} from '@tweakpane/core';
import * as assert from 'assert';
import {describe, it} from 'mocha';

import {
	assertDisposes,
	assertInitialState,
	assertUpdates,
	createTestWindow,
} from '../../../misc/test-util';
import {SliderBladeApi} from './slider';

describe(SliderBladeApi.name, () => {
	it('should dispose', () => {
		const doc = createTestWindow().document;
		const v = createValue(0);
		const c = new LabeledValueController<number, SliderTextController>(doc, {
			blade: createBlade(),
			props: ValueMap.fromObject<LabelPropsObject>({
				label: undefined,
			}),
			value: v,
			valueController: new SliderTextController(doc, {
				baseStep: 1,
				parser: parseNumber,
				sliderProps: ValueMap.fromObject({
					max: 100,
					min: 0,
				}),
				textProps: ValueMap.fromObject({
					draggingScale: 1,
					formatter: numberToString,
				}),
				value: v,
				viewProps: ViewProps.create(),
			}),
		});
		const api = new SliderBladeApi(c);
		assertDisposes(api);
	});

	it('should have initial state', () => {
		const doc = createTestWindow().document;
		const v = createValue(123);
		const c = new LabeledValueController<number, SliderTextController>(doc, {
			blade: createBlade(),
			props: ValueMap.fromObject<LabelPropsObject>({
				label: 'foobar',
			}),
			value: v,
			valueController: new SliderTextController(doc, {
				baseStep: 1,
				parser: parseNumber,
				sliderProps: ValueMap.fromObject({
					max: 100,
					min: -100,
				}),
				textProps: ValueMap.fromObject({
					draggingScale: 1,
					formatter: numberToString,
				}),
				value: v,
				viewProps: ViewProps.create(),
			}),
		});
		const api = new SliderBladeApi(c);

		assertInitialState(api);
		assert.strictEqual(api.max, 100);
		assert.strictEqual(api.min, -100);
		assert.strictEqual(api.label, 'foobar');
		assert.strictEqual(api.value, 123);
	});

	it('should update properties', () => {
		const doc = createTestWindow().document;
		const v = createValue(123);
		const c = new LabeledValueController<number, SliderTextController>(doc, {
			blade: createBlade(),
			props: ValueMap.fromObject<LabelPropsObject>({
				label: 'foobar',
			}),
			value: v,
			valueController: new SliderTextController(doc, {
				baseStep: 1,
				parser: parseNumber,
				sliderProps: ValueMap.fromObject({
					max: 100,
					min: -100,
				}),
				textProps: ValueMap.fromObject({
					draggingScale: 1,
					formatter: numberToString,
				}),
				value: v,
				viewProps: ViewProps.create(),
			}),
		});
		const api = new SliderBladeApi(c);

		assertUpdates(api);

		api.label = 'buzqux';
		assert.strictEqual(api.label, 'buzqux');

		api.max = 200;
		assert.strictEqual(api.max, 200);
		api.min = -200;
		assert.strictEqual(api.min, -200);

		api.value = 0;
		assert.strictEqual(api.value, 0);
	});

	it('should handle event', (done) => {
		const doc = createTestWindow().document;
		const v = createValue(0);
		const c = new LabeledValueController<number, SliderTextController>(doc, {
			blade: createBlade(),
			props: ValueMap.fromObject<LabelPropsObject>({
				label: undefined,
			}),
			value: v,
			valueController: new SliderTextController(doc, {
				baseStep: 1,
				parser: parseNumber,
				sliderProps: ValueMap.fromObject({
					max: 100,
					min: 0,
				}),
				textProps: ValueMap.fromObject({
					draggingScale: 1,
					formatter: numberToString,
				}),
				value: v,
				viewProps: ViewProps.create(),
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
