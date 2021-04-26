import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ValueMap} from '../../../common/model/value-map';
import {createViewProps} from '../../../common/model/view-props';
import {View} from '../../../common/view/view';
import {TestUtil} from '../../../misc/test-util';
import {ButtonController} from '../../button/controller/button';
import {BladeController} from '../../common/controller/blade';
import {Blade} from '../../common/model/blade';
import {LabelController} from '../../label/controller/label';
import {LabelPropsObject} from '../../label/view/label';
import {FolderController} from './folder';

function createSomeBladeController(doc: Document): BladeController<View> {
	return new LabelController(doc, {
		blade: new Blade(),
		props: new ValueMap({
			label: undefined,
		} as LabelPropsObject),
		valueController: new ButtonController(doc, {
			props: new ValueMap({
				title: 'Foobar',
			}),
			viewProps: createViewProps(),
		}),
	});
}

describe(FolderController.name, () => {
	it('should toggle expanded by clicking title', (done) => {
		const doc = TestUtil.createWindow().document;
		const c = new FolderController(doc, {
			blade: new Blade(),
			props: new ValueMap({
				title: '' as string | undefined,
			}),
			viewProps: createViewProps(),
		});

		assert.strictEqual(c.foldable.get('expanded'), true);

		c.foldable.value('expanded').emitter.on('change', () => {
			assert.strictEqual(c.foldable.get('expanded'), false);
			done();
		});

		c.view.buttonElement.click();
	});

	it('should remove disposed blade view element', () => {
		const doc = TestUtil.createWindow().document;
		const c = new FolderController(doc, {
			blade: new Blade(),
			props: new ValueMap({
				title: '' as string | undefined,
			}),
			viewProps: createViewProps(),
		});
		const bc = createSomeBladeController(doc);
		c.rackController.rack.add(bc);

		assert.strictEqual(c.view.element.contains(bc.view.element), true);
		bc.viewProps.set('disposed', true);
		assert.strictEqual(c.view.element.contains(bc.view.element), false);
	});

	it('should remove removed blade view element', () => {
		const doc = TestUtil.createWindow().document;
		const c = new FolderController(doc, {
			blade: new Blade(),
			props: new ValueMap({
				title: '' as string | undefined,
			}),
			viewProps: createViewProps(),
		});
		const bc = createSomeBladeController(doc);
		c.rackController.rack.add(bc);

		assert.strictEqual(c.view.element.contains(bc.view.element), true);
		c.rackController.rack.remove(bc);
		assert.strictEqual(c.view.element.contains(bc.view.element), false);
	});

	it('should add view element to subfolder', () => {
		const doc = TestUtil.createWindow().document;
		const c = new FolderController(doc, {
			blade: new Blade(),
			props: new ValueMap({
				title: 'Folder' as string | undefined,
			}),
			viewProps: createViewProps(),
		});

		const sc = new FolderController(doc, {
			blade: new Blade(),
			props: new ValueMap({
				title: '' as string | undefined,
			}),
			viewProps: createViewProps(),
		});
		c.rackController.rack.add(sc);

		const bc = createSomeBladeController(doc);
		sc.rackController.rack.add(bc);
		assert.strictEqual(sc.view.element.contains(bc.view.element), true);
	});

	it('should dispose sub controllers', () => {
		const doc = TestUtil.createWindow().document;
		const c = new FolderController(doc, {
			blade: new Blade(),
			props: new ValueMap({
				title: '' as string | undefined,
			}),
			viewProps: createViewProps(),
		});

		const bcs = [
			createSomeBladeController(doc),
			createSomeBladeController(doc),
			createSomeBladeController(doc),
		];
		bcs.forEach((bc) => {
			c.rackController.rack.add(bc);
		});
		c.viewProps.set('disposed', true);

		bcs.forEach((bc) => {
			assert.strictEqual(bc.viewProps.get('disposed'), true);
		});
	});

	it('should dispose nested controllers', () => {
		const doc = TestUtil.createWindow().document;
		const c = new FolderController(doc, {
			blade: new Blade(),
			props: new ValueMap({
				title: '' as string | undefined,
			}),
			viewProps: createViewProps(),
		});
		const sc = new FolderController(doc, {
			blade: new Blade(),
			props: new ValueMap({
				title: '' as string | undefined,
			}),
			viewProps: createViewProps(),
		});
		c.rackController.rack.add(sc);
		const bc = createSomeBladeController(doc);
		sc.rackController.rack.add(bc);

		c.viewProps.set('disposed', true);

		assert.strictEqual(bc.viewProps.get('disposed'), true);
	});
});
