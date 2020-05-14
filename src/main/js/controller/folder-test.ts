import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../misc/test-util';
import {Disposable} from '../model/disposable';
import {ButtonController} from './button';
import {FolderController} from './folder';

describe(FolderController.name, () => {
	it('should toggle expanded by clicking title', (done) => {
		const doc = TestUtil.createWindow().document;
		const c = new FolderController(doc, {
			disposable: new Disposable(),
			title: 'Push',
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
			disposable: new Disposable(),
			title: 'Push',
		});
		const cc = new ButtonController(doc, {
			disposable: new Disposable(),
			title: 'Foobar',
		});
		c.uiControllerList.append(cc);

		assert.strictEqual(c.uiControllerList.items.length, 1);
		cc.disposable.dispose();
		assert.strictEqual(c.uiControllerList.items.length, 0);
	});
});
