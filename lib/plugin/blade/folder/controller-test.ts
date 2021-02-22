import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../../../misc/test-util';
import {FolderEvents} from '../../common/model/folder';
import {ButtonController} from '../button/controller';
import {Blade} from '../common/model/blade';
import {FolderController} from './controller';

describe(FolderController.name, () => {
	it('should toggle expanded by clicking title', (done) => {
		const doc = TestUtil.createWindow().document;
		const c = new FolderController(doc, {
			title: 'Push',
			blade: new Blade(),
		});

		assert.strictEqual(c.folder.expanded, true);

		c.folder.emitter.on('change', (ev: FolderEvents['change']) => {
			if (ev.propertyName !== 'expanded') {
				return;
			}
			assert.strictEqual(c.folder.expanded, false);
			done();
		});

		c.view.titleElement.click();
	});

	it('should remove list item after disposing child view', () => {
		const doc = TestUtil.createWindow().document;
		const c = new FolderController(doc, {
			title: 'Push',
			blade: new Blade(),
		});
		const cc = new ButtonController(doc, {
			title: 'Foobar',
			blade: new Blade(),
		});
		c.bladeRack.add(cc);

		assert.strictEqual(c.bladeRack.items.length, 1);
		cc.blade.dispose();
		assert.strictEqual(c.bladeRack.items.length, 0);
	});
});
