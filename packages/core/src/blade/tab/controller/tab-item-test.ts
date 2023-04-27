import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ValueMap} from '../../../common/model/value-map.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {createTestWindow} from '../../../misc/dom-test-util.js';
import {TestUtil} from '../../../misc/test-util.js';
import {TabItemPropsObject} from '../view/tab-item.js';
import {TabItemController} from './tab-item.js';

describe(TabItemController.name, () => {
	it('should apply initial props', () => {
		const doc = createTestWindow().document;
		const c = new TabItemController(doc, {
			props: ValueMap.fromObject<TabItemPropsObject>({
				selected: false,
				title: 'hello',
			}),
			viewProps: ViewProps.create(),
		});
		assert.strictEqual(c.view.titleElement.textContent, 'hello');
	});

	it('should update props', () => {
		const doc = createTestWindow().document;
		const c = new TabItemController(doc, {
			props: ValueMap.fromObject<TabItemPropsObject>({
				selected: false,
				title: 'hello',
			}),
			viewProps: ViewProps.create(),
		});

		c.props.set('title', 'changed');
		assert.strictEqual(c.view.titleElement.textContent, 'changed');
	});

	it('should fire click event', (done) => {
		const win = createTestWindow();
		const doc = win.document;
		const c = new TabItemController(doc, {
			props: ValueMap.fromObject<TabItemPropsObject>({
				selected: false,
				title: 'hello',
			}),
			viewProps: ViewProps.create(),
		});

		c.emitter.on('click', (ev) => {
			assert.strictEqual(ev.sender, c);
			done();
		});

		const ev = TestUtil.createEvent(win, 'click');
		c.view.buttonElement.dispatchEvent(ev);
	});
});
