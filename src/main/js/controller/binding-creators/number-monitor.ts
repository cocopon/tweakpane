import {MonitorParams} from '../../api/types';
import {MonitorBinding} from '../../binding/monitor';
import * as NumberConverter from '../../converter/number';
import {NumberFormatter} from '../../formatter/number';
import {Constants} from '../../misc/constants';
import {TypeUtil} from '../../misc/type-util';
import {MonitorValue} from '../../model/monitor-value';
import {Target} from '../../model/target';
import {ViewModel} from '../../model/view-model';
import {MonitorBindingController} from '../monitor-binding';
import {GraphMonitorController} from '../monitor/graph';
import {MultiLogMonitorController} from '../monitor/multi-log';
import {SingleLogMonitorController} from '../monitor/single-log';
import {createTicker} from './util';

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
					viewModel: new ViewModel(),
			  })
			: new MultiLogMonitorController(document, {
					formatter: createFormatter(),
					lineCount: TypeUtil.getOrDefault(
						params.lineCount,
						Constants.monitor.defaultLineCount,
					),
					value: value,
					viewModel: new ViewModel(),
			  });

	return new MonitorBindingController(document, {
		binding: new MonitorBinding({
			reader: NumberConverter.fromMixed,
			target: target,
			ticker: createTicker(document, params.interval),
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
	const controller = new GraphMonitorController(document, {
		formatter: createFormatter(),
		lineCount: TypeUtil.getOrDefault(
			params.lineCount,
			Constants.monitor.defaultLineCount,
		),
		maxValue: TypeUtil.getOrDefault<number>(
			'max' in params ? params.max : null,
			100,
		),
		minValue: TypeUtil.getOrDefault<number>(
			'min' in params ? params.min : null,
			0,
		),
		value: value,
		viewModel: new ViewModel(),
	});
	return new MonitorBindingController(document, {
		binding: new MonitorBinding({
			reader: NumberConverter.fromMixed,
			target: target,
			ticker: createTicker(document, params.interval),
			value: value,
		}),
		controller: controller,
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

	if ('view' in params && params.view === 'graph') {
		return createGraphMonitor(document, target, params);
	}

	return createTextMonitor(document, target, params);
}
