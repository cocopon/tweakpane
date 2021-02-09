import {assert} from 'chai';
import {describe as context, describe, it} from 'mocha';

import {PaneError} from '../misc/pane-error';
import {TestUtil} from '../misc/test-util';
import {Color} from '../model/color';
import {TweakpaneWithoutStyle} from '../tweakpane-without-style';

function createPane(): TweakpaneWithoutStyle {
	return new TweakpaneWithoutStyle({
		document: TestUtil.createWindow().document,
	});
}

describe(TweakpaneWithoutStyle.name, () => {
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
			`when adding input with params = ${JSON.stringify(
				testCase.obj,
			)} and key = ${JSON.stringify(testCase.key)}`,
			() => {
				it(`should throw '${testCase.errorType}' error`, () => {
					const pane = createPane();

					try {
						pane.addInput(testCase.obj, testCase.key);
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
			it('should pass right first argument for change event (local)', (done) => {
				const api = createPane();
				const obj = {foo: params.propertyValue};
				const bapi = api.addInput(obj, 'foo');

				bapi.on('change', (value: unknown) => {
					assert.strictEqual(value, expected);
					done();
				});
				bapi.controller.binding.value.rawValue = params.newInternalValue;
			});

			it('should pass right first argument for change event (global)', (done) => {
				const api = createPane();
				api.on('change', (value: unknown) => {
					assert.strictEqual(value, expected);
					done();
				});

				const obj = {foo: params.propertyValue};
				const bapi = api.addInput(obj, 'foo');
				bapi.controller.binding.value.rawValue = params.newInternalValue;
			});
		});
	});

	it('should dispose input', () => {
		const PARAMS = {foo: 1};
		const api = createPane();
		const bapi = api.addInput(PARAMS, 'foo');
		bapi.dispose();
		assert.strictEqual(
			api.controller.view.element.querySelector('.tp-lblv'),
			null,
		);
	});

	it('should bind `this` within handler to input itself', (done) => {
		const PARAMS = {foo: 1};
		const api = createPane();
		const bapi = api.addInput(PARAMS, 'foo');
		bapi.on('change', function() {
			assert.strictEqual(this, bapi);
			done();
		});
		bapi.controller.binding.value.rawValue = 2;
	});
});
