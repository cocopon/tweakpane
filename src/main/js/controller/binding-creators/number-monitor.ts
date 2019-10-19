import {MonitorParams} from '../../api/types';
import MonitorBinding from '../../binding/monitor';
import * as NumberConverter from '../../converter/number';
import NumberFormatter from '../../formatter/number';
import Constants from '../../misc/constants';
import IntervalTicker from '../../misc/ticker/interval';
import TypeUtil from '../../misc/type-util';
import MonitorValue from '../../model/monitor-value';
import Target from '../../model/target';
import MonitorBindingController from '../monitor-binding';
import GraphMonitorController from '../monitor/graph';
import MultiLogMonitorController from '../monitor/multi-log';
import SingleLogMonitorController from '../monitor/single-log';

function createFormatter(): NumberFormatter {
	// TODO: formatter precision
	return new NumberFormatter(2);
}

function createTextMonitor(
	document: Document,
	target: Target,
	params: MonitorParams,
): MonitorBindingController<number> {
	const value = new MonitorValue<number>(
		TypeUtil.getOrDefault<number>(params.count, 1),
	);

	const controller =
		value.totalCount === 1
			? new SingleLogMonitorController(document, {
					formatter: createFormatter(),
					value: value,
			  })
			: new MultiLogMonitorController(document, {
					formatter: createFormatter(),
					value: value,
			  });
	const ticker = new IntervalTicker(
		document,
		TypeUtil.getOrDefault<number>(
			params.interval,
			Constants.monitorDefaultInterval,
		),
	);

	return new MonitorBindingController(document, {
		binding: new MonitorBinding({
			reader: NumberConverter.fromMixed,
			target: target,
			ticker: ticker,
			value: value,
		}),
		controller: controller,
		label: params.label || target.key,
	});
}

function createGraphMonitor(
	document: Document,
	target: Target,
	params: MonitorParams,
): MonitorBindingController<number> {
	const value = new MonitorValue<number>(
		TypeUtil.getOrDefault<number>(params.count, 64),
	);
	const ticker = new IntervalTicker(
		document,
		TypeUtil.getOrDefault<number>(
			params.interval,
			Constants.monitorDefaultInterval,
		),
	);
	return new MonitorBindingController(document, {
		binding: new MonitorBinding({
			reader: NumberConverter.fromMixed,
			target: target,
			ticker: ticker,
			value: value,
		}),
		controller: new GraphMonitorController(document, {
			formatter: createFormatter(),
			maxValue: TypeUtil.getOrDefault<number>(params.max, 100),
			minValue: TypeUtil.getOrDefault<number>(params.min, 0),
			value: value,
		}),
		label: params.label || target.key,
	});
}

export function create(
	document: Document,
	target: Target,
	params: MonitorParams,
): MonitorBindingController<number> | null {
	const initialValue = target.read();
	if (typeof initialValue !== 'number') {
		return null;
	}

	if (params.type === 'graph') {
		return createGraphMonitor(document, target, params);
	}

	return createTextMonitor(document, target, params);
}
