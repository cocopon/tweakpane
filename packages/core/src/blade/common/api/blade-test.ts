import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ViewProps} from '../../../common/model/view-props.js';
import {View} from '../../../common/view/view.js';
import {createTestWindow} from '../../../misc/dom-test-util.js';
import {BladeController} from '../controller/blade.js';
import {createBlade} from '../model/blade.js';
import {BladeApi} from './blade.js';

class TestView implements View {
	readonly element: HTMLElement;

	constructor(doc: Document) {
		this.element = doc.createElement('div');
	}
}

describe(BladeApi.name, () => {
	it('should get element', () => {
		const doc = createTestWindow().document;
		const v = new TestView(doc);
		const c = new BladeController({
			blade: createBlade(),
			view: v,
			viewProps: ViewProps.create(),
		});
		const api = new BladeApi(c);
		assert.strictEqual(api.element, v.element);
	});
});
