import {MonitorParams} from '../api/types';
import {MonitorBinding} from '../binding/monitor';
import {MonitorBindingController} from '../controller/monitor-binding';
import {MonitorController} from '../controller/monitor/monitor';
import {Constants} from '../misc/constants';
import {IntervalTicker} from '../misc/ticker/interval';
import {ManualTicker} from '../misc/ticker/manual';
import {Ticker} from '../misc/ticker/ticker';
import {TypeUtil} from '../misc/type-util';
import {MonitorValue} from '../model/monitor-value';
import {Target} from '../model/target';

interface ValueArgs<Ex> {
	initialValue: Ex;
	params: MonitorParams;
	target: Target;
}

interface ControllerArgs<In> {
	binding: MonitorBinding<In>;
	document: Document;
	params: MonitorParams;
}

export interface MonitorBindingPlugin<In, Ex> {
	accept: (value: unknown, params: MonitorParams) => Ex | null;
	defaultTotalCount: (params: MonitorParams) => number;
	reader: (args: ValueArgs<Ex>) => (value: Ex) => In;
	controller: (args: ControllerArgs<In>) => MonitorController<In>;
}

interface Args {
	document: Document;
	params: MonitorParams;
	target: Target;
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

export function createController<In, Ex>(
	plugin: MonitorBindingPlugin<In, Ex>,
	args: Args,
): MonitorBindingController<In> | null {
	const initialValue = plugin.accept(args.target.read(), args.params);
	if (initialValue === null) {
		return null;
	}

	const valueArgs = {
		target: args.target,
		initialValue: initialValue,
		params: args.params,
	};

	const reader = plugin.reader(valueArgs);
	const value = new MonitorValue<In>(
		TypeUtil.getOrDefault(
			args.params.count,
			plugin.defaultTotalCount(args.params),
		),
	);
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
