import * as assert from 'assert';
import {describe} from 'mocha';

import {TestUtil} from '../../misc/test-util';
import {createEmptyBladeController} from '../test-util';
import {FolderBladePlugin} from './plugin';

describe(FolderBladePlugin.id, () => {
	[(doc: Document) => createEmptyBladeController(doc)].forEach(
		(createController) => {
			it('should not create API', () => {
				const doc = TestUtil.createWindow().document;
				const c = createController(doc);
				const api = FolderBladePlugin.api(c);
				assert.strictEqual(api, null);
			});
		},
	);
});
