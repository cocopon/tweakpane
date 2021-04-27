import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ValueMap} from '../../../common/model/value-map';
import {TestUtil} from '../../../misc/test-util';
import {TabPageController} from './tab-page';

describe(TabPageController.name, () => {
	it('should apply initial props', () => {
		const doc = TestUtil.createWindow().document;
		const c = new TabPageController(doc, {
			itemProps: ValueMap.fromObject({
				selected: false as boolean,
				title: 'foo',
			}),
			props: ValueMap.fromObject({
				selected: false as boolean,
			}),
		});
		assert.strictEqual(c.itemController.props.get('selected'), false);
		assert.strictEqual(c.itemController.props.get('title'), 'foo');
		assert.strictEqual(c.contentController.viewProps.get('hidden'), true);
	});

	it('should apply props change', () => {
		const doc = TestUtil.createWindow().document;
		const c = new TabPageController(doc, {
			itemProps: ValueMap.fromObject({
				selected: false as boolean,
				title: 'foo',
			}),
			props: ValueMap.fromObject({
				selected: false as boolean,
			}),
		});

		c.props.set('selected', true);
		assert.strictEqual(c.itemController.props.get('selected'), true);
		assert.strictEqual(c.contentController.viewProps.get('hidden'), false);
	});

	it('should be selected by clicking', () => {
		const win = TestUtil.createWindow();
		const doc = win.document;
		const c = new TabPageController(doc, {
			itemProps: ValueMap.fromObject({
				selected: false as boolean,
				title: 'foo',
			}),
			props: ValueMap.fromObject({
				selected: false as boolean,
			}),
		});

		const ev = TestUtil.createEvent(win, 'click');
		c.itemController.view.buttonElement.dispatchEvent(ev);
		assert.strictEqual(c.props.get('selected'), true);
	});
});
