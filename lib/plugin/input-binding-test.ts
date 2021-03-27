import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../misc/test-util';
import {BindingTarget} from './common/binding/target';
import {ValueController} from './common/controller/value';
import {stringFromUnknown} from './common/converter/string';
import {Value} from './common/model/value';
import {createViewProps} from './common/model/view-props';
import {writePrimitive} from './common/primitive';
import {View} from './common/view/view';
import {createController, InputBindingPlugin} from './input-binding';

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
	public readonly view: TestView;
	public readonly viewProps = createViewProps();
	public disposed = false;

	constructor(doc: Document, public readonly value: Value<string>) {
		this.view = new TestView(doc);
	}

	onDispose() {
		this.disposed = true;
	}
}

describe(createController.name, () => {
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
				return new TestController(args.document, args.value);
			},
		};

		const bc = createController(plugin, {
			document: TestUtil.createWindow().document,
			params: {},
			target: new BindingTarget({foo: 'bar'}, 'foo'),
		});
		const c = bc?.controller as TestController;
		assert.isFalse(c.disposed);
		assert.isFalse(c.view.disposed);
		bc?.blade.dispose();
		assert.isTrue(c.disposed);
		assert.isTrue(c.view.disposed);
	});
});
