import {assert} from 'chai';
import {describe, it} from 'mocha';

import {TestUtil} from '../misc/test-util';
import {Blade, BladeEvents} from './blade/common/model/blade';
import {BindingTarget} from './common/binding/target';
import {ValueController} from './common/controller/value';
import {stringFromUnknown} from './common/converter/string';
import {Value} from './common/model/value';
import {writePrimitive} from './common/primitive';
import {View} from './common/view/view';
import {createController, InputBindingPlugin} from './input-binding';

class TestView implements View {
	public readonly element: HTMLElement;

	constructor(doc: Document) {
		this.element = doc.createElement('div');
	}
}

class TestController implements ValueController<string> {
	public readonly view: View;

	constructor(
		doc: Document,
		public readonly value: Value<string>,
		blade: Blade,
		onDispose: (ev: BladeEvents['dispose']) => void,
	) {
		this.view = new TestView(doc);
		blade.emitter.on('dispose', onDispose);
	}
}

describe(createController.name, () => {
	it('should be able to handle disposing from plugin', (done) => {
		const plugin: InputBindingPlugin<string, string> = {
			id: 'test',
			accept: (ex) => (typeof ex === 'string' ? ex : null),
			binding: {
				reader: (_) => stringFromUnknown,
				equals: (v1, v2) => v1 === v2,
				writer: (_) => writePrimitive,
			},
			controller: (args) => {
				return new TestController(
					args.document,
					args.value,
					args.blade,
					(ev: BladeEvents['dispose']) => {
						assert.isTrue(ev.sender.disposed);
						done();
					},
				);
			},
		};

		const c = createController(plugin, {
			document: TestUtil.createWindow().document,
			params: {},
			target: new BindingTarget({foo: 'bar'}, 'foo'),
		});
		c?.blade.dispose();
	});
});
