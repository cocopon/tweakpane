import * as assert from 'assert';
import {describe as context, describe, it} from 'mocha';

import {TestUtil} from '../../misc/test-util';
import {createApi} from '../plugin';
import {createEmptyBladeController} from '../test-util';
import {SeparatorApi} from './api/separator';
import {SeparatorBladePlugin} from './plugin';

describe(SeparatorBladePlugin.id, () => {
	[{}].forEach((params) => {
		context(`when ${JSON.stringify(params)}`, () => {
			it('should not create API', () => {
				const doc = TestUtil.createWindow().document;
				const api = createApi(SeparatorBladePlugin, {
					document: doc,
					params: params,
				});
				assert.strictEqual(api, null);
			});
		});
	});

	it('should be created', () => {
		const doc = TestUtil.createWindow().document;
		const api = createApi(SeparatorBladePlugin, {
			document: doc,
			params: {
				view: 'separator',
			},
		}) as SeparatorApi;
		assert.notStrictEqual(api, null);
	});

	[(doc: Document) => createEmptyBladeController(doc)].forEach(
		(createController) => {
			it('should not create API', () => {
				const doc = TestUtil.createWindow().document;
				const c = createController(doc);
				const api = SeparatorBladePlugin.api(c);
				assert.strictEqual(api, null);
			});
		},
	);
});
