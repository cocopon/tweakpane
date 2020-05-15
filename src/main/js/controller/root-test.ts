import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../misc/test-util';
import {Disposable} from '../model/disposable';
import {RootController} from './root';

describe(RootController.name, () => {
	it('should toggle expanded when clicking title element', () => {
		const c = new RootController(TestUtil.createWindow().document, {
			disposable: new Disposable(),
			title: 'Tweakpane',
		});

		if (c.view.titleElement) {
			c.view.titleElement.click();
		}

		assert.strictEqual(c.folder && c.folder.expanded, false);
	});
});
