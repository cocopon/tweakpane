import {
	createBlade,
	createValue,
	LabelController,
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
import {SliderApi} from './slider';

describe(SliderApi.name, () => {
	it('should dispose', () => {
		const doc = createTestWindow().document;
		const c = new LabelController(doc, {
			blade: createBlade(),
			props: ValueMap.fromObject<LabelPropsObject>({
				label: undefined,
			}),
			valueController: new SliderTextController(doc, {
				baseStep: 1,
				parser: parseNumber,
				sliderProps: ValueMap.fromObject({
					maxValue: 100,
					minValue: 0,
				}),
				textProps: ValueMap.fromObject({
					draggingScale: 1,
					formatter: numberToString,
				}),
				value: createValue(0),
				viewProps: ViewProps.create(),
			}),
		});
		const api = new SliderApi(c);
		assertDisposes(api);
	});

	it('should have initial state', () => {
		const doc = createTestWindow().document;
		const c = new LabelController(doc, {
			blade: createBlade(),
			props: ValueMap.fromObject<LabelPropsObject>({
				label: 'foobar',
			}),
			valueController: new SliderTextController(doc, {
				baseStep: 1,
				parser: parseNumber,
				sliderProps: ValueMap.fromObject({
					maxValue: 100,
					minValue: -100,
				}),
				textProps: ValueMap.fromObject({
					draggingScale: 1,
					formatter: numberToString,
				}),
				value: createValue(123),
				viewProps: ViewProps.create(),
			}),
		});
		const api = new SliderApi(c);

		assertInitialState(api);
		assert.strictEqual(api.maxValue, 100);
		assert.strictEqual(api.minValue, -100);
		assert.strictEqual(api.label, 'foobar');
		assert.strictEqual(api.value, 123);
	});

	it('should update properties', () => {
		const doc = createTestWindow().document;
		const c = new LabelController(doc, {
			blade: createBlade(),
			props: ValueMap.fromObject<LabelPropsObject>({
				label: 'foobar',
			}),
			valueController: new SliderTextController(doc, {
				baseStep: 1,
				parser: parseNumber,
				sliderProps: ValueMap.fromObject({
					maxValue: 100,
					minValue: -100,
				}),
				textProps: ValueMap.fromObject({
					draggingScale: 1,
					formatter: numberToString,
				}),
				value: createValue(123),
				viewProps: ViewProps.create(),
			}),
		});
		const api = new SliderApi(c);

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
		const doc = createTestWindow().document;
		const c = new LabelController(doc, {
			blade: createBlade(),
			props: ValueMap.fromObject<LabelPropsObject>({
				label: undefined,
			}),
			valueController: new SliderTextController(doc, {
				baseStep: 1,
				parser: parseNumber,
				sliderProps: ValueMap.fromObject({
					maxValue: 100,
					minValue: 0,
				}),
				textProps: ValueMap.fromObject({
					draggingScale: 1,
					formatter: numberToString,
				}),
				value: createValue(0),
				viewProps: ViewProps.create(),
			}),
		});
		const api = new SliderApi(c);

		api.on('change', (ev) => {
			assert.strictEqual(ev.presetKey, undefined);
			assert.strictEqual(ev.target, api);
			assert.strictEqual(ev.value, 100);
			done();
		});
		api.value = 100;
	});
});
