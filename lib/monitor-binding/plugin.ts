import {MonitorParams} from '../blade/common/api/types';
import {MonitorBindingController} from '../blade/common/controller/monitor-binding';
import {Blade} from '../blade/common/model/blade';
import {LabeledPropsObject} from '../blade/labeled/view/labeled';
import {BindingReader} from '../common/binding/binding';
import {MonitorBinding} from '../common/binding/monitor';
import {BindingTarget} from '../common/binding/target';
import {IntervalTicker} from '../common/binding/ticker/interval';
import {ManualTicker} from '../common/binding/ticker/manual';
import {Ticker} from '../common/binding/ticker/ticker';
import {ValueController} from '../common/controller/value';
import {Buffer} from '../common/model/buffered-value';
import {BufferedValue, initializeBuffer} from '../common/model/buffered-value';
import {ValueMap} from '../common/model/value-map';
import {createViewProps, ViewProps} from '../common/model/view-props';
import {polyfillViewProps} from '../common/util';
import {Constants} from '../misc/constants';
import {BasePlugin} from '../plugin';

interface BindingArguments<T> {
	initialValue: T;
	params: MonitorParams;
	target: BindingTarget;
}

interface ControllerArguments<T> {
	document: Document;
	params: MonitorParams;
	value: BufferedValue<T>;
	viewProps: ViewProps;
}

/**
 * A monitor binding plugin interface.
 * @template T The type of the value.
 */
export interface MonitorBindingPlugin<T> extends BasePlugin {
	accept: {
		/**
		 * @param exValue The value input by users.
		 * @param params The additional parameters specified by users.
		 * @return A typed value if the plugin accepts the input, or null if the plugin sees them off and pass them to the next plugin.
		 */
		(exValue: unknown, params: MonitorParams): T | null;
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
			(args: BindingArguments<T>): BindingReader<T>;
		};

		/**
		 * Determinates the default buffer size of the plugin.
		 */
		defaultBufferSize?: {
			/**
			 * @param params The additional parameters specified by users.
			 * @return The default buffer size
			 */
			(params: MonitorParams): number;
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
		(args: ControllerArguments<T>): ValueController<Buffer<T>>;
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

export function createController<T>(
	plugin: MonitorBindingPlugin<T>,
	args: {
		document: Document;
		params: MonitorParams;
		target: BindingTarget;
	},
): MonitorBindingController<T> | null {
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
	const bufferSize =
		args.params.bufferSize ??
		(plugin.binding.defaultBufferSize &&
			plugin.binding.defaultBufferSize(args.params)) ??
		1;
	const binding = new MonitorBinding({
		reader: reader,
		target: args.target,
		ticker: createTicker(args.document, args.params.interval),
		value: initializeBuffer<T>(bufferSize),
	});

	const controller = plugin.controller({
		document: args.document,
		params: args.params,
		value: binding.value,
		viewProps: createViewProps({
			disabled: args.params.disabled,
		}),
	});
	polyfillViewProps(controller, plugin.id);

	const blade = new Blade();
	return new MonitorBindingController(args.document, {
		binding: binding,
		blade: blade,
		props: new ValueMap({
			label: args.params.label || args.target.key,
		} as LabeledPropsObject),
		valueController: controller,
	});
}
