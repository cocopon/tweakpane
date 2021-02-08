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
	initialValue: Ex;
	params: InputParams;

	document: Document;
}

export interface InputBindingPlugin<In, Ex> {
	model: {
		// Accept unknown value as Ex, or deny it
		accept: (value: unknown, params: InputParams) => Ex | null;

		// Convert Ex into In
		reader: (args: ValueArgs<Ex>) => (value: Ex) => In;
		constraint?: (args: ValueArgs<Ex>) => Constraint<In>;

		// Compare In with In
		equals?: (v1: In, v2: In) => boolean;

		// Convert In into Ex
		writer: (args: ValueArgs<Ex>) => (value: In) => Ex;
	};
	controller: (args: ControllerArgs<In, Ex>) => InputController<In>;
}

export function createController<In, Ex>(
	plugin: InputBindingPlugin<In, Ex>,
	args: {
		document: Document;
		params: InputParams;
		target: Target;
	},
): InputBindingController<In, Ex> | null {
	const initialValue = plugin.model.accept(args.target.read(), args.params);
	if (initialValue === null) {
		return null;
	}

	const valueArgs = {
		target: args.target,
		initialValue: initialValue,
		params: args.params,
	};

	const reader = plugin.model.reader(valueArgs);
	const constraint = plugin.model.constraint
		? plugin.model.constraint(valueArgs)
		: undefined;
	const value = new InputValue(
		reader(initialValue),
		constraint,
		plugin.model.equals,
	);
	const binding = new InputBinding({
		reader: reader,
		target: args.target,
		value: value,
		writer: plugin.model.writer(valueArgs),
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
