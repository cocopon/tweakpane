import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ViewProps} from '../../../common/model/view-props';
import {PlainView} from '../../../common/view/plain';
import {createTestWindow} from '../../../misc/dom-test-util';
import {createBlade} from '../model/blade';
import {BladeController, BladeControllerState} from './blade';
import {ContainerBladeController} from './container-blade';
import {RackController} from './rack';

function createController(doc: Document): ContainerBladeController {
	const b = createBlade();
	const viewProps = ViewProps.create();
	const v = new PlainView(doc, {
		viewName: '',
		viewProps: viewProps,
	});
	return new ContainerBladeController({
		blade: b,
		rackController: new RackController({
			blade: b,
			element: v.element,
			viewProps: viewProps,
		}),
		view: v,
	});
}

class TestBladeController extends BladeController {
	public key = '';

	constructor(doc: Document, key: string) {
		const viewProps = ViewProps.create();
		const view = new PlainView(doc, {
			viewName: '',
			viewProps: viewProps,
		});
		super({
			blade: createBlade(),
			view: view,
			viewProps: viewProps,
		});

		this.key = key;
	}

	public import(state: BladeControllerState): void {
		this.key = String(state.key);
	}

	public export(): BladeControllerState {
		return {
			key: this.key,
		};
	}
}

describe(ContainerBladeController.name, () => {
	it('should export state', () => {
		const doc = createTestWindow().document;
		const c = createController(doc);
		c.rackController.rack.add(new TestBladeController(doc, 'foo'));
		c.rackController.rack.add(new TestBladeController(doc, 'bar'));

		const state = c.export();
		assert.ok('disabled' in state);
		assert.ok('hidden' in state);

		const children = state.children as BladeControllerState[];
		assert.strictEqual(children[0].key, 'foo');
		assert.strictEqual(children[1].key, 'bar');
	});

	it('should import state', () => {
		const doc = createTestWindow().document;
		const c = createController(doc);
		c.rackController.rack.add(new TestBladeController(doc, 'foo'));
		c.rackController.rack.add(new TestBladeController(doc, 'bar'));

		c.import({
			disabled: true,
			hidden: true,
			children: [{key: 'baz'}, {key: 'qux'}],
		});

		assert.strictEqual(c.viewProps.get('disabled'), true);
		assert.strictEqual(c.viewProps.get('hidden'), true);

		const children = c.rackController.rack.children as TestBladeController[];
		assert.strictEqual(children[0].key, 'baz');
		assert.strictEqual(children[1].key, 'qux');
	});
});
