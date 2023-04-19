import * as assert from 'assert';
import {describe} from 'mocha';

import {createTestWindow} from '../../misc/dom-test-util.js';
import {createDefaultPluginPool} from '../../plugin/plugins.js';
import {createEmptyBladeController} from '../test-util.js';
import {FolderBladePlugin} from './plugin.js';

describe(FolderBladePlugin.id, () => {
	[(doc: Document) => createEmptyBladeController(doc)].forEach(
		(createController) => {
			it('should not create API', () => {
				const doc = createTestWindow().document;
				const c = createController(doc);
				const api = FolderBladePlugin.api({
					controller: c,
					pool: createDefaultPluginPool(),
				});
				assert.strictEqual(api, null);
			});
		},
	);
});
