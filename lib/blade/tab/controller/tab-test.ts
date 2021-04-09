import * as assert from 'assert';
import {describe} from 'mocha';

import {ValueMap} from '../../../common/model/value-map';
import {createViewProps} from '../../../common/model/view-props';
import {TestUtil} from '../../../misc/test-util';
import {Blade} from '../../common/model/blade';
import {TabController} from '../controller/tab';
import {TabPageController} from './tab-page';

function createTabPage(doc: Document, title: string) {
	return new TabPageController(doc, {
		itemProps: new ValueMap({
			selected: false as boolean,
			title: title,
		}),
		props: new ValueMap({
			selected: false as boolean,
		}),
	});
}

describe(TabController.name, () => {
	it('should select first page by default', () => {
		const doc = TestUtil.createWindow().document;
		const c = new TabController(doc, {
			blade: new Blade(),
			viewProps: createViewProps(),
		});

		c.add(createTabPage(doc, 'foo'));
		c.add(createTabPage(doc, 'bar'));
		assert.strictEqual(c.pageSet.items[0].props.get('selected'), true);
		assert.strictEqual(c.pageSet.items[1].props.get('selected'), false);
	});

	it('should change selection', () => {
		const win = TestUtil.createWindow();
		const doc = win.document;
		const c = new TabController(doc, {
			blade: new Blade(),
			viewProps: createViewProps(),
		});
		c.add(createTabPage(doc, 'foo'));
		const pc = createTabPage(doc, 'bar');
		c.add(pc);
		c.add(createTabPage(doc, 'baz'));
		const ev = TestUtil.createEvent(win, 'click');
		pc.itemController.view.buttonElement.dispatchEvent(ev);
		assert.strictEqual(c.pageSet.items[0].props.get('selected'), false);
		assert.strictEqual(c.pageSet.items[1].props.get('selected'), true);
		assert.strictEqual(c.pageSet.items[2].props.get('selected'), false);
	});
});
