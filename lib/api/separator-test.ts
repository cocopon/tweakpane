import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../misc/test-util';
import {Blade} from '../plugin/blade/common/model/blade';
import {SeparatorController} from '../plugin/blade/separator/controller';
import {defaultViewProps} from '../plugin/common/view/view';
import {SeparatorApi} from './separator';

function createApi(doc: Document): SeparatorApi {
	const c = new SeparatorController(doc, {
		blade: new Blade(),
		viewProps: defaultViewProps(),
	});
	return new SeparatorApi(c);
}

describe(SeparatorApi.name, () => {
	it('should hide', () => {
		const doc = TestUtil.createWindow().document;
		const api = createApi(doc);
		assert.strictEqual(api.hidden, false);

		api.hidden = true;
		assert.isTrue(
			api.controller.view.element.classList.contains('tp-v-hidden'),
		);
	});
});
