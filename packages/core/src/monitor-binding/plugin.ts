import {MonitorBindingApi} from '../blade/binding/api/monitor-binding.js';
import {
	BufferedValueController,
	MonitorBindingController,
} from '../blade/binding/controller/monitor-binding.js';
import {createBlade} from '../blade/common/model/blade.js';
import {BindingReader} from '../common/binding/binding.js';
import {ReadonlyBinding} from '../common/binding/readonly.js';
import {BindingTarget} from '../common/binding/target.js';
import {IntervalTicker} from '../common/binding/ticker/interval.js';
import {ManualTicker} from '../common/binding/ticker/manual.js';
import {Ticker} from '../common/binding/ticker/ticker.js';
import {MonitorBindingValue} from '../common/binding/value/monitor-binding.js';
import {LabelPropsObject} from '../common/label/view/label.js';
import {parseRecord} from '../common/micro-parsers.js';
import {BufferedValue} from '../common/model/buffered-value.js';
import {ValueMap} from '../common/model/value-map.js';
import {ViewProps} from '../common/model/view-props.js';
import {BaseMonitorParams} from '../common/params.js';
import {Constants} from '../misc/constants.js';
import {isEmpty} from '../misc/type-util.js';
import {BasePlugin} from '../plugin/plugin.js';

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
	value: BufferedValue<T>;
	viewProps: ViewProps;
}

interface ApiArguments {
	controller: MonitorBindingController<unknown>;
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
		(args: ControllerArguments<T, P>): BufferedValueController<T>;
	};

	/**
	 * Creates a custom API for the plugin if available.
	 */
	api?: {
		/**
		 * @param args The arguments for creating an API.
		 * @return A custom API for the specified controller, or null if there is no suitable API.
		 */
		(args: ApiArguments): MonitorBindingApi<T> | null;
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
	const result = plugin.accept(args.target.read(), args.params);
	if (isEmpty(result)) {
		return null;
	}

	const bindingArgs: BindingArguments<T, P> = {
		target: args.target,
		initialValue: result.initialValue,
		params: result.params,
	};

	const params = parseRecord(args.params, (p) => ({
		bufferSize: p.optional.number,
		disabled: p.optional.boolean,
		hidden: p.optional.boolean,
		interval: p.optional.number,
		label: p.optional.string,
	}));

	// Binding and value
	const reader = plugin.binding.reader(bindingArgs);
	const bufferSize =
		params?.bufferSize ??
		(plugin.binding.defaultBufferSize &&
			plugin.binding.defaultBufferSize(result.params)) ??
		1;
	const value = new MonitorBindingValue({
		binding: new ReadonlyBinding({
			reader: reader,
			target: args.target,
		}),
		bufferSize: bufferSize,
		ticker: createTicker(args.document, params?.interval),
	});

	// Value controller
	const controller = plugin.controller({
		document: args.document,
		params: result.params,
		value: value,
		viewProps: ViewProps.create({
			disabled: params?.disabled,
			hidden: params?.hidden,
		}),
	});
	controller.viewProps.bindDisabled(value.ticker);
	controller.viewProps.handleDispose(() => {
		value.ticker.dispose();
	});

	// Monitor binding controller
	return new MonitorBindingController(args.document, {
		blade: createBlade(),
		props: ValueMap.fromObject<LabelPropsObject>({
			label: 'label' in args.params ? params?.label ?? null : args.target.key,
		}),
		value: value,
		valueController: controller,
	});
}
