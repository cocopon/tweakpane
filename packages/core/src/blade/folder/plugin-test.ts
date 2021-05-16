import * as assert from 'assert';
import {describe} from 'mocha';

import {createTestWindow} from '../../misc/dom-test-util';
import {createDefaultPluginPool} from '../../plugin/plugins';
import {createEmptyBladeController} from '../test-util';
import {FolderBladePlugin} from './plugin';

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
