import * as assert from 'assert';
import {describe, it} from 'mocha';

import {BindingTarget} from '../common/binding/target';
import {ValueController} from '../common/controller/value';
import {stringFromUnknown} from '../common/converter/string';
import {Value} from '../common/model/value';
import {ViewProps} from '../common/model/view-props';
import {writePrimitive} from '../common/primitive';
import {bindDisposed} from '../common/view/reactive';
import {View} from '../common/view/view';
import {TestUtil} from '../misc/test-util';
import {createInputBindingController, InputBindingPlugin} from './plugin';

class TestView implements View {
	public readonly element: HTMLElement;
	public disposed = false;

	constructor(doc: Document) {
		this.element = doc.createElement('div');
	}

	onDispose() {
		this.disposed = true;
	}
}

class TestController implements ValueController<string> {
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
		bindDisposed(this.viewProps, () => {
			this.disposed = true;
		});
	}
}

describe(createInputBindingController.name, () => {
	it('should be able to handle disposing from plugin', () => {
		const plugin: InputBindingPlugin<string, string> = {
			id: 'test',
			accept: (ex) => (typeof ex === 'string' ? ex : null),
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

		const bc = createInputBindingController(plugin, {
			document: TestUtil.createWindow().document,
			params: {},
			target: new BindingTarget({foo: 'bar'}, 'foo'),
		});
		const c = bc?.valueController as TestController;
		assert.strictEqual(c.disposed, false);
		assert.strictEqual(c.view.disposed, false);
		bc?.viewProps.set('disposed', true);
		assert.strictEqual(c.disposed, true);
		assert.strictEqual(c.view.disposed, true);
	});
});
