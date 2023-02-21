import * as assert from 'assert';
import {describe, it} from 'mocha';

import {Controller} from '../../../common/controller/controller';
import {ValueMap} from '../../../common/model/value-map';
import {ViewProps} from '../../../common/model/view-props';
import {View} from '../../../common/view/view';
import {createTestWindow} from '../../../misc/dom-test-util';
import {createBlade} from '../../common/model/blade';
import {LabelPropsObject} from '../view/label';
import {LabelBladeController} from './label';

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

function createController(doc: Document, label: string) {
	return new LabelBladeController(doc, {
		blade: createBlade(),
		props: ValueMap.fromObject<LabelPropsObject>({
			label: label,
		}),
		valueController: new TestController(doc, {
			viewProps: ViewProps.create(),
		}),
	});
}

describe(LabelBladeController.name, () => {
	it('should have initial state', () => {
		const doc = createTestWindow().document;
		const c = createController(doc, 'hello');

		assert.strictEqual(c.props.get('label'), 'hello');
		assert.strictEqual(c.view.element.innerHTML.includes('hello'), true);
	});

	it('should update properties', () => {
		const doc = createTestWindow().document;
		const c = createController(doc, 'hello');

		c.props.set('label', 'world');
		assert.strictEqual(c.view.labelElement.textContent, 'world');
	});

	it('should export state', () => {
		const doc = createTestWindow().document;
		const c = createController(doc, 'foo');

		const state = c.exportState();
		assert.ok('disabled' in state);
		assert.ok('hidden' in state);
		assert.strictEqual(state.label, 'foo');
	});

	it('should import state', () => {
		const doc = createTestWindow().document;
		const c = createController(doc, 'foo');

		assert.strictEqual(
			c.importState({
				disabled: true,
				hidden: true,
				label: 'bar',
			}),
			true,
		);
		assert.strictEqual(c.props.get('label'), 'bar');
	});
});
