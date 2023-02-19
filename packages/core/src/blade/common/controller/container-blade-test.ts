import * as assert from 'assert';
import {describe, it} from 'mocha';

import {ViewProps} from '../../../common/model/view-props';
import {PlainView} from '../../../common/view/plain';
import {createTestWindow} from '../../../misc/dom-test-util';
import {TestKeyBladeController} from '../../test-util';
import {createBlade} from '../model/blade';
import {BladeControllerState} from './blade';
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

describe(ContainerBladeController.name, () => {
	it('should export state', () => {
		const doc = createTestWindow().document;
		const c = createController(doc);
		c.rackController.rack.add(new TestKeyBladeController(doc, 'foo'));
		c.rackController.rack.add(new TestKeyBladeController(doc, 'bar'));

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
		c.rackController.rack.add(new TestKeyBladeController(doc, 'foo'));
		c.rackController.rack.add(new TestKeyBladeController(doc, 'bar'));

		c.import({
			disabled: true,
			hidden: true,
			children: [{key: 'baz'}, {key: 'qux'}],
		});

		assert.strictEqual(c.viewProps.get('disabled'), true);
		assert.strictEqual(c.viewProps.get('hidden'), true);

		const children = c.rackController.rack.children as TestKeyBladeController[];
		assert.strictEqual(children[0].key, 'baz');
		assert.strictEqual(children[1].key, 'qux');
	});
});
