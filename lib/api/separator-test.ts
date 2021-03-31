import * as assert from 'assert';
import {describe, it} from 'mocha';

import {TestUtil} from '../misc/test-util';
import {Blade} from '../plugin/blade/common/model/blade';
import {SeparatorController} from '../plugin/blade/separator/controller';
import {createViewProps} from '../plugin/common/model/view-props';
import {SeparatorApi} from './separator';

function createApi(doc: Document): SeparatorApi {
	const c = new SeparatorController(doc, {
		blade: new Blade(),
		viewProps: createViewProps(),
	});
	return new SeparatorApi(c);
}

describe(SeparatorApi.name, () => {
	it('should hide', () => {
		const doc = TestUtil.createWindow().document;
		const api = createApi(doc);
		assert.strictEqual(api.hidden, false);

		api.hidden = true;
		assert.strictEqual(
			api.controller_.view.element.classList.contains('tp-v-hidden'),
			true,
		);
	});
});
