import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../../../../misc/test-util';
import {defaultViewProps, View} from '../../../common/view/view';
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
	public readonly viewProps = defaultViewProps();

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
		assert.isNotTrue(v.element.classList.contains('tp-v-first'));
		assert.isNotTrue(v.element.classList.contains('tp-v-last'));
		m.positions = ['first'];
		assert.isTrue(v.element.classList.contains('tp-v-first'));
		m.positions = ['last'];
		assert.isNotTrue(v.element.classList.contains('tp-v-first'));
		assert.isTrue(v.element.classList.contains('tp-v-last'));
		m.positions = ['first', 'last'];
		assert.isTrue(v.element.classList.contains('tp-v-first'));
		assert.isTrue(v.element.classList.contains('tp-v-last'));
	});

	it('should apply disposed', () => {
		const doc = TestUtil.createWindow().document;
		const c = new TestController(doc);
		const [m, v] = [c.blade, c.view];

		const parentElem = doc.createElement('div');
		parentElem.appendChild(v.element);

		assert.isNotNull(v.element.parentNode);
		m.dispose();
		assert.isNull(v.element.parentNode);
	});
});
