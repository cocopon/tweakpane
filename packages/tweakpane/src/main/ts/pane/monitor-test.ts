import {
	BindingApi,
	GraphLogController,
	GraphLogMonitorBindingApi,
	ManualTicker,
	MonitorBindingValue,
	MultiLogController,
	SingleLogController,
	TpChangeEvent,
	TpError,
} from '@tweakpane/core';
import * as assert from 'assert';
import {describe, it} from 'mocha';

import {createTestWindow} from '../misc/test-util.js';
import {Pane} from './pane.js';

function createPane(): Pane {
	return new Pane({
		document: createTestWindow().document,
	});
}

function getTicker(bapi: BindingApi): ManualTicker {
	const v = bapi.controller.value as MonitorBindingValue<unknown>;
	return v.ticker as ManualTicker;
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
			`when adding monitor with params = ${JSON.stringify(
				testCase.obj,
			)} and key = ${JSON.stringify(testCase.key)}`,
			() => {
				it(`should throw '${testCase.errorType}' error`, () => {
					const pane = createPane();

					try {
						pane.addBinding(testCase.obj, testCase.key as any, {
							interval: 0,
							readonly: true,
						});
						assert.fail('should not be called');
					} catch (err) {
						assert.strictEqual(err instanceof TpError, true);
						assert.strictEqual((err as any).type, testCase.errorType);
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
	].forEach(({expected, params}) => {
		context(`when ${JSON.stringify(params)}`, () => {
			it('should pass event argument for update event (local)', (done) => {
				const pane = createPane();
				const obj = {foo: params.propertyValue};
				const bapi = pane.addBinding(obj, 'foo', {
					interval: 0,
					readonly: true,
				});
				bapi.on('change', (ev) => {
					assert.strictEqual(ev instanceof TpChangeEvent, true);
					assert.strictEqual(ev.value, expected);
					bapi.dispose();
					done();
				});

				obj.foo = params.newInternalValue;
				getTicker(bapi).tick();
			});

			it('should pass event for update event (global)', (done) => {
				const pane = createPane();
				const obj = {foo: params.propertyValue};
				const bapi = pane.addBinding(obj, 'foo', {
					interval: 0,
					readonly: true,
				});
				pane.on('change', (ev) => {
					assert.strictEqual(ev instanceof TpChangeEvent, true);
					assert.strictEqual(ev.value, expected);
					bapi.dispose();
					done();
				});

				obj.foo = params.newInternalValue;
				getTicker(bapi).tick();
			});
		});
	});

	it('should dispose monitor', () => {
		const PARAMS = {foo: 1};
		const pane = createPane();
		const bapi = pane.addBinding(PARAMS, 'foo', {
			interval: 0,
			readonly: true,
		});
		bapi.dispose();
		assert.strictEqual(
			pane.controller.view.element.querySelector('.tp-lblv'),
			null,
		);
	});

	it('should bind `this` within handler to monitor itself', (done) => {
		const PARAMS = {foo: 1};
		const pane = createPane();
		const bapi = pane.addBinding(PARAMS, 'foo', {
			interval: 0,
			readonly: true,
		});
		bapi.on('change', function (this: any) {
			bapi.dispose();
			assert.strictEqual(this, bapi);
			done();
		});

		PARAMS.foo = 2;
		getTicker(bapi).tick();
	});

	it('should have right initial buffer', () => {
		const pane = createPane();
		const obj = {foo: 123};
		const bapi = pane.addBinding(obj, 'foo', {
			bufferSize: 5,
			interval: 0,
			readonly: true,
		});

		const v = bapi.controller.value;
		assert.deepStrictEqual(v.rawValue, [
			123,
			undefined,
			undefined,
			undefined,
			undefined,
		]);
	});

	[
		// Number
		{
			args: {
				value: 123,
				params: {
					readonly: true,
				},
			},
			expected: {
				controller: SingleLogController,
			},
		},
		{
			args: {
				value: 123,
				params: {
					bufferSize: 10,
					readonly: true,
				},
			},
			expected: {
				controller: MultiLogController,
			},
		},
		{
			args: {
				value: 123,
				params: {
					readonly: true,
					view: 'graph',
				},
			},
			expected: {
				controller: GraphLogController,
				api: GraphLogMonitorBindingApi,
			},
		},
		// String
		{
			args: {
				value: 'foobar',
				params: {
					readonly: true,
				},
			},
			expected: {
				controller: SingleLogController,
			},
		},
		{
			args: {
				value: 'foobar',
				params: {
					bufferSize: 10,
					readonly: true,
				},
			},
			expected: {
				controller: MultiLogController,
			},
		},
		// Boolean
		{
			args: {
				value: true,
				params: {
					readonly: true,
				},
			},
			expected: {
				controller: SingleLogController,
			},
		},
		{
			args: {
				value: true,
				params: {
					bufferSize: 10,
					readonly: true,
				},
			},
			expected: {
				controller: MultiLogController,
			},
		},
	].forEach(({args, expected}) => {
		context(`when ${JSON.stringify(args)}`, () => {
			it(`should return controller: ${expected.controller.name}`, () => {
				const pane = createPane();
				const obj = {foo: args.value};
				const bapi = pane.addBinding(obj, 'foo', args.params);
				assert.strictEqual(
					bapi.controller.valueController instanceof expected.controller,
					true,
				);
				bapi.dispose();
			});

			if (expected.api) {
				it(`should return api: ${expected.api.name}`, () => {
					const pane = createPane();
					const obj = {foo: args.value};
					const bapi = pane.addBinding(obj, 'foo', args.params);
					assert.strictEqual(bapi instanceof expected.api, true);
					bapi.dispose();
				});
			}
		});
	});

	it('should throw `alreadydisposed` error when calling dispose() inside monitor change event', (done) => {
		const pane = createPane();
		const bapi = pane.addBinding({foo: 1}, 'foo', {
			interval: 0,
			readonly: true,
		});

		try {
			bapi.on('change', () => {
				bapi.dispose();
			});
			getTicker(bapi).tick();
		} catch (err) {
			assert.strictEqual((err as TpError<any>).type, 'alreadydisposed');
			done();
		}
	});
});
