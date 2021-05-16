import * as assert from 'assert';
import {describe, it} from 'mocha';

import {Controller} from '../../../common/controller/controller';
import {ValueMap} from '../../../common/model/value-map';
import {ViewProps} from '../../../common/model/view-props';
import {View} from '../../../common/view/view';
import {createTestWindow} from '../../../misc/dom-test-util';
import {createBlade} from '../../common/model/blade';
import {LabelPropsObject} from '../view/label';
import {LabelController} from './label';

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

describe(LabelController.name, () => {
	it('should have initial state', () => {
		const doc = createTestWindow().document;
		const c = new LabelController(doc, {
			blade: createBlade(),
			props: ValueMap.fromObject<LabelPropsObject>({
				label: 'hello',
			}),
			valueController: new TestController(doc, {
				viewProps: ViewProps.create(),
			}),
		});
		assert.strictEqual(c.props.get('label'), 'hello');
		assert.strictEqual(c.view.element.innerHTML.includes('hello'), true);
	});

	it('should update properties', () => {
		const doc = createTestWindow().document;
		const c = new LabelController(doc, {
			blade: createBlade(),
			props: ValueMap.fromObject<LabelPropsObject>({
				label: 'hello',
			}),
			valueController: new TestController(doc, {
				viewProps: ViewProps.create(),
			}),
		});

		c.props.set('label', 'world');
		assert.strictEqual(c.view.labelElement.textContent, 'world');
	});
});
