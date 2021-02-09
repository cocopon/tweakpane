import {assert} from 'chai';
import {describe, it} from 'mocha';

import {PaneError} from '../misc/pane-error';
import {TestUtil} from '../misc/test-util';
import {ManualTicker} from '../misc/ticker/manual';
import {PlainTweakpane} from './plain-tweakpane';

function createPane(): PlainTweakpane {
	return new PlainTweakpane({
		document: TestUtil.createWindow().document,
	});
}

describe(PlainTweakpane.name, () => {
	[
		{
			errorType: 'emptyvalue',
			key: 'baz',
			obj: {
				foo: 'bar',
			},
		},
		{
			errorType: 'emptyvalue',
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
					const api = createPane();

					try {
						api.addMonitor(testCase.obj, testCase.key, {
							interval: 0,
						});
						throw new Error('should not be called');
					} catch (e) {
						assert.instanceOf(e, PaneError);
						assert.strictEqual(e.type, testCase.errorType);
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
			it('should pass right first argument for update event (local)', (done) => {
				const api = createPane();
				const obj = {foo: params.propertyValue};
				const bapi = api.addMonitor(obj, 'foo', {
					interval: 0,
				});
				bapi.on('update', (value: unknown) => {
					assert.strictEqual(value, expected);
					bapi.dispose();
					done();
				});

				obj.foo = params.newInternalValue;
				(bapi.controller.binding.ticker as ManualTicker).tick();
			});

			it('should pass right first argument for update event (global)', (done) => {
				const api = createPane();
				const obj = {foo: params.propertyValue};
				const bapi = api.addMonitor(obj, 'foo', {
					interval: 0,
				});
				api.on('update', (value: unknown) => {
					assert.strictEqual(value, expected);
					bapi.dispose();
					done();
				});

				obj.foo = params.newInternalValue;
				(bapi.controller.binding.ticker as ManualTicker).tick();
			});
		});
	});

	it('should dispose monitor', () => {
		const PARAMS = {foo: 1};
		const api = createPane();
		const bapi = api.addMonitor(PARAMS, 'foo', {
			interval: 0,
		});
		bapi.dispose();
		assert.strictEqual(
			api.controller.view.element.querySelector('.tp-lblv'),
			null,
		);
	});

	it('should bind `this` within handler to monitor itself', (done) => {
		const PARAMS = {foo: 1};
		const api = createPane();
		const bapi = api.addMonitor(PARAMS, 'foo', {
			interval: 0,
		});
		bapi.on('update', function() {
			bapi.dispose();
			assert.strictEqual(this, bapi);
			done();
		});

		PARAMS.foo = 2;
		(bapi.controller.binding.ticker as ManualTicker).tick();
	});
});
