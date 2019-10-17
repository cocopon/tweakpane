import MonitorBinding from '../../binding/monitor';
import * as BooleanConverter from '../../converter/boolean';
import BooleanFormatter from '../../formatter/boolean';
import IntervalTicker from '../../misc/ticker/interval';
import TypeUtil from '../../misc/type-util';
import MonitorValue from '../../model/monitor-value';
import Target from '../../model/target';
import MonitorBindingController from '../monitor-binding';
import MultiLogMonitorController from '../monitor/multi-log';
import SingleLogMonitorController from '../monitor/single-log';
import {MonitorParams} from '../ui';

/**
 * @hidden
 */
export function create(
	document: Document,
	target: Target,
	params: MonitorParams,
): MonitorBindingController<boolean> | null {
	const initialValue = target.read();
	if (typeof initialValue !== 'boolean') {
		return null;
	}

	const value = new MonitorValue<boolean>(
		TypeUtil.getOrDefault<number>(params.count, 1),
	);

	const controller =
		value.totalCount === 1
			? new SingleLogMonitorController(document, {
					formatter: new BooleanFormatter(),
					value: value,
			  })
			: new MultiLogMonitorController(document, {
					formatter: new BooleanFormatter(),
					value: value,
			  });
	const ticker = new IntervalTicker(
		document,
		TypeUtil.getOrDefault<number>(params.interval, 200),
	);

	return new MonitorBindingController(document, {
		binding: new MonitorBinding({
			reader: BooleanConverter.fromMixed,
			target: target,
			ticker: ticker,
			value: value,
		}),
		controller: controller,
		label: params.label || target.key,
	});
}
