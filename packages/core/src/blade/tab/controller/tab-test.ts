import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ValueMap} from '../../../common/model/value-map.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {createTestWindow} from '../../../misc/dom-test-util.js';
import {createBlade} from '../../common/model/blade.js';
import {TabItemPropsObject} from '../view/tab-item.js';
import {TabController} from './tab.js';
import {TabPageController, TabPagePropsObject} from './tab-page.js';

function createTabPage(doc: Document, title: string) {
	return new TabPageController(doc, {
		blade: createBlade(),
		itemProps: ValueMap.fromObject<TabItemPropsObject>({
			selected: false,
			title: title,
		}),
		props: ValueMap.fromObject<TabPagePropsObject>({
			selected: false,
		}),
		viewProps: ViewProps.create(),
	});
}

describe(TabController.name, () => {
	it('should add page element', () => {
		const win = createTestWindow();
		const doc = win.document;
		const c = new TabController(doc, {
			blade: createBlade(),
			viewProps: ViewProps.create(),
		});
		const pc = createTabPage(doc, 'foo');
		c.add(pc);

		assert.strictEqual(c.rackController.rack.children[0], pc);
		assert.strictEqual(
			c.view.itemsElement.contains(pc.itemController.view.element),
			true,
		);
		assert.strictEqual(c.view.contentsElement.contains(pc.view.element), true);
	});

	it('should insert page at specific position', () => {
		const win = createTestWindow();
		const doc = win.document;
		const c = new TabController(doc, {
			blade: createBlade(),
			viewProps: ViewProps.create(),
		});
		const pcs = [
			createTabPage(doc, 'foo'),
			createTabPage(doc, 'bar'),
			createTabPage(doc, 'baz'),
		];
		c.add(pcs[0]);
		c.add(pcs[1]);
		c.add(pcs[2], 1);

		assert.strictEqual(c.rackController.rack.children[1], pcs[2]);
	});

	it('should remove page', () => {
		const win = createTestWindow();
		const doc = win.document;
		const c = new TabController(doc, {
			blade: createBlade(),
			viewProps: ViewProps.create(),
		});
		const pcs = [
			createTabPage(doc, 'foo'),
			createTabPage(doc, 'bar'),
			createTabPage(doc, 'baz'),
		];
		pcs.forEach((pc) => c.add(pc));

		c.remove(1);
		assert.deepStrictEqual(c.rackController.rack.children, [pcs[0], pcs[2]]);
		assert.strictEqual(
			c.view.itemsElement.contains(pcs[1].itemController.view.element),
			false,
		);
		assert.strictEqual(
			c.view.contentsElement.contains(pcs[1].view.element),
			false,
		);
	});

	it('should apply parent disabled', () => {
		const win = createTestWindow();
		const doc = win.document;
		const c = new TabController(doc, {
			blade: createBlade(),
			viewProps: ViewProps.create(),
		});
		const pc = createTabPage(doc, 'foo');
		c.add(pc);

		c.viewProps.set('disabled', true);

		assert.strictEqual(
			pc.itemController.viewProps.globalDisabled.rawValue,
			true,
		);
	});
});
