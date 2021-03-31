import * as assert from 'assert';
import {describe, it} from 'mocha';

import {createViewProps} from '../../../common/model/view-props';
import {TestUtil} from '../../../misc/test-util';
import {Blade} from '../../common/model/blade';
import {SeparatorController} from '../controller';
import {SeparatorApi} from './separator';

function createApi(doc: Document): SeparatorApi {
	const c = new SeparatorController(doc, {
		blade: new Blade(),
		viewProps: createViewProps(),
	});
	return new SeparatorApi(c);
}

describe(SeparatorApi.name, () => {
	it('should have initial state', () => {
		const doc = TestUtil.createWindow().document;
		const api = createApi(doc);
		assert.strictEqual(api.hidden, false);
	});

	it('should update properties', () => {
		const doc = TestUtil.createWindow().document;
		const api = createApi(doc);

		api.hidden = true;
		assert.strictEqual(
			api.controller_.view.element.classList.contains('tp-v-hidden'),
			true,
		);
	});
});
