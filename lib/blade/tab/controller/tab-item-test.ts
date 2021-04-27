import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ValueMap} from '../../../common/model/value-map';
import {createViewProps} from '../../../common/model/view-props';
import {TestUtil} from '../../../misc/test-util';
import {TabItemPropsObject} from '../view/tab-item';
import {TabItemController} from './tab-item';

describe(TabItemController.name, () => {
	it('should apply initial props', () => {
		const doc = TestUtil.createWindow().document;
		const c = new TabItemController(doc, {
			props: ValueMap.fromObject<TabItemPropsObject>({
				selected: false,
				title: 'hello',
			}),
			viewProps: createViewProps(),
		});
		assert.strictEqual(c.view.titleElement.textContent, 'hello');
	});

	it('should update props', () => {
		const doc = TestUtil.createWindow().document;
		const c = new TabItemController(doc, {
			props: ValueMap.fromObject<TabItemPropsObject>({
				selected: false,
				title: 'hello',
			}),
			viewProps: createViewProps(),
		});

		c.props.set('title', 'changed');
		assert.strictEqual(c.view.titleElement.textContent, 'changed');
	});

	it('should fire click event', (done) => {
		const win = TestUtil.createWindow();
		const doc = win.document;
		const c = new TabItemController(doc, {
			props: ValueMap.fromObject<TabItemPropsObject>({
				selected: false,
				title: 'hello',
			}),
			viewProps: createViewProps(),
		});

		c.emitter.on('click', (ev) => {
			assert.strictEqual(ev.sender, c);
			done();
		});

		const ev = TestUtil.createEvent(win, 'click');
		c.view.buttonElement.dispatchEvent(ev);
	});
});
