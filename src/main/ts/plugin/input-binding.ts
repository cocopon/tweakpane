import {InputParams} from '../api/types';
import {InputBinding} from '../binding/input';
import {Constraint} from '../constraint/constraint';
import {InputBindingController} from '../controller/input-binding';
import {ValueController} from '../controller/value/value';
import {Target} from '../model/target';
import {Value} from '../model/value';
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

export interface RawInputBindingPlugin<T> extends BasePlugin {
	model: {
		// Accept user input as T, or deny it
		accept: (value: unknown, params: InputParams) => T | null;
		// Create constraint from user input
		constraint?: (args: ValueArgs<T>) => Constraint<T>;
		// Compare T with T
		equals?: (v1: T, v2: T) => boolean;
	};
	controller: (args: ControllerArgs<T, T>) => ValueController<T>;
}

export interface InputBindingPlugin<In, Ex> extends BasePlugin {
	model: {
		// Accept user input as Ex, or deny it
		accept: (value: unknown, params: InputParams) => Ex | null;
		// Create constraint from user input
		constraint?: (args: ValueArgs<Ex>) => Constraint<In>;
		// Compare In with In
		equals?: (v1: In, v2: In) => boolean;

		// Convert Ex into In
		reader: (args: ValueArgs<Ex>) => (value: Ex) => In;
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

export function hasReaderWriter<In, Ex>(
	p: InputBindingPlugin<In, Ex> | RawInputBindingPlugin<In>,
): p is InputBindingPlugin<In, Ex> {
	if ('reader' in p.model && 'writer' in p.model) {
		return true;
	}
	return false;
}

export function fillReaderWriter<T>(
	p: RawInputBindingPlugin<T>,
): InputBindingPlugin<T, T> {
	return {
		id: p.id,
		css: p.css,

		model: {
			...p.model,
			reader: () => (v: T) => v,
			writer: () => (v: T) => v,
		},
		controller: p.controller,
	};
}
