import {assert} from 'chai';
import {describe, it} from 'mocha';

import {RootController} from '../controller/root';
import {PaneError} from '../misc/pane-error';
import {TestUtil} from '../misc/test-util';
import {RootApi} from './root';

function createApi(): RootApi {
	const c = new RootController(TestUtil.createWindow().document, {});
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
});
