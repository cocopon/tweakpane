import * as assert from 'assert';
import {describe as context, describe, it} from 'mocha';

import {createTestWindow} from '../../misc/dom-test-util';
import {forceCast} from '../../misc/type-util';
import {createDefaultPluginPool} from '../../plugin/plugins';
import {createBladeController} from '../plugin';
import {createEmptyBladeController} from '../test-util';
import {SeparatorApi} from './api/separator';
import {SeparatorBladePlugin} from './plugin';

describe(SeparatorBladePlugin.id, () => {
	[{}].forEach((params) => {
		context(`when ${JSON.stringify(params)}`, () => {
			it('should not create API', () => {
				const doc = createTestWindow().document;
				const api = createBladeController(SeparatorBladePlugin, {
					document: doc,
					params: params,
				});
				assert.strictEqual(api, null);
			});
		});
	});

	it('should be created', () => {
		const doc = createTestWindow().document;
		const bc = createBladeController(SeparatorBladePlugin, {
			document: doc,
			params: {
				view: 'separator',
			},
		});
		const pool = createDefaultPluginPool();
		const api = pool.createBladeApi(forceCast(bc)) as SeparatorApi;
		assert.notStrictEqual(api, null);
	});

	[(doc: Document) => createEmptyBladeController(doc)].forEach(
		(createController) => {
			it('should not create API', () => {
				const doc = createTestWindow().document;
				const c = createController(doc);
				const api = SeparatorBladePlugin.api({
					controller: c,
					pool: createDefaultPluginPool(),
				});
				assert.strictEqual(api, null);
			});
		},
	);
});
