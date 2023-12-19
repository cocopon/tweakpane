import {
	createBlade,
	createSliderTextProps,
	createValue,
	LabeledValueBladeController,
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
} from '../../../misc/test-util.js';
import {SliderBladeApi} from './slider.js';

function createApi(
	doc: Document,
	config: {
		initialValue: number;
		label: string | null | undefined;
		max: number;
		min: number;
	},
): SliderBladeApi {
	const v = createValue(config.initialValue);
	const c = new LabeledValueBladeController<number, SliderTextController>(doc, {
		blade: createBlade(),
		props: ValueMap.fromObject<LabelPropsObject>({
			label: config.label,
		}),
		value: v,
		valueController: new SliderTextController(doc, {
			...createSliderTextProps({
				formatter: numberToString,
				keyScale: createValue(1),
				max: createValue(config.max),
				min: createValue(config.min),
				pointerScale: 1,
			}),
			parser: parseNumber,
			value: v,
			viewProps: ViewProps.create(),
		}),
	});
	return new SliderBladeApi(c);
}

describe(SliderBladeApi.name, () => {
	it('should dispose', () => {
		const doc = createTestWindow().document;
		const api = createApi(doc, {
			initialValue: 0,
			label: undefined,
			min: 0,
			max: 100,
		});
		assertDisposes(api);
	});

	it('should have initial state', () => {
		const doc = createTestWindow().document;
		const api = createApi(doc, {
			initialValue: 123,
			label: 'foobar',
			min: -100,
			max: +100,
		});

		assertInitialState(api);
		assert.strictEqual(api.max, 100);
		assert.strictEqual(api.min, -100);
		assert.strictEqual(api.label, 'foobar');
		assert.strictEqual(api.value, 123);
	});

	it('should update properties', () => {
		const doc = createTestWindow().document;
		const api = createApi(doc, {
			initialValue: 123,
			label: 'foobar',
			min: -100,
			max: +100,
		});

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
		const api = createApi(doc, {
			initialValue: 0,
			label: undefined,
			min: 0,
			max: 100,
		});

		api.on('change', (ev) => {
			assert.strictEqual(ev.target, api);
			assert.strictEqual(ev.value, 100);
			done();
		});
		api.value = 100;
	});

	it('should unlisten event', () => {
		const doc = createTestWindow().document;
		const api = createApi(doc, {
			initialValue: 0,
			label: undefined,
			min: 0,
			max: 100,
		});
		const handler = () => {
			assert.fail('should not be called');
		};

		api.on('change', handler);
		api.off('change', handler);
		api.value = 100;
	});
});
