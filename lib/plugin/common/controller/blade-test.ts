import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../../../misc/test-util';
import {ViewModel} from '../model/view-model';
import {View} from '../view/view';
import {setUpBladeView} from './blade';

class TestView implements View {
	public readonly element: HTMLElement;

	constructor(doc: Document) {
		this.element = doc.createElement('div');
	}

	onDispose() {}
}

function create(doc: Document): [ViewModel, View] {
	const m = new ViewModel();
	const v = new TestView(doc);
	setUpBladeView(v, m);
	return [m, v];
}

describe('BladeController', () => {
	it('should apply hidden', () => {
		const doc = TestUtil.createWindow().document;
		const [m, v] = create(doc);
		assert.isNotTrue(v.element.classList.contains('tp-v-hidden'));
		m.hidden = true;
		assert.isTrue(v.element.classList.contains('tp-v-hidden'));
		m.hidden = false;
		assert.isNotTrue(v.element.classList.contains('tp-v-hidden'));
	});

	it('should apply view position', () => {
		const doc = TestUtil.createWindow().document;
		const [m, v] = create(doc);
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
		const [m, v] = create(doc);

		const parentElem = doc.createElement('div');
		parentElem.appendChild(v.element);

		assert.isNotNull(v.element.parentNode);
		m.dispose();
		assert.isNull(v.element.parentNode);
	});
});
