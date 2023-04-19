import * as assert from 'assert';
import {describe, it} from 'mocha';

import {InputBindingController} from '../blade/binding/controller/input-binding.js';
import {BindingTarget} from '../common/binding/target.js';
import {ValueController} from '../common/controller/value.js';
import {stringFromUnknown} from '../common/converter/string.js';
import {Value} from '../common/model/value.js';
import {ViewProps} from '../common/model/view-props.js';
import {BaseInputParams} from '../common/params.js';
import {writePrimitive} from '../common/primitive.js';
import {View} from '../common/view/view.js';
import {createTestWindow} from '../misc/dom-test-util.js';
import {createInputBindingController, InputBindingPlugin} from './plugin.js';

class TestView implements View {
	public readonly element: HTMLElement;

	constructor(doc: Document) {
		this.element = doc.createElement('div');
	}
}

class TestController implements ValueController<string, TestView> {
	public readonly value: Value<string>;
	public readonly view: TestView;
	public readonly viewProps: ViewProps;
	public disposed = false;

	constructor(
		doc: Document,
		config: {
			value: Value<string>;
			viewProps: ViewProps;
		},
	) {
		this.value = config.value;
		this.view = new TestView(doc);
		this.viewProps = config.viewProps;
		this.viewProps.handleDispose(() => {
			this.disposed = true;
		});
	}
}

const TestPlugin: InputBindingPlugin<string, string, BaseInputParams> = {
	id: 'test',
	type: 'input',
	accept: (ex) =>
		typeof ex === 'string' ? {initialValue: ex, params: {}} : null,
	binding: {
		reader: (_) => stringFromUnknown,
		equals: (v1, v2) => v1 === v2,
		writer: (_) => writePrimitive,
	},
	controller: (args) => {
		return new TestController(args.document, {
			value: args.value,
			viewProps: args.viewProps,
		});
	},
};

describe(createInputBindingController.name, () => {
	it('should have default state', () => {
		const bc = createInputBindingController(TestPlugin, {
			document: createTestWindow().document,
			params: {},
			target: new BindingTarget({foo: 'bar'}, 'foo'),
		});

		assert.strictEqual(bc?.viewProps.get('disabled'), false, 'disabled');
		assert.strictEqual(bc?.viewProps.get('disposed'), false, 'disposed');
		assert.strictEqual(bc?.viewProps.get('hidden'), false, 'hidden');
	});

	it('should apply initial state', () => {
		const bc = createInputBindingController(TestPlugin, {
			document: createTestWindow().document,
			params: {
				disabled: true,
				hidden: true,
			},
			target: new BindingTarget({foo: 'bar'}, 'foo'),
		}) as InputBindingController;

		assert.strictEqual(bc.labelController.props.get('label'), 'foo');
		assert.strictEqual(bc.viewProps.get('disabled'), true);
		assert.strictEqual(bc.viewProps.get('hidden'), true);
	});

	it('should be able to handle disposing from plugin', () => {
		const bc = createInputBindingController(TestPlugin, {
			document: createTestWindow().document,
			params: {},
			target: new BindingTarget({foo: 'bar'}, 'foo'),
		});
		const c = bc?.valueController as TestController;
		bc?.viewProps.set('disposed', true);
		assert.strictEqual(c.disposed, true);
	});

	it('should hide when label is empty', () => {
		const bc = createInputBindingController(TestPlugin, {
			document: createTestWindow().document,
			params: {
				label: null,
			},
			target: new BindingTarget({foo: 'bar'}, 'foo'),
		}) as InputBindingController;

		assert.strictEqual(bc.labelController.props.get('label'), null);
	});
});
