import {InputParams} from '../api/types';
import {InputBindingController} from './blade/common/controller/input-binding';
import {Blade} from './blade/common/model/blade';
import {InputBinding} from './common/binding/input';
import {Constraint} from './common/constraint/constraint';
import {ValueController} from './common/controller/value';
import {Target} from './common/model/target';
import {Value} from './common/model/value';
import {BasePlugin} from './plugin';

interface BindingArguments<Ex> {
	initialValue: Ex;
	params: InputParams;
	target: Target;
}

interface ControllerArguments<In, Ex> {
	binding: InputBinding<In, Ex>;
	initialValue: Ex;
	params: InputParams;

	document: Document;
}

export interface InputBindingPlugin<In, Ex> extends BasePlugin {
	binding: {
		// Accept user input as Ex, or deny it
		accept: (value: unknown, params: InputParams) => Ex | null;
		// Convert bound value into In
		reader: (args: BindingArguments<Ex>) => (value: unknown) => In;
		// Create constraint from user input
		constraint?: (args: BindingArguments<Ex>) => Constraint<In>;
		// Compare In with In
		equals?: (v1: In, v2: In) => boolean;

		// Convert In into Ex
		writer: (args: BindingArguments<Ex>) => (value: In) => Ex;
	};
	controller: (args: ControllerArguments<In, Ex>) => ValueController<In>;
}

export function createController<In, Ex>(
	plugin: InputBindingPlugin<In, Ex>,
	args: {
		document: Document;
		params: InputParams;
		target: Target;
	},
): InputBindingController<In, Ex> | null {
	const initialValue = plugin.binding.accept(args.target.read(), args.params);
	if (initialValue === null) {
		return null;
	}

	const valueArgs = {
		target: args.target,
		initialValue: initialValue,
		params: args.params,
	};

	const reader = plugin.binding.reader(valueArgs);
	const constraint = plugin.binding.constraint
		? plugin.binding.constraint(valueArgs)
		: undefined;
	const value = new Value(reader(initialValue), {
		constraint: constraint,
		equals: plugin.binding.equals,
	});
	const binding = new InputBinding({
		reader: reader,
		target: args.target,
		value: value,
		writer: plugin.binding.writer(valueArgs),
	});
	const controller = plugin.controller({
		binding: binding,
		document: args.document,
		initialValue: initialValue,
		params: args.params,
	});

	return new InputBindingController(args.document, {
		binding: binding,
		controller: controller,
		label: args.params.label || args.target.key,
		blade: new Blade(),
	});
}
