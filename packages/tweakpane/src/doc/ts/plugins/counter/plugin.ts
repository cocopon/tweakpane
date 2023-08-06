import {
	BaseInputParams,
	BindingTarget,
	createPlugin,
	InputBindingPlugin,
} from '@tweakpane/core';

import {CounterController} from './controller';

type CounterParams = BaseInputParams;

export const CounterInputPlugin: InputBindingPlugin<
	number,
	number,
	CounterParams
> = createPlugin({
	id: 'counter',
	type: 'input',
	accept(value: unknown, params: Record<string, unknown>) {
		if (typeof value !== 'number') {
			return null;
		}
		if (params.view !== 'counter') {
			return null;
		}
		return {
			initialValue: value,
			params: params,
		};
	},
	binding: {
		reader: () => (value: unknown) => Number(value),
		writer: () => (target: BindingTarget, value: number) => {
			target.write(value);
		},
	},
	controller(args) {
		return new CounterController(args.document, {
			value: args.value,
			viewProps: args.viewProps,
		});
	},
});
