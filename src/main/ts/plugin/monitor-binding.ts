import {MonitorParams} from '../api/types';
import {MonitorBinding} from '../binding/monitor';
import {MonitorBindingController} from '../controller/monitor-binding';
import {MonitorController} from '../controller/monitor/monitor';
import {Constants} from '../misc/constants';
import {IntervalTicker} from '../misc/ticker/interval';
import {ManualTicker} from '../misc/ticker/manual';
import {Ticker} from '../misc/ticker/ticker';
import {TypeUtil} from '../misc/type-util';
import {ValueBuffer} from '../model/monitor-buffer';
import {Target} from '../model/target';
import {Value} from '../model/value';

interface ValueArguments<Ex> {
	initialValue: Ex;
	params: MonitorParams;
	target: Target;
}

interface ControllerArguments<In> {
	binding: MonitorBinding<In>;
	document: Document;
	params: MonitorParams;
}

export interface MonitorBindingPlugin<In, Ex> {
	model: {
		// Accept unknown value as Ex, or deny it
		accept: (value: unknown, params: MonitorParams) => Ex | null;

		// Convert Ex into In
		reader: (args: ValueArguments<Ex>) => (value: Ex) => In;

		// Misc
		defaultBufferSize: (params: MonitorParams) => number;
	};
	controller: (args: ControllerArguments<In>) => MonitorController<In>;
}

function createTicker(
	document: Document,
	interval: number | undefined,
): Ticker {
	return interval === 0
		? new ManualTicker()
		: new IntervalTicker(
				document,
				TypeUtil.getOrDefault<number>(
					interval,
					Constants.monitor.defaultInterval,
				),
		  );
}

export function createController<T, In extends ValueBuffer<T>, Ex>(
	plugin: MonitorBindingPlugin<In, Ex>,
	args: {
		document: Document;
		params: MonitorParams;
		target: Target;
	},
): MonitorBindingController<In> | null {
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
	const bufferSize = TypeUtil.getOrDefault(
		TypeUtil.getOrDefault(args.params.bufferSize, args.params.count),
		plugin.model.defaultBufferSize(args.params),
	);
	const value = new Value({
		bufferSize: bufferSize,
		values: [reader(initialValue)],
	});
	const binding = new MonitorBinding({
		reader: reader,
		target: args.target,
		ticker: createTicker(args.document, args.params.interval),
		value: value,
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
