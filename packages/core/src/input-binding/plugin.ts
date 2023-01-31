import {createBlade} from '../blade/common/model/blade';
import {InputBindingController} from '../blade/input-binding/controller/input-binding';
import {LabelPropsObject} from '../blade/label/view/label';
import {Binding, BindingReader, BindingWriter} from '../common/binding/binding';
import {BindingTarget} from '../common/binding/target';
import {Constraint} from '../common/constraint/constraint';
import {BindingValue} from '../common/model/binding-value';
import {Value} from '../common/model/value';
import {ValueMap} from '../common/model/value-map';
import {createValue} from '../common/model/values';
import {ViewProps} from '../common/model/view-props';
import {BaseInputParams} from '../common/params';
import {ParamsParsers} from '../common/params-parsers';
import {ValueController} from '../index';
import {isEmpty} from '../misc/type-util';
import {BasePlugin} from '../plugin/plugin';

interface Acceptance<T, P extends BaseInputParams> {
	initialValue: T;
	params: P;
}

interface BindingArguments<Ex, P extends BaseInputParams> {
	initialValue: Ex;
	params: P;
	target: BindingTarget;
}

interface ControllerArguments<In, Ex, P extends BaseInputParams> {
	constraint: Constraint<In> | undefined;
	document: Document;
	initialValue: Ex;
	params: P;
	value: Value<In>;
	viewProps: ViewProps;
}

/**
 * An input binding plugin interface.
 * @template In The type of the internal value.
 * @template Ex The type of the external value. It will be provided by users.
 * @template P The type of the parameters.
 */
export interface InputBindingPlugin<In, Ex, P extends BaseInputParams>
	extends BasePlugin {
	type: 'input';

	/**
	 * Decides whether the plugin accepts the provided value and the parameters.
	 */
	accept: {
		/**
		 * @param exValue The value input by users.
		 * @param params The additional parameters specified by users.
		 * @return A typed value if the plugin accepts the input, or null if the plugin sees them off and pass them to the next plugin.
		 */
		(exValue: unknown, params: Record<string, unknown>): Acceptance<
			Ex,
			P
		> | null;
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
			(args: BindingArguments<Ex, P>): BindingReader<In>;
		};

		/**
		 * Creates a value constraint from the user input.
		 */
		constraint?: {
			/**
			 * @param args The arguments for binding.
			 * @return A value constraint.
			 */
			(args: BindingArguments<Ex, P>): Constraint<In>;
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
			(args: BindingArguments<Ex, P>): BindingWriter<In>;
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
		(args: ControllerArguments<In, Ex, P>): ValueController<In>;
	};
}

export function createInputBindingController<In, Ex, P extends BaseInputParams>(
	plugin: InputBindingPlugin<In, Ex, P>,
	args: {
		document: Document;
		params: Record<string, unknown>;
		target: BindingTarget;
	},
): InputBindingController<In> | null {
	const result = plugin.accept(args.target.read(), args.params);
	if (isEmpty(result)) {
		return null;
	}

	const p = ParamsParsers;

	const valueArgs = {
		target: args.target,
		initialValue: result.initialValue,
		params: result.params,
	};

	// Binding and value
	const reader = plugin.binding.reader(valueArgs);
	const constraint = plugin.binding.constraint
		? plugin.binding.constraint(valueArgs)
		: undefined;
	const binding = new Binding({
		reader: reader,
		target: args.target,
		writer: plugin.binding.writer(valueArgs),
	});
	const value = new BindingValue(
		createValue(reader(result.initialValue), {
			constraint: constraint,
			equals: plugin.binding.equals,
		}),
		binding,
	);

	// Value controller
	const disabled = p.optional.boolean(args.params.disabled).value;
	const hidden = p.optional.boolean(args.params.hidden).value;
	const controller = plugin.controller({
		constraint: constraint,
		document: args.document,
		initialValue: result.initialValue,
		params: result.params,
		value: value,
		viewProps: ViewProps.create({
			disabled: disabled,
			hidden: hidden,
		}),
	});

	// Input binding controller
	const label = p.optional.string(args.params.label).value;
	return new InputBindingController(args.document, {
		blade: createBlade(),
		props: ValueMap.fromObject<LabelPropsObject>({
			label: label ?? args.target.key,
		}),
		value: value,
		valueController: controller,
	});
}
