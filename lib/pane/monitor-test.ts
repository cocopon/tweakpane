import * as assert from 'assert';
import {describe, it} from 'mocha';

import Tweakpane from '..';
import {TpUpdateEvent} from '../blade/common/api/tp-event';
import {ManualTicker} from '../common/binding/ticker/manual';
import {TpError} from '../common/tp-error';
import {TestUtil} from '../misc/test-util';

function createPane(): Tweakpane {
	return new Tweakpane({
		document: TestUtil.createWindow().document,
	});
}

describe(Tweakpane.name, () => {
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
						pane.addMonitor(testCase.obj, testCase.key, {
							interval: 0,
						});
						assert.fail('should not be called');
					} catch (e) {
						assert.strictEqual(e instanceof TpError, true);
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
		bapi.on('update', function(this: any) {
			bapi.dispose();
			assert.strictEqual(this, bapi);
			done();
		});

		PARAMS.foo = 2;
		(bapi.controller_.binding.ticker as ManualTicker).tick();
	});
});
