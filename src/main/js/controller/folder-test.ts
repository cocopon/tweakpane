import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../misc/test-util';
import {ViewModel} from '../model/view-model';
import {ButtonController} from './button';
import {FolderController} from './folder';

describe(FolderController.name, () => {
	it('should toggle expanded by clicking title', (done) => {
		const doc = TestUtil.createWindow().document;
		const c = new FolderController(doc, {
			title: 'Push',
			viewModel: new ViewModel(),
		});

		assert.strictEqual(c.folder.expanded, true);

		c.folder.emitter.on('change', () => {
			assert.strictEqual(c.folder.expanded, false);
			done();
		});

		c.view.titleElement.click();
	});

	it('should remove list item after disposing child view', () => {
		const doc = TestUtil.createWindow().document;
		const c = new FolderController(doc, {
			title: 'Push',
			viewModel: new ViewModel(),
		});
		const cc = new ButtonController(doc, {
			title: 'Foobar',
			viewModel: new ViewModel(),
		});
		c.uiControllerList.add(cc);

		assert.strictEqual(c.uiControllerList.items.length, 1);
		cc.viewModel.dispose();
		assert.strictEqual(c.uiControllerList.items.length, 0);
	});
});
