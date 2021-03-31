import * as assert from 'assert';
import {describe as context, describe, it} from 'mocha';

import {InputBindingApi} from '../blade/common/api/input-binding';
import {TpChangeEvent} from '../blade/common/api/tp-event';
import {TpError} from '../common/tp-error';
import Tweakpane from '../index';
import {Color} from '../input-bindings/color/model/color';
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
			`when adding input with params = ${JSON.stringify(
				testCase.obj,
			)} and key = ${JSON.stringify(testCase.key)}`,
			() => {
				it(`should throw '${testCase.errorType}' error`, () => {
					const pane = createPane();

					try {
						pane.addInput(testCase.obj, testCase.key);
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
		{
			expected: '#224488',
			params: {
				propertyValue: '#123',
				newInternalValue: new Color([0x22, 0x44, 0x88], 'rgb'),
			},
		},
		{
			expected: 'rgb(0, 127, 255)',
			params: {
				propertyValue: 'rgb(10, 20, 30)',
				newInternalValue: new Color([0, 127, 255], 'rgb'),
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
				bapi.controller_.binding.value.rawValue = params.newInternalValue;
			});

			it('should pass right argument for change event (global)', (done) => {
				const pane = createPane();
				const obj = {foo: params.propertyValue};
				const bapi = pane.addInput(obj, 'foo');

				pane.on('change', (ev) => {
					assert.strictEqual(ev instanceof TpChangeEvent, true);
					assert.strictEqual(ev.presetKey, 'foo');
					assert.strictEqual(ev.value, expected);

					if (!(ev.target instanceof InputBindingApi)) {
						assert.fail('unexpected target');
					}
					assert.strictEqual(ev.target.controller_, bapi.controller_);

					done();
				});
				bapi.controller_.binding.value.rawValue = params.newInternalValue;
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
		bapi.on('change', function(this: any) {
			assert.strictEqual(this, bapi);
			done();
		});
		bapi.controller_.binding.value.rawValue = 2;
	});

	it('should apply disabled of input binding params', () => {
		const PARAMS = {foo: 1};
		const pane = createPane();
		const bapi = pane.addInput(PARAMS, 'foo', {
			disabled: true,
		});
		assert.strictEqual(bapi.disabled, true);
		assert.strictEqual(bapi.controller_.viewProps.get('disabled'), true);
	});

	it('should apply disabled of input binding', () => {
		const PARAMS = {foo: 1};
		const pane = createPane();
		const bapi = pane.addInput(PARAMS, 'foo');

		assert.strictEqual(bapi.disabled, false);
		assert.strictEqual(bapi.controller_.viewProps.get('disabled'), false);
		bapi.disabled = true;
		assert.strictEqual(bapi.disabled, true);
		assert.strictEqual(bapi.controller_.viewProps.get('disabled'), true);
	});
});
