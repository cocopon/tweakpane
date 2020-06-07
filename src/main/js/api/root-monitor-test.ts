import {assert} from 'chai';
import {describe, it} from 'mocha';

import {RootController} from '../controller/root';
import {PaneError} from '../misc/pane-error';
import {TestUtil} from '../misc/test-util';
import {ViewModel} from '../model/view-model';
import {RootApi} from './root';

function createApi(): RootApi {
	const c = new RootController(TestUtil.createWindow().document, {
		viewModel: new ViewModel(),
	});
	return new RootApi(c);
}

describe(RootApi.name, () => {
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
					const api = createApi();

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
				const api = createApi();
				const obj = {foo: params.propertyValue};
				const bapi = api.addMonitor(obj, 'foo', {
					interval: 1,
				});
				bapi.on('update', (value: unknown) => {
					assert.strictEqual(value, expected);
					bapi.dispose();
					done();
				});

				obj.foo = params.newInternalValue;
			});

			it('should pass right first argument for update event (global)', (done) => {
				const api = createApi();
				const obj = {foo: params.propertyValue};
				const bapi = api.addMonitor(obj, 'foo', {
					interval: 1,
				});
				api.on('update', (value: unknown) => {
					assert.strictEqual(value, expected);
					bapi.dispose();
					done();
				});

				obj.foo = params.newInternalValue;
			});
		});
	});

	it('should dispose monitor', () => {
		const PARAMS = {foo: 1};
		const api = createApi();
		const bapi = api.addMonitor(PARAMS, 'foo', {
			interval: 0,
		});
		bapi.dispose();
		assert.strictEqual(
			api.controller.view.element.querySelector('.tp-lblv'),
			null,
		);
	});
});
