import {InputParams} from '../blade/common/api/types';
import {InputBindingController} from '../blade/common/controller/input-binding';
import {Blade} from '../blade/common/model/blade';
import {LabeledPropsObject} from '../blade/labeled/view/labeled';
import {BindingReader, BindingWriter} from '../common/binding/binding';
import {InputBinding} from '../common/binding/input';
import {BindingTarget} from '../common/binding/target';
import {Constraint} from '../common/constraint/constraint';
import {ValueController} from '../common/controller/value';
import {BoundValue} from '../common/model/bound-value';
import {Value} from '../common/model/value';
import {ValueMap} from '../common/model/value-map';
import {createViewProps, ViewProps} from '../common/model/view-props';
import {polyfillViewProps} from '../common/util';
import {BasePlugin} from '../plugin';

interface BindingArguments<Ex> {
	initialValue: Ex;
	params: InputParams;
	target: BindingTarget;
}

interface ControllerArguments<In, Ex> {
	constraint: Constraint<In> | undefined;
	document: Document;
	initialValue: Ex;
	params: InputParams;
	value: Value<In>;
	viewProps: ViewProps;
}

/**
 * An input binding plugin interface.
 * @template In The type of the internal value.
 * @template Ex The type of the external value. It will be provided by users.
 */
export interface InputBindingPlugin<In, Ex> extends BasePlugin {
	/**
	 * Decides whether the plugin accepts the provided value and the parameters.
	 */
	accept: {
		/**
		 * @param exValue The value input by users.
		 * @param params The additional parameters specified by users.
		 * @return A typed value if the plugin accepts the input, or null if the plugin sees them off and pass them to the next plugin.
		 */
		(exValue: unknown, params: InputParams): Ex | null;
	};

	/**
	 * Configurations of the binding.
	 */
	binding: {
		/**
		 * Creates a value reader from the user input.
		 */
		reader: {
			/**
			 * @param args The arguments for binding.
			 * @return A value reader.
			 */
			(args: BindingArguments<Ex>): BindingReader<In>;
		};

		/**
		 * Creates a value constraint from the user input.
		 */
		constraint?: {
			/**
			 * @param args The arguments for binding.
			 * @return A value constraint.
			 */
			(args: BindingArguments<Ex>): Constraint<In>;
		};

		/**
		 * Compares the equality of two internal values.
		 * Use `===` for primitive values, or a custom comparator for complex objects.
		 */
		equals?: {
			/**
			 * @param v1 The value.
			 * @param v2 The another value.
			 * @return true if equal, false otherwise.
			 */
			(v1: In, v2: In): boolean;
		};

		/**
		 * Creates a value writer from the user input.
		 */
		writer: {
			/**
			 * @param args The arguments for binding.
			 * @return A value writer.
			 */
			(args: BindingArguments<Ex>): BindingWriter<In>;
		};
	};

	/**
	 * Creates a custom controller for the plugin.
	 */
	controller: {
		/**
		 * @param args The arguments for creating a controller.
		 * @return A custom controller that contains a custom view.
		 */
		(args: ControllerArguments<In, Ex>): ValueController<In>;
	};
}

export function createController<In, Ex>(
	plugin: InputBindingPlugin<In, Ex>,
	args: {
		document: Document;
		params: InputParams;
		target: BindingTarget;
	},
): InputBindingController<In> | null {
	const initialValue = plugin.accept(args.target.read(), args.params);
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
	const value = new BoundValue(reader(initialValue), {
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
		constraint: constraint,
		document: args.document,
		initialValue: initialValue,
		params: args.params,
		value: binding.value,
		viewProps: createViewProps({
			disabled: args.params.disabled,
		}),
	});
	polyfillViewProps(controller, plugin.id);

	const blade = new Blade();
	return new InputBindingController(args.document, {
		binding: binding,
		blade: blade,
		props: new ValueMap({
			label: args.params.label || args.target.key,
		} as LabeledPropsObject),
		valueController: controller,
	});
}
