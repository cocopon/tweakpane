// @flow

import MonitorBinding from '../../binding/monitor';
import * as StringConverter from '../../converter/string';
import StringFormatter from '../../formatter/string';
import FlowUtil from '../../misc/flow-util';
import IntervalTicker from '../../misc/ticker/interval';
import MonitorValue from '../../model/monitor-value';
import Target from '../../model/target';
import MonitorBindingController from '../monitor-binding';
import MultiLogMonitorController from '../monitor/multi-log';
import SingleLogMonitorController from '../monitor/single-log';

interface Params {
	count?: number;
	interval?: number;
	label?: string;
	multiline?: boolean;
}

export function createTextMonitor(
	document: Document,
	target: Target,
	params: Params,
): MonitorBindingController<string> {
	const value = new MonitorValue<string>(
		FlowUtil.getOrDefault<number>(params.count, 1),
	);

	const multiline = value.totalCount > 1 || params.multiline;
	const controller = multiline
		? new MultiLogMonitorController(document, {
				formatter: new StringFormatter(),
				value: value,
		  })
		: new SingleLogMonitorController(document, {
				formatter: new StringFormatter(),
				value: value,
		  });
	const ticker = new IntervalTicker(
		document,
		FlowUtil.getOrDefault<number>(params.interval, 200),
	);

	return new MonitorBindingController(document, {
		binding: new MonitorBinding({
			reader: StringConverter.fromMixed,
			target: target,
			ticker: ticker,
			value: value,
		}),
		controller: controller,
		label: params.label || target.key,
	});
}
