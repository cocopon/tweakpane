import * as assert from 'assert';
import {describe, it} from 'mocha';

import {createBlade} from '../../../blade/common/model/blade.js';
import {createTestWindow} from '../../../misc/dom-test-util.js';
import {Controller} from '../../controller/controller.js';
import {ValueMap} from '../../model/value-map.js';
import {ViewProps} from '../../model/view-props.js';
import {View} from '../../view/view.js';
import {LabelPropsObject} from '../view/label.js';
import {LabelController} from './label.js';

class TestView implements View {
	public readonly element: HTMLElement;

	constructor(doc: Document) {
		this.element = doc.createElement('div');
	}
}

class TestController implements Controller<TestView> {
	public readonly viewProps: ViewProps;
	public readonly view: TestView;

	constructor(
		doc: Document,
		config: {
			viewProps: ViewProps;
		},
	) {
		this.viewProps = config.viewProps;
		this.view = new TestView(doc);
	}
}

function createController(doc: Document, label: string, description: string) {
	return new LabelController(doc, {
		blade: createBlade(),
		props: ValueMap.fromObject<LabelPropsObject>({
			label: label,
			description: description,
		}),
		valueController: new TestController(doc, {
			viewProps: ViewProps.create(),
		}),
	});
}

describe(LabelController.name, () => {
	it('should have initial state', () => {
		const doc = createTestWindow().document;
		const c = createController(doc, 'hello', 'desc');

		assert.strictEqual(c.props.get('label'), 'hello');
		assert.strictEqual(c.view.element.innerHTML.includes('hello'), true);

		assert.strictEqual(c.props.get('description'), 'desc');
		assert.strictEqual(c.view.element.innerHTML.includes('desc'), true);
	});

	it('should update properties', () => {
		const doc = createTestWindow().document;
		const c = createController(doc, 'hello', 'hello-description');

		c.props.set('label', 'world');
		assert.strictEqual(c.view.labelElement.textContent, 'world');

		c.props.set('description', 'world-description');
		assert.strictEqual(c.view.labelElement.title, 'world-description');
	});

	it('should export state', () => {
		const doc = createTestWindow().document;
		const c = createController(doc, 'foo', 'bar');

		assert.deepStrictEqual(c.exportProps(), {
			label: 'foo',
			description: 'bar',
		});
	});

	it('should import state', () => {
		const doc = createTestWindow().document;
		const c = createController(doc, 'foo', 'foo-description');

		assert.strictEqual(
			c.importProps({
				label: 'bar',
				description: 'bar-description',
			}),
			true,
		);
		assert.strictEqual(c.props.get('label'), 'bar');
		assert.strictEqual(c.props.get('description'), 'bar-description');
	});
});
