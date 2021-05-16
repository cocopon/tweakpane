import * as assert from 'assert';
import {describe} from 'mocha';

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
	it('should select first page by default', () => {
		const doc = createTestWindow().document;
		const c = new TabController(doc, {
			blade: createBlade(),
			viewProps: ViewProps.create(),
		});

		c.add(createTabPage(doc, 'foo'));
		c.add(createTabPage(doc, 'bar'));
		assert.strictEqual(c.pageSet.items[0].props.get('selected'), true);
		assert.strictEqual(c.pageSet.items[1].props.get('selected'), false);
	});

	it('should select first page by default', () => {
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
		assert.strictEqual(c.pageSet.items[0].props.get('selected'), true);

		c.add(pcs[1]);
		c.add(pcs[2]);
		assert.deepStrictEqual(
			c.pageSet.items.map((i) => i.props.get('selected')),
			[true, false, false],
		);
	});

	it('should change selection', () => {
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
		c.add(pcs[2]);

		pcs[1].props.set('selected', true);
		assert.deepStrictEqual(
			c.pageSet.items.map((i) => i.props.get('selected')),
			[false, true, false],
		);
		pcs[0].props.set('selected', true);
		assert.deepStrictEqual(
			c.pageSet.items.map((i) => i.props.get('selected')),
			[true, false, false],
		);
		pcs[2].props.set('selected', true);
		assert.deepStrictEqual(
			c.pageSet.items.map((i) => i.props.get('selected')),
			[false, false, true],
		);
	});
});
