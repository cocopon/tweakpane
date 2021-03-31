import {MonitorParams} from '../../blade/common/api/types';
import {ValueController} from '../../common/controller/value';
import {Formatter} from '../../common/converter/formatter';
import {
	createNumberFormatter,
	numberFromUnknown,
} from '../../common/converter/number';
import {Buffer} from '../../common/model/buffered-value';
import {Constants} from '../../misc/constants';
import {MultiLogController} from '../common/controller/multi-log';
import {SingleLogMonitorController} from '../common/controller/single-log';
import {MonitorBindingPlugin} from '../plugin';
import {GraphLogController} from './controller/graph-log';

function createFormatter(): Formatter<number> {
	// TODO: formatter precision
	return createNumberFormatter(2);
}

function createTextMonitor(
	args: Parameters<MonitorBindingPlugin<number>['controller']>[0],
) {
	if (args.value.rawValue.length === 1) {
		return new SingleLogMonitorController(args.document, {
			formatter: createFormatter(),
			value: args.value,
			viewProps: args.viewProps,
		});
	}

	return new MultiLogController(args.document, {
		formatter: createFormatter(),
		lineCount: args.params.lineCount ?? Constants.monitor.defaultLineCount,
		value: args.value,
		viewProps: args.viewProps,
	});
}

function createGraphMonitor(
	args: Parameters<MonitorBindingPlugin<number>['controller']>[0],
): ValueController<Buffer<number>> {
	return new GraphLogController(args.document, {
		formatter: createFormatter(),
		lineCount: args.params.lineCount ?? Constants.monitor.defaultLineCount,
		maxValue: ('max' in args.params ? args.params.max : null) ?? 100,
		minValue: ('min' in args.params ? args.params.min : null) ?? 0,
		value: args.value,
		viewProps: args.viewProps,
	});
}

function shouldShowGraph(params: MonitorParams): boolean {
	return 'view' in params && params.view === 'graph';
}

/**
 * @hidden
 */
export const NumberMonitorPlugin: MonitorBindingPlugin<number> = {
	id: 'monitor-number',
	accept: (value, _params) => (typeof value === 'number' ? value : null),
	binding: {
		defaultBufferSize: (params) => (shouldShowGraph(params) ? 64 : 1),
		reader: (_args) => numberFromUnknown,
	},
	controller: (args) => {
		if (shouldShowGraph(args.params)) {
			return createGraphMonitor(args);
		}
		return createTextMonitor(args);
	},
};
