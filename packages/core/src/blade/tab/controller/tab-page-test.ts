import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ValueMap} from '../../../common/model/value-map';
import {ViewProps} from '../../../common/model/view-props';
import {createTestWindow} from '../../../misc/dom-test-util';
import {TestUtil} from '../../../misc/test-util';
import {createBlade} from '../../common/model/blade';
import {TabItemPropsObject} from '../view/tab-item';
import {TabPageController, TabPagePropsObject} from './tab-page';

describe(TabPageController.name, () => {
	it('should apply initial props', () => {
		const doc = createTestWindow().document;
		const c = new TabPageController(doc, {
			blade: createBlade(),
			itemProps: ValueMap.fromObject<TabItemPropsObject>({
				selected: false,
				title: 'foo',
			}),
			props: ValueMap.fromObject<TabPagePropsObject>({
				selected: false,
			}),
			viewProps: ViewProps.create(),
		});
		assert.strictEqual(c.itemController.props.get('selected'), false);
		assert.strictEqual(c.itemController.props.get('title'), 'foo');
		assert.strictEqual(c.viewProps.get('hidden'), true);
	});

	it('should apply props change', () => {
		const doc = createTestWindow().document;
		const c = new TabPageController(doc, {
			blade: createBlade(),
			itemProps: ValueMap.fromObject<TabItemPropsObject>({
				selected: false,
				title: 'foo',
			}),
			props: ValueMap.fromObject<TabPagePropsObject>({
				selected: false,
			}),
			viewProps: ViewProps.create(),
		});

		c.props.set('selected', true);
		assert.strictEqual(c.itemController.props.get('selected'), true);
		assert.strictEqual(c.viewProps.get('hidden'), false);
	});

	it('should be selected by clicking', () => {
		const win = createTestWindow();
		const doc = win.document;
		const c = new TabPageController(doc, {
			blade: createBlade(),
			itemProps: ValueMap.fromObject<TabItemPropsObject>({
				selected: false,
				title: 'foo',
			}),
			props: ValueMap.fromObject<TabPagePropsObject>({
				selected: false,
			}),
			viewProps: ViewProps.create(),
		});

		const ev = TestUtil.createEvent(win, 'click');
		c.itemController.view.buttonElement.dispatchEvent(ev);
		assert.strictEqual(c.props.get('selected'), true);
	});
});
