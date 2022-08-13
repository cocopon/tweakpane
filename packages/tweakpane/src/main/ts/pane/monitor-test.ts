import {
	GraphLogController,
	ManualTicker,
	MultiLogController,
	SingleLogController,
	TpError,
	TpUpdateEvent,
} from '@tweakpane/core';
import * as assert from 'assert';
import {describe, it} from 'mocha';

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
			`when adding monitor with params = ${JSON.stringify(
				testCase.obj,
			)} and key = ${JSON.stringify(testCase.key)}`,
			() => {
				it(`should throw '${testCase.errorType}' error`, () => {
					const pane = createPane();

					try {
						pane.addMonitor(testCase.obj, testCase.key as any, {
							interval: 0,
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
				const bapi = pane.addMonitor(obj, 'foo', {
					interval: 0,
				});
				bapi.on('update', (ev) => {
					assert.strictEqual(ev instanceof TpUpdateEvent, true);
					assert.strictEqual(ev.value, expected);
					bapi.dispose();
					done();
				});

				obj.foo = params.newInternalValue;
				(bapi.controller_.binding.ticker as ManualTicker).tick();
			});

			it('should pass event for update event (global)', (done) => {
				const pane = createPane();
				const obj = {foo: params.propertyValue};
				const bapi = pane.addMonitor(obj, 'foo', {
					interval: 0,
				});
				pane.on('update', (ev) => {
					assert.strictEqual(ev instanceof TpUpdateEvent, true);
					assert.strictEqual(ev.value, expected);
					bapi.dispose();
					done();
				});

				obj.foo = params.newInternalValue;
				(bapi.controller_.binding.ticker as ManualTicker).tick();
			});
		});
	});

	it('should dispose monitor', () => {
		const PARAMS = {foo: 1};
		const pane = createPane();
		const bapi = pane.addMonitor(PARAMS, 'foo', {
			interval: 0,
		});
		bapi.dispose();
		assert.strictEqual(
			pane.controller_.view.element.querySelector('.tp-lblv'),
			null,
		);
	});

	it('should bind `this` within handler to monitor itself', (done) => {
		const PARAMS = {foo: 1};
		const pane = createPane();
		const bapi = pane.addMonitor(PARAMS, 'foo', {
			interval: 0,
		});
		bapi.on('update', function (this: any) {
			bapi.dispose();
			assert.strictEqual(this, bapi);
			done();
		});

		PARAMS.foo = 2;
		(bapi.controller_.binding.ticker as ManualTicker).tick();
	});

	it('should have right initial buffer', () => {
		const pane = createPane();
		const obj = {foo: 123};
		const bapi = pane.addMonitor(obj, 'foo', {
			bufferSize: 5,
			interval: 0,
		});

		const v = bapi.controller_.binding.value;
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
				params: {},
			},
			expectedClass: SingleLogController,
		},
		{
			args: {
				value: 123,
				params: {
					bufferSize: 10,
				},
			},
			expectedClass: MultiLogController,
		},
		{
			args: {
				value: 123,
				params: {
					view: 'graph',
				},
			},
			expectedClass: GraphLogController,
		},
		// String
		{
			args: {
				value: 'foobar',
				params: {},
			},
			expectedClass: SingleLogController,
		},
		{
			args: {
				value: 'foobar',
				params: {
					bufferSize: 10,
				},
			},
			expectedClass: MultiLogController,
		},
		// Boolean
		{
			args: {
				value: true,
				params: {},
			},
			expectedClass: SingleLogController,
		},
		{
			args: {
				value: true,
				params: {
					bufferSize: 10,
				},
			},
			expectedClass: MultiLogController,
		},
	].forEach((testCase) => {
		context(`when ${JSON.stringify(testCase.args)}`, () => {
			it(`should return controller: ${testCase.expectedClass.name}`, () => {
				const pane = createPane();
				const obj = {foo: testCase.args.value};
				const bapi = pane.addMonitor(obj, 'foo', testCase.args.params);
				assert.strictEqual(
					bapi.controller_.valueController instanceof testCase.expectedClass,
					true,
				);
				bapi.dispose();
			});
		});
	});

	it('should throw `alreadydisposed` error when calling dispose() inside monitor change event', (done) => {
		const pane = createPane();
		const bapi = pane.addMonitor({foo: 1}, 'foo', {
			interval: 0,
		});

		try {
			bapi.on('update', () => {
				bapi.dispose();
			});
			(bapi.controller_.binding.ticker as ManualTicker).tick();
		} catch (err) {
			assert.strictEqual((err as TpError<any>).type, 'alreadydisposed');
			done();
		}
	});
});
