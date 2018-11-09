// @flow

import * as StringConverter from '../../converter/string';
import MonitorBinding from '../../binding/monitor';
import StringFormatter from '../../formatter/string';
import IntervalTicker from '../../misc/ticker/interval';
import FlowUtil from '../../misc/flow-util';
import MonitorValue from '../../model/monitor-value';
import Target from '../../model/target';
import MultiLogMonitorController from '../monitor/multi-log';
import SingleLogMonitorController from '../monitor/single-log';
import MonitorBindingController from '../monitor-binding';

type Params = {
	count?: number,
	interval?: number,
	label?: string,
	multiline?: boolean,
};

export function createTextMonitor(document: Document, target: Target, params: Params): MonitorBindingController<string> {
	const value = new MonitorValue(
		FlowUtil.getOrDefault(params.count, 1),
	);

	const multiline = (value.totalCount > 1) || params.multiline;
	const controller = multiline ?
		new MultiLogMonitorController(document, {
			formatter: new StringFormatter(),
			value: value,
		}) :
		new SingleLogMonitorController(document, {
			formatter: new StringFormatter(),
			value: value,
		});
	const ticker = new IntervalTicker(
		document,
		FlowUtil.getOrDefault(params.interval, 200),
	);

	return new MonitorBindingController(document, {
		binding: new MonitorBinding({
			reader: StringConverter.fromMixed,
			value: value,
			target: target,
			ticker: ticker,
		}),
		controller: controller,
		label: params.label || target.key,
	});
}
