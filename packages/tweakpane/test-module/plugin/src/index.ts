import {
	BaseInputParams,
	ClassName,
	InputBindingPlugin,
	ParamsParsers,
	parseParams,
	stringFromUnknown,
	Value,
	ValueController,
	View,
	ViewProps,
	writePrimitive,
} from '@tweakpane/core';

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

class TestController implements ValueController<string, TestView> {
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

const TestInputPlugin: InputBindingPlugin<string, string, BaseInputParams> = {
	id: 'input-test',
	type: 'input',
	accept(value, params) {
		if (typeof value !== 'string') {
			return null;
		}
		const p = ParamsParsers;
		const result = parseParams(params, {
			view: p.required.constant('test'),
		});
		return result
			? {
					initialValue: value,
					params: result,
			  }
			: null;
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
};

export const plugin = TestInputPlugin;
