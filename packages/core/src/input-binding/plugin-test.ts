import * as assert from 'assert';
import {describe, it} from 'mocha';

import {BindingTarget} from '../common/binding/target';
import {Controller} from '../common/controller/controller';
import {stringFromUnknown} from '../common/converter/string';
import {Value} from '../common/model/value';
import {ViewProps} from '../common/model/view-props';
import {BaseInputParams} from '../common/params';
import {writePrimitive} from '../common/primitive';
import {View} from '../common/view/view';
import {createTestWindow} from '../misc/dom-test-util';
import {createInputBindingController, InputBindingPlugin} from './plugin';

class TestView implements View {
	public readonly element: HTMLElement;

	constructor(doc: Document) {
		this.element = doc.createElement('div');
	}
}

class TestController implements Controller<TestView> {
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

		assert.strictEqual(bc?.viewProps.get('disabled'), false);
		assert.strictEqual(bc?.viewProps.get('hidden'), false);
	});

	it('should apply initial state', () => {
		const bc = createInputBindingController(TestPlugin, {
			document: createTestWindow().document,
			params: {
				disabled: true,
				hidden: true,
			},
			target: new BindingTarget({foo: 'bar'}, 'foo'),
		});

		assert.strictEqual(bc?.viewProps.get('disabled'), true);
		assert.strictEqual(bc?.viewProps.get('hidden'), true);
	});

	it('should be able to handle disposing from plugin', () => {
		const bc = createInputBindingController(TestPlugin, {
			document: createTestWindow().document,
			params: {},
			target: new BindingTarget({foo: 'bar'}, 'foo'),
		});
		const c = bc?.valueController as TestController;
		assert.strictEqual(c.disposed, false);
		bc?.viewProps.set('disposed', true);
		assert.strictEqual(c.disposed, true);
	});
});
