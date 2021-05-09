import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ViewProps} from '../../../common/model/view-props';
import {View} from '../../../common/view/view';
import {createTestWindow} from '../../../misc/dom-test-util';
import {createBlade} from '../model/blade';
import {BladeController} from './blade';

class TestView implements View {
	public readonly element: HTMLElement;

	constructor(doc: Document) {
		this.element = doc.createElement('div');
	}
}

class TestController extends BladeController<TestView> {
	constructor(doc: Document) {
		super({
			blade: createBlade(),
			view: new TestView(doc),
			viewProps: ViewProps.create(),
		});
	}
}

describe(BladeController.name, () => {
	it('should apply view position', () => {
		const doc = createTestWindow().document;
		const c = new TestController(doc);
		const [m, v] = [c.blade, c.view];
		assert.strictEqual(v.element.classList.contains('tp-v-fst'), false);
		assert.strictEqual(v.element.classList.contains('tp-v-lst'), false);
		m.set('positions', ['first']);
		assert.strictEqual(v.element.classList.contains('tp-v-fst'), true);
		m.set('positions', ['last']);
		assert.strictEqual(v.element.classList.contains('tp-v-fst'), false);
		assert.strictEqual(v.element.classList.contains('tp-v-lst'), true);
		m.set('positions', ['first', 'last']);
		assert.strictEqual(v.element.classList.contains('tp-v-fst'), true);
		assert.strictEqual(v.element.classList.contains('tp-v-lst'), true);
	});

	it('should apply disposed', () => {
		const doc = createTestWindow().document;
		const c = new TestController(doc);
		const v = c.view;

		const parentElem = doc.createElement('div');
		parentElem.appendChild(v.element);

		assert.notStrictEqual(v.element.parentNode, null);
		c.viewProps.set('disposed', true);
		assert.strictEqual(v.element.parentNode, null);
	});
});
