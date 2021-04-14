import * as assert from 'assert';
import {describe} from 'mocha';

import {ValueMap} from '../../../common/model/value-map';
import {TestUtil} from '../../../misc/test-util';
import {testBladeContainer} from '../../common/api/blade-container-test';
import {RackApi} from '../../rack/api/rack';
import {TabPageController} from '../controller/tab-page';
import {TabPageApi} from './tab-page';

function createApi() {
	const doc = TestUtil.createWindow().document;
	const c = new TabPageController(doc, {
		itemProps: new ValueMap({
			selected: false as boolean,
			title: 'foo',
		}),
		props: new ValueMap({
			selected: false as boolean,
		}),
	});
	return new TabPageApi(c, new RackApi(c.contentController));
}

describe(TabPageApi.name, () => {
	testBladeContainer(createApi);

	it('should have initial state', () => {
		const api = createApi();
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
	});
});
