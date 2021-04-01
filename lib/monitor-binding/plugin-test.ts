import * as assert from 'assert';
import {describe, it} from 'mocha';

import {BindingTarget} from '../common/binding/target';
import {ValueController} from '../common/controller/value';
import {stringFromUnknown} from '../common/converter/string';
import {Buffer, BufferedValue} from '../common/model/buffered-value';
import {createViewProps, ViewProps} from '../common/model/view-props';
import {View} from '../common/view/view';
import {TestUtil} from '../misc/test-util';
import {createController, MonitorBindingPlugin} from './plugin';

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

class TestController implements ValueController<Buffer<string>> {
	public readonly view: TestView;
	public readonly viewProps: ViewProps = createViewProps();
	public disposed = false;

	constructor(doc: Document, public readonly value: BufferedValue<string>) {
		this.view = new TestView(doc);
	}

	onDispose() {
		this.disposed = true;
	}
}

describe(createController.name, () => {
	it('should be able to handle disposing from plugin', () => {
		const plugin: MonitorBindingPlugin<string> = {
			id: 'test',
			accept: (ex) => (typeof ex === 'string' ? ex : null),
			binding: {
				reader: (_) => stringFromUnknown,
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
		const c = bc?.valueController as TestController;
		assert.strictEqual(c.disposed, false);
		assert.strictEqual(c.view.disposed, false);
		bc?.blade.dispose();
		assert.strictEqual(c.disposed, true);
		assert.strictEqual(c.view.disposed, true);
	});
});
