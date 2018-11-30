// @flow

import * as NumberConverter from '../../converter/number';
import MonitorBinding from '../../binding/monitor';
import NumberFormatter from '../../formatter/number';
import IntervalTicker from '../../misc/ticker/interval';
import FlowUtil from '../../misc/flow-util';
import MonitorValue from '../../model/monitor-value';
import Target from '../../model/target';
import MultiLogMonitorController from '../monitor/multi-log';
import SingleLogMonitorController from '../monitor/single-log';
import GraphMonitorController from '../monitor/graph';
import MonitorBindingController from '../monitor-binding';

type Params = {
	count?: number,
	interval?: number,
	label?: string,
};

type GraphMonitorParams = {
	count?: number,
	interval?: number,
	label?: string,
	max?: number,
	min?: number,
};

function createFormatter(): NumberFormatter {
	// TODO: formatter precision
	return new NumberFormatter(2);
}

export function createTextMonitor(
	document: Document,
	target: Target,
	params: Params,
): MonitorBindingController<number> {
	const value = new MonitorValue(FlowUtil.getOrDefault(params.count, 1));

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
		FlowUtil.getOrDefault(params.interval, 200),
	);

	return new MonitorBindingController(document, {
		binding: new MonitorBinding({
			reader: NumberConverter.fromMixed,
			value: value,
			target: target,
			ticker: ticker,
		}),
		controller: controller,
		label: params.label || target.key,
	});
}

export function createGraphMonitor(
	document: Document,
	target: Target,
	params: GraphMonitorParams,
): MonitorBindingController<number> {
	const value = new MonitorValue(FlowUtil.getOrDefault(params.count, 64));
	const ticker = new IntervalTicker(
		document,
		FlowUtil.getOrDefault(params.interval, 200),
	);
	return new MonitorBindingController<*, *>(document, {
		binding: new MonitorBinding({
			reader: NumberConverter.fromMixed,
			value: value,
			target: target,
			ticker: ticker,
		}),
		controller: new GraphMonitorController(document, {
			formatter: createFormatter(),
			maxValue: FlowUtil.getOrDefault(params.max, 100),
			minValue: FlowUtil.getOrDefault(params.min, 0),
			value: value,
		}),
		label: params.label || target.key,
	});
}
