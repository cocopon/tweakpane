import {MonitorParams} from '../../api/types';
import {MonitorBinding} from '../../binding/monitor';
import {GraphLogController} from '../../controller/value/graph-log';
import {MultiLogController} from '../../controller/value/multi-log';
import {SingleLogMonitorController} from '../../controller/value/single-log';
import {ValueController} from '../../controller/value/value';
import * as NumberConverter from '../../converter/number';
import {NumberFormatter} from '../../formatter/number';
import {Constants} from '../../misc/constants';
import {TypeUtil} from '../../misc/type-util';
import {Buffer} from '../../model/buffered-value';
import {ViewModel} from '../../model/view-model';
import {MonitorBindingPlugin} from '../monitor-binding';

function createFormatter(): NumberFormatter {
	// TODO: formatter precision
	return new NumberFormatter(2);
}

function createTextMonitor(
	document: Document,
	binding: MonitorBinding<number>,
	params: MonitorParams,
): ValueController<Buffer<number>> {
	if (binding.value.rawValue.length === 1) {
		return new SingleLogMonitorController(document, {
			formatter: createFormatter(),
			value: binding.value,
			viewModel: new ViewModel(),
		});
	}

	return new MultiLogController(document, {
		formatter: createFormatter(),
		lineCount: TypeUtil.getOrDefault(
			params.lineCount,
			Constants.monitor.defaultLineCount,
		),
		value: binding.value,
		viewModel: new ViewModel(),
	});
}

function createGraphMonitor({
	document,
	binding,
	params,
}: {
	document: Document;
	binding: MonitorBinding<number>;
	params: MonitorParams;
}): ValueController<Buffer<number>> {
	return new GraphLogController(document, {
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
	model: {
		accept: (value, _params) => (typeof value === 'number' ? value : null),
		defaultBufferSize: (params) => (shouldShowGraph(params) ? 64 : 1),
		reader: (_args) => NumberConverter.fromMixed,
	},
	controller: (args) => {
		if (shouldShowGraph(args.params)) {
			return createGraphMonitor({
				document: args.document,
				binding: args.binding,
				params: args.params,
			});
		}
		return createTextMonitor(args.document, args.binding, args.params);
	},
};
