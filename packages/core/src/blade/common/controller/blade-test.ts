import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ViewProps} from '../../../common/model/view-props.js';
import {View} from '../../../common/view/view.js';
import {createTestWindow} from '../../../misc/dom-test-util.js';
import {createBlade} from '../model/blade.js';
import {Rack} from '../model/rack.js';
import {BladeController} from './blade.js';
import {importBladeState} from './blade-state.js';

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

	it('should update parent of view props', () => {
		const doc = createTestWindow().document;
		const c = new TestController(doc);
		assert.strictEqual(c.viewProps.get('parent'), null);

		const rack = new Rack({
			viewProps: ViewProps.create({}),
		});
		c.parent = rack;
		assert.strictEqual(c.viewProps.get('parent'), rack.viewProps);
	});

	it('should export state', () => {
		const doc = createTestWindow().document;
		const c = new TestController(doc);
		const state = c.exportState();

		assert.strictEqual(state.disabled, c.viewProps.get('disabled'));
		assert.strictEqual(state.hidden, c.viewProps.get('hidden'));
	});

	it('should not import state', () => {
		const doc = createTestWindow().document;
		const c = new TestController(doc);

		assert.strictEqual(c.importState({}), false);
	});

	it('should import state', () => {
		const doc = createTestWindow().document;
		const c = new TestController(doc);

		assert.strictEqual(
			c.importState({
				disabled: true,
				hidden: true,
			}),
			true,
		);
		assert.strictEqual(c.viewProps.get('disabled'), true);
		assert.strictEqual(c.viewProps.get('hidden'), true);
	});
});

describe(importBladeState.name, () => {
	it('should not run callback if superImport is failed', () => {
		assert.strictEqual(
			importBladeState(
				{
					foo: 'bar',
				},
				() => false,
				(p) => ({
					foo: p.required.string,
				}),
				() => {
					assert.fail('should not be called');
				},
			),
			false,
		);
	});
});
