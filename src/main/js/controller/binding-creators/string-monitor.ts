import {MonitorParams} from '../../api/types';
import {MonitorBinding} from '../../binding/monitor';
import * as StringConverter from '../../converter/string';
import {StringFormatter} from '../../formatter/string';
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
): MonitorBindingController<string> | null {
	const initialValue = target.read();
	if (typeof initialValue !== 'string') {
		return null;
	}

	const value = new MonitorValue<string>(
		TypeUtil.getOrDefault<number>(params.count, 1),
	);

	const multiline =
		value.totalCount > 1 || ('multiline' in params && params.multiline);
	const controller = multiline
		? new MultiLogMonitorController(document, {
				formatter: new StringFormatter(),
				value: value,
				viewModel: new ViewModel(),
		  })
		: new SingleLogMonitorController(document, {
				formatter: new StringFormatter(),
				value: value,
				viewModel: new ViewModel(),
		  });

	return new MonitorBindingController(document, {
		binding: new MonitorBinding({
			reader: StringConverter.fromMixed,
			target: target,
			ticker: createTicker(document, params.interval),
			value: value,
		}),
		controller: controller,
		label: params.label || target.key,
	});
}
