import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ValueMap} from '../../../common/model/value-map.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {createTestWindow} from '../../../misc/dom-test-util.js';
import {TestUtil} from '../../../misc/test-util.js';
import {createBlade} from '../../common/model/blade.js';
import {TestKeyBladeController} from '../../test-util.js';
import {TabItemPropsObject} from '../view/tab-item.js';
import {TabPageController, TabPagePropsObject} from './tab-page.js';

function createController(
	doc: Document,
	config: {
		selected: boolean;
		title: string;
	},
) {
	return new TabPageController(doc, {
		blade: createBlade(),
		itemProps: ValueMap.fromObject<TabItemPropsObject>({
			selected: config.selected,
			title: config.title,
		}),
		props: ValueMap.fromObject<TabPagePropsObject>({
			selected: config.selected,
		}),
		viewProps: ViewProps.create(),
	});
}

describe(TabPageController.name, () => {
	it('should apply initial props', () => {
		const doc = createTestWindow().document;
		const c = createController(doc, {
			selected: false,
			title: 'foo',
		});

		assert.strictEqual(c.itemController.props.get('selected'), false);
		assert.strictEqual(c.itemController.props.get('title'), 'foo');
		assert.strictEqual(c.viewProps.get('hidden'), true);
	});

	it('should apply props change', () => {
		const doc = createTestWindow().document;
		const c = createController(doc, {
			selected: false,
			title: 'foo',
		});

		c.props.set('selected', true);
		assert.strictEqual(c.itemController.props.get('selected'), true);
		assert.strictEqual(c.viewProps.get('hidden'), false);
	});

	it('should be selected by clicking', () => {
		const win = createTestWindow();
		const doc = win.document;
		const c = createController(doc, {
			selected: false,
			title: 'foo',
		});

		const ev = TestUtil.createEvent(win, 'click');
		c.itemController.view.buttonElement.dispatchEvent(ev);
		assert.strictEqual(c.props.get('selected'), true);
	});

	it('should export state', () => {
		const doc = createTestWindow().document;
		const c = createController(doc, {
			selected: false,
			title: 'foo',
		});
		const state = c.exportState();

		assert.ok('disabled' in state);
		assert.ok('hidden' in state);
		assert.ok('children' in state);
		assert.strictEqual(state.selected, false);
		assert.strictEqual(state.title, 'foo');
	});

	it('should import state', () => {
		const doc = createTestWindow().document;
		const c = createController(doc, {
			selected: false,
			title: 'foo',
		});
		c.rackController.rack.add(new TestKeyBladeController(doc, 'bar'));

		assert.strictEqual(
			c.importState({
				disabled: true,
				hidden: true,
				children: [
					{
						disabled: false,
						hidden: false,
						key: 'baz',
					},
				],
				selected: true,
				title: 'qux',
			}),
			true,
		);
		assert.strictEqual(c.itemController.props.get('title'), 'qux');
		assert.strictEqual(c.itemController.props.get('selected'), true);
	});
});
