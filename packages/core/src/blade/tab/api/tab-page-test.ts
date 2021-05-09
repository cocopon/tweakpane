import * as assert from 'assert';
import {describe} from 'mocha';

import {ValueMap} from '../../../common/model/value-map';
import {createTestWindow} from '../../../misc/dom-test-util';
import {createDefaultPluginPool} from '../../../plugin/plugins';
import {testBladeContainer} from '../../common/api/blade-rack-test';
import {RackApi} from '../../rack/api/rack';
import {TabPageController, TabPagePropsObject} from '../controller/tab-page';
import {TabItemPropsObject} from '../view/tab-item';
import {TabPageApi} from './tab-page';

function createApi() {
	const doc = createTestWindow().document;
	const c = new TabPageController(doc, {
		itemProps: ValueMap.fromObject<TabItemPropsObject>({
			selected: false,
			title: 'foo',
		}),
		props: ValueMap.fromObject<TabPagePropsObject>({
			selected: false,
		}),
	});
	const pool = createDefaultPluginPool();
	return new TabPageApi(c, new RackApi(c.contentController, pool));
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
			api.controller_.itemController.view.element.innerHTML.includes('changed'),
			true,
		);

		api.selected = true;
		assert.strictEqual(api.selected, true);
	});
});
