import {
	BaseInputParams,
	InputBindingPlugin,
	parseRecord,
	stringFromUnknown,
	Value,
	ValueController,
	VERSION,
	ViewProps,
	writePrimitive,
} from '@tweakpane/core';

import {TestView} from './test-view';

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

export const TestInputPlugin: InputBindingPlugin<
	string,
	string,
	BaseInputParams
> = {
	id: 'input-test',
	type: 'input',
	core: VERSION,
	accept(value, params) {
		if (typeof value !== 'string') {
			return null;
		}
		const result = parseRecord(params, (p) => ({
			view: p.required.constant('test'),
		}));
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
