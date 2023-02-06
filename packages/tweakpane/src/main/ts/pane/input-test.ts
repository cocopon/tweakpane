import {
	CheckboxController,
	ColorController,
	forceCast,
	IntColor,
	ListController,
	ListInputBindingApi,
	NumberTextController,
	Point2dController,
	PointNdTextController,
	SliderInputBindingApi,
	SliderTextController,
	TextController,
	TpChangeEvent,
	TpError,
} from '@tweakpane/core';
import * as assert from 'assert';
import {describe as context, describe, it} from 'mocha';

import {Pane} from '..';
import {createTestWindow} from '../misc/test-util';

function createPane(): Pane {
	return new Pane({
		document: createTestWindow().document,
	});
}

describe(Pane.name, () => {
	[
		{
			errorType: 'nomatchingcontroller',
			key: 'baz',
			obj: {
				foo: 'bar',
			},
		},
		{
			errorType: 'nomatchingcontroller',
			key: 'foo',
			obj: {
				foo: null,
			},
		},
		{
			errorType: 'nomatchingcontroller',
			key: 'child',
			obj: {
				child: {
					foo: 'bar',
				},
			},
		},
	].forEach((testCase) => {
		context(
			`when adding input with params = ${JSON.stringify(
				testCase.obj,
			)} and key = ${JSON.stringify(testCase.key)}`,
			() => {
				it(`should throw '${testCase.errorType}' error`, () => {
					const pane = createPane();

					try {
						pane.addInput(testCase.obj, testCase.key as any);
						assert.fail('should not be called');
					} catch (ev) {
						assert.strictEqual(ev instanceof TpError, true);
						assert.strictEqual((ev as any).type, testCase.errorType);
					}
				});
			},
		);
	});

	[
		{
			expected: 456,
			params: {
				propertyValue: 123,
				newInternalValue: 456,
			},
		},
		{
			expected: 'changed',
			params: {
				propertyValue: 'text',
				newInternalValue: 'changed',
			},
		},
		{
			expected: true,
			params: {
				propertyValue: false,
				newInternalValue: true,
			},
		},
		{
			expected: '#224488',
			params: {
				propertyValue: '#123',
				newInternalValue: new IntColor([0x22, 0x44, 0x88], 'rgb'),
			},
		},
		{
			expected: 'rgb(0, 127, 255)',
			params: {
				propertyValue: 'rgb(10, 20, 30)',
				newInternalValue: new IntColor([0, 127, 255], 'rgb'),
			},
		},
	].forEach(({expected, params}) => {
		context(`when ${JSON.stringify(params)}`, () => {
			it('should pass right argument for change event (local)', (done) => {
				const pane = createPane();
				const obj = {foo: params.propertyValue};
				const bapi = pane.addInput(obj, 'foo');

				bapi.on('change', (ev) => {
					assert.strictEqual(ev instanceof TpChangeEvent, true);
					assert.strictEqual(ev.target, bapi);
					assert.strictEqual(ev.presetKey, 'foo');
					assert.strictEqual(ev.value, expected);
					done();
				});
				bapi.controller_.value.rawValue = params.newInternalValue;
			});

			it('should pass right argument for change event (global)', (done) => {
				const pane = createPane();
				const obj = {foo: params.propertyValue};
				const bapi = pane.addInput(obj, 'foo');

				pane.on('change', (ev) => {
					assert.strictEqual(ev instanceof TpChangeEvent, true);
					assert.strictEqual(ev.presetKey, 'foo');
					assert.strictEqual(ev.value, expected);
					assert.strictEqual(ev.target, bapi);
					done();
				});
				bapi.controller_.value.rawValue = params.newInternalValue;
			});
		});
	});

	it('should dispose input', () => {
		const PARAMS = {foo: 1};
		const pane = createPane();
		const bapi = pane.addInput(PARAMS, 'foo');
		bapi.dispose();
		assert.strictEqual(
			pane.controller_.view.element.querySelector('.tp-lblv'),
			null,
		);
	});

	it('should bind `this` within handler to input itself', (done) => {
		const PARAMS = {foo: 1};
		const pane = createPane();
		const bapi = pane.addInput(PARAMS, 'foo');
		bapi.on('change', function (this: any) {
			assert.strictEqual(this, bapi);
			done();
		});
		bapi.controller_.value.rawValue = 2;
	});

	[
		// Number
		{
			args: {
				value: 3.14,
				params: {},
			},
			expected: {
				controller: NumberTextController,
			},
		},
		{
			args: {
				value: 3.14,
				params: {min: 0},
			},
			expected: {
				controller: NumberTextController,
			},
		},
		{
			args: {
				value: 3.14,
				params: {max: 100},
			},
			expected: {
				controller: NumberTextController,
			},
		},
		{
			args: {
				value: 3.14,
				params: {min: 0, max: 100},
			},
			expected: {
				controller: SliderTextController,
				api: SliderInputBindingApi,
			},
		},
		{
			args: {
				value: 3.14,
				params: {options: {bar: 1, foo: 0}},
			},
			expected: {
				controller: ListController,
				api: ListInputBindingApi,
			},
		},
		{
			args: {
				value: 3.14,
				params: {
					options: [
						{text: 'foo', value: 0},
						{text: 'bar', value: 1},
					],
				},
			},
			expected: {
				controller: ListController,
				api: ListInputBindingApi,
			},
		},
		// String
		{
			args: {
				value: 'foobar',
				params: {},
			},
			expected: {
				controller: TextController,
			},
		},
		{
			args: {
				value: 'foobar',
				params: {
					options: {baz: 'qux', foo: 'bar'},
				},
			},
			expected: {
				controller: ListController,
				api: ListInputBindingApi,
			},
		},
		{
			args: {
				value: '#112233',
				params: {view: 'text'},
			},
			expected: {
				controller: TextController,
			},
		},
		{
			args: {
				value: 'rgb(0, 100, 200)',
				params: {view: 'text'},
			},
			expected: {
				controller: TextController,
			},
		},
		// Boolean
		{
			args: {
				value: false,
				params: {},
			},
			expected: {
				controller: CheckboxController,
			},
		},
		{
			args: {
				value: true,
				params: {
					options: {off: false, on: true},
				},
			},
			expected: {
				controller: ListController,
				api: ListInputBindingApi,
			},
		},
		// Color
		{
			args: {
				value: '#00ff00',
				params: {},
			},
			expected: {
				controller: ColorController,
			},
		},
		{
			args: {
				value: 0x112233,
				params: {
					view: 'color',
				},
			},
			expected: {
				controller: ColorController,
			},
		},
		{
			args: {
				value: 0x11223344,
				params: {
					alpha: true,
					view: 'color',
				},
			},
			expected: {
				controller: ColorController,
			},
		},
		{
			args: {
				value: {r: 0, g: 127, b: 255},
				params: {},
			},
			expected: {
				controller: ColorController,
			},
		},
		{
			args: {
				value: {r: 0, g: 127, b: 255, a: 0.5},
				params: {},
			},
			expected: {
				controller: ColorController,
			},
		},
		// Point2d
		{
			args: {
				value: {x: 12, y: 34},
				params: {},
			},
			expected: {
				controller: Point2dController,
			},
		},
		// Point3d
		{
			args: {
				value: {x: 12, y: 34, z: 56},
				params: {},
			},
			expected: {
				controller: PointNdTextController,
			},
		},
		// Point4d
		{
			args: {
				value: {x: 12, y: 34, z: 56, w: 78},
				params: {},
			},
			expected: {
				controller: PointNdTextController,
			},
		},
	].forEach(({args, expected}) => {
		context(`when params = ${JSON.stringify(args.params)}`, () => {
			it(`should return controller: ${expected.controller.name}`, () => {
				const pane = createPane();
				const obj = {foo: args.value};
				const bapi = pane.addInput(obj, 'foo', forceCast(args.params));
				assert.strictEqual(
					bapi.controller_.valueController instanceof expected.controller,
					true,
				);
			});

			if (expected.api) {
				it(`should return api: ${expected.api.name}`, () => {
					const pane = createPane();
					const obj = {foo: args.value};
					const bapi = pane.addInput(obj, 'foo', forceCast(args.params));
					assert.strictEqual(bapi instanceof expected.api, true);
				});
			}
		});
	});

	it('should throw `alreadydisposed` error when calling dispose() inside input change event', (done) => {
		const pane = createPane();
		const bapi = pane.addInput({foo: 1}, 'foo');

		try {
			bapi.on('change', () => {
				bapi.dispose();
			});
			bapi.controller_.value.rawValue = 2;
		} catch (err: unknown) {
			assert.strictEqual((err as TpError<any>).type, 'alreadydisposed');
			done();
		}
	});
});
