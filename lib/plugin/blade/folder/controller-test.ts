import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../../../misc/test-util';
import {ButtonController} from '../button/controller/button';
import {BladeController} from '../common/controller/blade';
import {Blade} from '../common/model/blade';
import {LabeledController} from '../labeled/controller';
import {FolderController} from './controller';
import {FolderEvents} from './model/folder';

function createSomeBladeController(doc: Document): BladeController {
	return new LabeledController(doc, {
		blade: new Blade(),
		valueController: new ButtonController(doc, {
			title: 'Foobar',
		}),
	});
}

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
		const bc = createSomeBladeController(doc);
		c.bladeRack.add(bc);

		assert.strictEqual(c.bladeRack.items.length, 1);
		bc.blade.dispose();
		assert.strictEqual(c.bladeRack.items.length, 0);
	});

	it('should add view element to subfolder', () => {
		const doc = TestUtil.createWindow().document;
		const c = new FolderController(doc, {
			title: 'Folder',
			blade: new Blade(),
		});

		const sc = new FolderController(doc, {
			title: 'Subfolder',
			blade: new Blade(),
		});
		c.bladeRack.add(sc);

		const bc = createSomeBladeController(doc);
		sc.bladeRack.add(bc);
		assert.isTrue(sc.view.element.contains(bc.view.element));
	});
});
