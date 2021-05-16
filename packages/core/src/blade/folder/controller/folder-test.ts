import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ValueMap} from '../../../common/model/value-map';
import {ViewProps} from '../../../common/model/view-props';
import {View} from '../../../common/view/view';
import {createTestWindow} from '../../../misc/dom-test-util';
import {ButtonController} from '../../button/controller/button';
import {ButtonPropsObject} from '../../button/view/button';
import {BladeController} from '../../common/controller/blade';
import {createBlade} from '../../common/model/blade';
import {LabelController} from '../../label/controller/label';
import {LabelPropsObject} from '../../label/view/label';
import {FolderPropsObject} from '../view/folder';
import {FolderController} from './folder';

function createSomeBladeController(doc: Document): BladeController<View> {
	return new LabelController(doc, {
		blade: createBlade(),
		props: ValueMap.fromObject<LabelPropsObject>({
			label: undefined,
		}),
		valueController: new ButtonController(doc, {
			props: ValueMap.fromObject<ButtonPropsObject>({
				title: 'Foobar',
			}),
			viewProps: ViewProps.create(),
		}),
	});
}

describe(FolderController.name, () => {
	it('should toggle expanded by clicking title', (done) => {
		const doc = createTestWindow().document;
		const c = new FolderController(doc, {
			blade: createBlade(),
			props: ValueMap.fromObject<FolderPropsObject>({
				title: '',
			}),
			viewProps: ViewProps.create(),
		});

		assert.strictEqual(c.foldable.get('expanded'), true);

		c.foldable.value('expanded').emitter.on('change', () => {
			assert.strictEqual(c.foldable.get('expanded'), false);
			done();
		});

		c.view.buttonElement.click();
	});

	it('should remove disposed blade view element', () => {
		const doc = createTestWindow().document;
		const c = new FolderController(doc, {
			blade: createBlade(),
			props: ValueMap.fromObject<FolderPropsObject>({
				title: '',
			}),
			viewProps: ViewProps.create(),
		});
		const bc = createSomeBladeController(doc);
		c.rackController.rack.add(bc);

		assert.strictEqual(c.view.element.contains(bc.view.element), true);
		bc.viewProps.set('disposed', true);
		assert.strictEqual(c.view.element.contains(bc.view.element), false);
	});

	it('should remove removed blade view element', () => {
		const doc = createTestWindow().document;
		const c = new FolderController(doc, {
			blade: createBlade(),
			props: ValueMap.fromObject<FolderPropsObject>({
				title: '',
			}),
			viewProps: ViewProps.create(),
		});
		const bc = createSomeBladeController(doc);
		c.rackController.rack.add(bc);

		assert.strictEqual(c.view.element.contains(bc.view.element), true);
		c.rackController.rack.remove(bc);
		assert.strictEqual(c.view.element.contains(bc.view.element), false);
	});

	it('should add view element to subfolder', () => {
		const doc = createTestWindow().document;
		const c = new FolderController(doc, {
			blade: createBlade(),
			props: ValueMap.fromObject<FolderPropsObject>({
				title: 'Folder',
			}),
			viewProps: ViewProps.create(),
		});

		const sc = new FolderController(doc, {
			blade: createBlade(),
			props: ValueMap.fromObject<FolderPropsObject>({
				title: '',
			}),
			viewProps: ViewProps.create(),
		});
		c.rackController.rack.add(sc);

		const bc = createSomeBladeController(doc);
		sc.rackController.rack.add(bc);
		assert.strictEqual(sc.view.element.contains(bc.view.element), true);
	});

	it('should dispose sub controllers', () => {
		const doc = createTestWindow().document;
		const c = new FolderController(doc, {
			blade: createBlade(),
			props: ValueMap.fromObject<FolderPropsObject>({
				title: '',
			}),
			viewProps: ViewProps.create(),
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
		const doc = createTestWindow().document;
		const c = new FolderController(doc, {
			blade: createBlade(),
			props: ValueMap.fromObject<FolderPropsObject>({
				title: '',
			}),
			viewProps: ViewProps.create(),
		});
		const sc = new FolderController(doc, {
			blade: createBlade(),
			props: ValueMap.fromObject<FolderPropsObject>({
				title: '',
			}),
			viewProps: ViewProps.create(),
		});
		c.rackController.rack.add(sc);
		const bc = createSomeBladeController(doc);
		sc.rackController.rack.add(bc);

		c.viewProps.set('disposed', true);

		assert.strictEqual(bc.viewProps.get('disposed'), true);
	});
});
