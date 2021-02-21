import {MonitorParams} from '../api/types';
import {Constants} from '../misc/constants';
import {MonitorBinding} from './common/binding/monitor';
import {IntervalTicker} from './common/binding/ticker/interval';
import {ManualTicker} from './common/binding/ticker/manual';
import {Ticker} from './common/binding/ticker/ticker';
import {MonitorBindingController} from './common/controller/monitor-binding';
import {ValueController} from './common/controller/value';
import {initializeBuffer} from './common/model/buffered-value';
import {Buffer} from './common/model/buffered-value';
import {Target} from './common/model/target';
import {BasePlugin} from './plugin';

interface ValueArguments<T> {
	initialValue: T;
	params: MonitorParams;
	target: Target;
}

interface ControllerArguments<T> {
	binding: MonitorBinding<T>;
	document: Document;
	params: MonitorParams;
}

export interface MonitorBindingPlugin<T> extends BasePlugin {
	model: {
		// Accept unknown value as T, or deny it
		accept: (value: unknown, params: MonitorParams) => T | null;
		// Convert bound value into T
		reader: (args: ValueArguments<T>) => (value: unknown) => T;
		// Misc
		defaultBufferSize?: (params: MonitorParams) => number;
	};
	controller: (args: ControllerArguments<T>) => ValueController<Buffer<T>>;
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
		target: Target;
	},
): MonitorBindingController<T> | null {
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
	const bufferSize =
		args.params.bufferSize ??
		args.params.count ??
		(plugin.model.defaultBufferSize &&
			plugin.model.defaultBufferSize(args.params)) ??
		1;
	const binding = new MonitorBinding({
		reader: reader,
		target: args.target,
		ticker: createTicker(args.document, args.params.interval),
		value: initializeBuffer(reader(initialValue), bufferSize),
	});

	return new MonitorBindingController(args.document, {
		binding: binding,
		controller: plugin.controller({
			binding: binding,
			document: args.document,
			params: args.params,
		}),
		label: args.params.label || args.target.key,
	});
}