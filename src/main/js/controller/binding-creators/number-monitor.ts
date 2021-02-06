import {MonitorParams} from '../../api/types';
import {MonitorBinding} from '../../binding/monitor';
import * as NumberConverter from '../../converter/number';
import {NumberFormatter} from '../../formatter/number';
import {Constants} from '../../misc/constants';
import {TypeUtil} from '../../misc/type-util';
import {ViewModel} from '../../model/view-model';
import {MonitorBindingPlugin} from '../../plugin/monitor-binding';
import {GraphMonitorController} from '../monitor/graph';
import {MonitorController} from '../monitor/monitor';
import {MultiLogMonitorController} from '../monitor/multi-log';
import {SingleLogMonitorController} from '../monitor/single-log';

function createFormatter(): NumberFormatter {
	// TODO: formatter precision
	return new NumberFormatter(2);
}

function createTextMonitor(
	document: Document,
	binding: MonitorBinding<number>,
	params: MonitorParams,
): MonitorController<number> {
	if (binding.value.totalCount === 1) {
		return new SingleLogMonitorController(document, {
			formatter: createFormatter(),
			value: binding.value,
			viewModel: new ViewModel(),
		});
	}

	return new MultiLogMonitorController(document, {
		formatter: createFormatter(),
		lineCount: TypeUtil.getOrDefault(
			params.lineCount,
			Constants.monitor.defaultLineCount,
		),
		value: binding.value,
		viewModel: new ViewModel(),
	});
}

function createGraphMonitor(
	document: Document,
	binding: MonitorBinding<number>,
	params: MonitorParams,
): MonitorController<number> {
	return new GraphMonitorController(document, {
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
		value: binding.value,
		viewModel: new ViewModel(),
	});
}

function shouldShowGraph(params: MonitorParams): boolean {
	return 'view' in params && params.view === 'graph';
}

/**
 * @hidden
 */
export const NumberMonitorPlugin: MonitorBindingPlugin<number, number> = {
	accept: (value, _params) => (typeof value === 'number' ? value : null),
	defaultTotalCount: (params) => (shouldShowGraph(params) ? 64 : 1),
	reader: (_args) => NumberConverter.fromMixed,
	controller: (args) => {
		if (shouldShowGraph(args.params)) {
			return createGraphMonitor(args.document, args.binding, args.params);
		}
		return createTextMonitor(args.document, args.binding, args.params);
	},
};
