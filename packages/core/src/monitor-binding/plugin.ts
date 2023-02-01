import {createBlade} from '../blade/common/model/blade';
import {LabeledValueController} from '../blade/label/controller/value-label';
import {LabelPropsObject} from '../blade/label/view/label';
import {MonitorBindingController} from '../blade/monitor-binding/controller/monitor-binding';
import {BindingReader} from '../common/binding/binding';
import {ReadonlyBinding} from '../common/binding/readonly';
import {BindingTarget} from '../common/binding/target';
import {IntervalTicker} from '../common/binding/ticker/interval';
import {ManualTicker} from '../common/binding/ticker/manual';
import {Ticker} from '../common/binding/ticker/ticker';
import {MonitorBindingValue} from '../common/binding/value/monitor';
import {ValueController} from '../common/controller/value';
import {Buffer, BufferedValue} from '../common/model/buffered-value';
import {ValueMap} from '../common/model/value-map';
import {ViewProps} from '../common/model/view-props';
import {BaseMonitorParams} from '../common/params';
import {ParamsParsers} from '../common/params-parsers';
import {View} from '../common/view/view';
import {Constants} from '../misc/constants';
import {isEmpty} from '../misc/type-util';
import {BasePlugin} from '../plugin/plugin';

interface Acceptance<T, P extends BaseMonitorParams> {
	initialValue: T;
	params: P;
}

export interface BindingArguments<T, P extends BaseMonitorParams> {
	initialValue: T;
	params: P;
	target: BindingTarget;
}

interface ControllerArguments<T, P extends BaseMonitorParams> {
	document: Document;
	params: P;
	value: MonitorBindingValue<T>;
	viewProps: ViewProps;
}

/**
 * A monitor binding plugin interface.
 * @template T The type of the value.
 * @template P The type of the parameters.
 */
export interface MonitorBindingPlugin<T, P extends BaseMonitorParams>
	extends BasePlugin {
	type: 'monitor';

	accept: {
		/**
		 * @param exValue The value input by users.
		 * @param params The additional parameters specified by users.
		 * @return A typed value if the plugin accepts the input, or null if the plugin sees them off and pass them to the next plugin.
		 */
		(exValue: unknown, params: Record<string, unknown>): Acceptance<
			T,
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
			(args: BindingArguments<T, P>): BindingReader<T>;
		};

		/**
		 * Determinates the default buffer size of the plugin.
		 */
		defaultBufferSize?: {
			/**
			 * @param params The additional parameters specified by users.
			 * @return The default buffer size
			 */
			(params: P): number;
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
		(args: ControllerArguments<T, P>): ValueController<
			Buffer<T>,
			View,
			BufferedValue<T>
		>;
	};
}

function createTicker(
	document: Document,
	interval: number | undefined,
): Ticker {
	return interval === 0
		? new ManualTicker()
		: new IntervalTicker(
				document,
				interval ?? Constants.monitor.defaultInterval,
		  );
}

export function createMonitorBindingController<T, P extends BaseMonitorParams>(
	plugin: MonitorBindingPlugin<T, P>,
	args: {
		document: Document;
		params: Record<string, unknown>;
		target: BindingTarget;
	},
): MonitorBindingController<T> | null {
	const P = ParamsParsers;
	const result = plugin.accept(args.target.read(), args.params);
	if (isEmpty(result)) {
		return null;
	}

	const bindingArgs: BindingArguments<T, P> = {
		target: args.target,
		initialValue: result.initialValue,
		params: result.params,
	};

	// Binding and value
	const reader = plugin.binding.reader(bindingArgs);
	const bufferSize =
		P.optional.number(args.params.bufferSize).value ??
		(plugin.binding.defaultBufferSize &&
			plugin.binding.defaultBufferSize(result.params)) ??
		1;
	const interval = P.optional.number(args.params.interval).value;
	const value = new MonitorBindingValue({
		binding: new ReadonlyBinding({
			reader: reader,
			target: args.target,
		}),
		bufferSize: bufferSize,
		ticker: createTicker(args.document, interval),
	});

	// Value controller
	const disabled = P.optional.boolean(args.params.disabled).value;
	const hidden = P.optional.boolean(args.params.hidden).value;
	const controller = plugin.controller({
		document: args.document,
		params: result.params,
		value: value,
		viewProps: ViewProps.create({
			disabled: disabled,
			hidden: hidden,
		}),
	});
	controller.viewProps.bindDisabled(value.ticker);
	controller.viewProps.handleDispose(() => {
		value.ticker.dispose();
	});

	// Monitor binding controller
	const label = P.optional.string(args.params.label).value ?? args.target.key;
	return new LabeledValueController(args.document, {
		blade: createBlade(),
		props: ValueMap.fromObject<LabelPropsObject>({
			label: label,
		}),
		value: value,
		valueController: controller,
	});
}
