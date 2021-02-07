import {InputParams} from '../api/types';
import {InputBinding} from '../binding/input';
import {Constraint} from '../constraint/constraint';
import {InputBindingController} from '../controller/input-binding';
import {InputController} from '../controller/input/input';
import {InputValue} from '../model/input-value';
import {Target} from '../model/target';

interface ValueArgs<Ex> {
	initialValue: Ex;
	params: InputParams;
	target: Target;
}

interface ControllerArgs<In, Ex> {
	binding: InputBinding<In, Ex>;
	document: Document;
	initialValue: Ex;
	params: InputParams;
}

export interface InputBindingPlugin<In, Ex> {
	accept: (value: unknown, params: InputParams) => Ex | null;
	reader: (args: ValueArgs<Ex>) => (value: Ex) => In;
	writer: (args: ValueArgs<Ex>) => (value: In) => Ex;
	controller: (args: ControllerArgs<In, Ex>) => InputController<In>;

	constraint?: (args: ValueArgs<Ex>) => Constraint<In>;
	equals?: (v1: In, v2: In) => boolean;
}

export function createController<In, Ex>(
	plugin: InputBindingPlugin<In, Ex>,
	args: {
		document: Document;
		params: InputParams;
		target: Target;
	},
): InputBindingController<In, Ex> | null {
	const initialValue = plugin.accept(args.target.read(), args.params);
	if (initialValue === null) {
		return null;
	}

	const valueArgs = {
		target: args.target,
		initialValue: initialValue,
		params: args.params,
	};

	const reader = plugin.reader(valueArgs);
	const constraint = plugin.constraint
		? plugin.constraint(valueArgs)
		: undefined;
	const value = new InputValue(reader(initialValue), constraint, plugin.equals);
	const binding = new InputBinding({
		reader: reader,
		target: args.target,
		value: value,
		writer: plugin.writer(valueArgs),
	});

	return new InputBindingController(args.document, {
		binding: binding,
		controller: plugin.controller({
			binding: binding,
			document: args.document,
			initialValue: initialValue,
			params: args.params,
		}),
		label: args.params.label || args.target.key,
	});
}
