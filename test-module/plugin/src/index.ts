import {Tweakpane} from 'tweakpane';
import {Controller} from 'tweakpane/lib/common/controller/controller';
// Import individual classes
import {stringFromUnknown} from 'tweakpane/lib/common/converter/string';
import {Value} from 'tweakpane/lib/common/model/value';
import {ViewProps} from 'tweakpane/lib/common/model/view-props';
import {BaseInputParams} from 'tweakpane/lib/common/params';
import {writePrimitive} from 'tweakpane/lib/common/primitive';
import {ClassName} from 'tweakpane/lib/common/view/class-name';
import {View} from 'tweakpane/lib/common/view/view';
import {InputBindingPlugin} from 'tweakpane/lib/input-binding/plugin';

class TestView implements View {
	public readonly element: HTMLElement;

	constructor(
		doc: Document,
		config: {
			value: Value<string>;
		},
	) {
		this.element = doc.createElement('div');
		this.element.classList.add(ClassName('tst')());
		config.value.emitter.on('change', (ev) => {
			this.element.textContent = ev.rawValue;
		});
		this.element.textContent = config.value.rawValue;
	}
}

class TestController implements Controller<TestView> {
	public readonly value: Value<string>;
	public readonly view: TestView;
	public readonly viewProps: ViewProps;

	constructor(
		doc: Document,
		config: {
			value: Value<string>;
			viewProps: ViewProps;
		},
	) {
		this.value = config.value;
		this.viewProps = config.viewProps;

		this.view = new TestView(doc, {
			value: this.value,
		});
	}
}

{
	Tweakpane.registerPlugin({
		type: 'input',
		plugin: {
			id: 'input-test',
			accept(value, params) {
				if (params.view !== 'test') {
					return null;
				}
				return typeof value === 'string' ? value : null;
			},
			binding: {
				reader: () => stringFromUnknown,
				writer: () => writePrimitive,
			},
			controller(args) {
				return new TestController(args.document, {
					value: args.value,
					viewProps: args.viewProps,
				});
			},
		} as InputBindingPlugin<string, string, BaseInputParams>,
	});
}
