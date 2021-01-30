import {MonitorParams} from '../../api/types';
import {MonitorBinding} from '../../binding/monitor';
import * as BooleanConverter from '../../converter/boolean';
import {BooleanFormatter} from '../../formatter/boolean';
import {Constants} from '../../misc/constants';
import {TypeUtil} from '../../misc/type-util';
import {MonitorValue} from '../../model/monitor-value';
import {Target} from '../../model/target';
import {ViewModel} from '../../model/view-model';
import {MonitorBindingController} from '../monitor-binding';
import {MultiLogMonitorController} from '../monitor/multi-log';
import {SingleLogMonitorController} from '../monitor/single-log';
import {createTicker} from './util';

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
					viewModel: new ViewModel(),
					formatter: new BooleanFormatter(),
					value: value,
			  })
			: new MultiLogMonitorController(document, {
					viewModel: new ViewModel(),
					formatter: new BooleanFormatter(),
					lineCount: TypeUtil.getOrDefault(
						params.lineCount,
						Constants.monitor.defaultLineCount,
					),
					value: value,
			  });

	return new MonitorBindingController(document, {
		binding: new MonitorBinding({
			reader: BooleanConverter.fromMixed,
			target: target,
			ticker: createTicker(document, params.interval),
			value: value,
		}),
		controller: controller,
		label: params.label || target.key,
	});
}
