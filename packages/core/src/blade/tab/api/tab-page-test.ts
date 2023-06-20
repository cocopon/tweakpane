import * as assert from 'assert';
import {describe} from 'mocha';

import {ValueMap} from '../../../common/model/value-map.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {createTestWindow} from '../../../misc/dom-test-util.js';
import {createDefaultPluginPool} from '../../../plugin/plugins.js';
import {testBladeContainer} from '../../common/api/container-test.js';
import {createBlade} from '../../common/model/blade.js';
import {TestValueBladePlugin} from '../../test-util.js';
import {TabPageController, TabPagePropsObject} from '../controller/tab-page.js';
import {TabItemPropsObject} from '../view/tab-item.js';
import {TabPageApi} from './tab-page.js';

function createApi() {
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
	const pool = createDefaultPluginPool();
	pool.register('test', TestValueBladePlugin);
	return new TabPageApi(c, pool);
}

describe(TabPageApi.name, () => {
	testBladeContainer(createApi);

	it('should have initial state', () => {
		const api = createApi();
		assert.strictEqual(api.selected, false);
		assert.strictEqual(api.title, 'foo');
	});

	it('should update properties', () => {
		const api = createApi();

		api.title = 'changed';
		assert.strictEqual(api.title, 'changed');
		assert.strictEqual(
			api.controller.itemController.view.element.innerHTML.includes('changed'),
			true,
		);

		api.selected = true;
		assert.strictEqual(api.selected, true);
	});
});
