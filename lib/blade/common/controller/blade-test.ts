import * as assert from 'assert';
import {describe, it} from 'mocha';

import {createViewProps} from '../../../common/model/view-props';
import {View} from '../../../common/view/view';
import {TestUtil} from '../../../misc/test-util';
import {Blade} from '../model/blade';
import {BladeController, setUpBladeController} from './blade';

class TestView implements View {
	public readonly element: HTMLElement;

	constructor(doc: Document) {
		this.element = doc.createElement('div');
	}

	onDispose() {}
}

class TestController implements BladeController {
	public readonly blade: Blade;
	public readonly view: TestView;
	public readonly viewProps = createViewProps();

	constructor(doc: Document) {
		this.blade = new Blade();
		this.view = new TestView(doc);
		setUpBladeController(this);
	}
}

describe(setUpBladeController.name, () => {
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
