import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ViewProps} from '../../../common/model/view-props';
import {View} from '../../../common/view/view';
import {createTestWindow} from '../../../misc/dom-test-util';
import {BladeController} from '../controller/blade';
import {createBlade} from '../model/blade';
import {BladeApi} from './blade';

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
