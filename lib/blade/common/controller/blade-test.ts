import * as assert from 'assert';
import {describe, it} from 'mocha';

import {createViewProps} from '../../../common/model/view-props';
import {View} from '../../../common/view/view';
import {TestUtil} from '../../../misc/test-util';
import {Blade} from '../model/blade';
import {BladeController} from './blade';

class TestView implements View {
	public readonly element: HTMLElement;

	constructor(doc: Document) {
		this.element = doc.createElement('div');
	}

	onDispose() {}
}

class TestController extends BladeController<TestView> {
	constructor(doc: Document) {
		super({
			blade: new Blade(),
			view: new TestView(doc),
			viewProps: createViewProps(),
		});
	}
}

describe(BladeController.name, () => {
	it('should apply view position', () => {
		const doc = TestUtil.createWindow().document;
		const c = new TestController(doc);
		const [m, v] = [c.blade, c.view];
		assert.strictEqual(v.element.classList.contains('tp-v-first'), false);
		assert.strictEqual(v.element.classList.contains('tp-v-last'), false);
		m.positions = ['first'];
		assert.strictEqual(v.element.classList.contains('tp-v-first'), true);
		m.positions = ['last'];
		assert.strictEqual(v.element.classList.contains('tp-v-first'), false);
		assert.strictEqual(v.element.classList.contains('tp-v-last'), true);
		m.positions = ['first', 'last'];
		assert.strictEqual(v.element.classList.contains('tp-v-first'), true);
		assert.strictEqual(v.element.classList.contains('tp-v-last'), true);
	});

	it('should apply disposed', () => {
		const doc = TestUtil.createWindow().document;
		const c = new TestController(doc);
		const [m, v] = [c.blade, c.view];

		const parentElem = doc.createElement('div');
		parentElem.appendChild(v.element);

		assert.notStrictEqual(v.element.parentNode, null);
		m.dispose();
		assert.strictEqual(v.element.parentNode, null);
	});
});
