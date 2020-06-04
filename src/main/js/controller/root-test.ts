import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../misc/test-util';
import {ViewModel} from '../model/view-model';
import {RootController} from './root';

describe(RootController.name, () => {
	it('should toggle expanded when clicking title element', () => {
		const c = new RootController(TestUtil.createWindow().document, {
			title: 'Tweakpane',
			viewModel: new ViewModel(),
		});

		if (c.view.titleElement) {
			c.view.titleElement.click();
		}

		assert.strictEqual(c.folder && c.folder.expanded, false);
	});
});
