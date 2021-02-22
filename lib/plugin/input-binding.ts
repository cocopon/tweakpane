import {InputParams} from '../api/types';
import {InputBinding} from './common/binding/input';
import {Constraint} from './common/constraint/constraint';
import {InputBindingController} from './common/controller/input-binding';
import {ValueController} from './common/controller/value';
import {Blade} from './common/model/blade';
import {Target} from './common/model/target';
import {Value} from './common/model/value';
import {BasePlugin} from './plugin';

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

export interface InputBindingPlugin<In, Ex> extends BasePlugin {
	model: {
		// Accept user input as Ex, or deny it
		accept: (value: unknown, params: InputParams) => Ex | null;
		// Convert bound value into In
		reader: (args: ValueArgs<Ex>) => (value: unknown) => In;
		// Create constraint from user input
		constraint?: (args: ValueArgs<Ex>) => Constraint<In>;
		// Compare In with In
		equals?: (v1: In, v2: In) => boolean;

		// Convert In into Ex
		writer: (args: ValueArgs<Ex>) => (value: In) => Ex;
	};
	controller: (args: ControllerArgs<In, Ex>) => ValueController<In>;
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
	const value = new Value(reader(initialValue), {
		constraint: constraint,
		equals: plugin.model.equals,
	});
	const binding = new InputBinding({
		reader: reader,
		target: args.target,
		value: value,
		writer: plugin.model.writer(valueArgs),
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
