import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ValueMap} from '../../../common/model/value-map';
import {ViewProps} from '../../../common/model/view-props';
import {createTestWindow} from '../../../misc/dom-test-util';
import {createBlade} from '../../common/model/blade';
import {TabItemPropsObject} from '../view/tab-item';
import {TabController} from './tab';
import {TabPageController, TabPagePropsObject} from './tab-page';

function createTabPage(doc: Document, title: string) {
	return new TabPageController(doc, {
		itemProps: ValueMap.fromObject<TabItemPropsObject>({
			selected: false,
			title: title,
		}),
		props: ValueMap.fromObject<TabPagePropsObject>({
			selected: false,
		}),
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

		assert.strictEqual(c.pageSet.items[0], pc);
		assert.strictEqual(
			c.view.itemsElement.contains(pc.itemController.view.element),
			true,
		);
		assert.strictEqual(
			c.view.contentsElement.contains(pc.contentController.view.element),
			true,
		);
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

		assert.strictEqual(c.pageSet.items[1], pcs[2]);
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
		assert.deepStrictEqual(c.pageSet.items, [pcs[0], pcs[2]]);
		assert.strictEqual(
			c.view.itemsElement.contains(pcs[1].itemController.view.element),
			false,
		);
		assert.strictEqual(
			c.view.contentsElement.contains(pcs[1].contentController.view.element),
			false,
		);
	});
});
