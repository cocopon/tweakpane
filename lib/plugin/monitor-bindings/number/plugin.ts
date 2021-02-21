import {MonitorParams} from '../../../api/types';
import {Constants} from '../../../misc/constants';
import {MonitorBinding} from '../../common/binding/monitor';
import {ValueController} from '../../common/controller/value';
import {Buffer} from '../../common/model/buffered-value';
import {numberFromUnknown} from '../../common/reader/number';
import {NumberFormatter} from '../../common/writer/number';
import {MonitorBindingPlugin} from '../../monitor-binding';
import {MultiLogController} from '../common/controller/multi-log';
import {SingleLogMonitorController} from '../common/controller/single-log';
import {GraphLogController} from './controller/graph-log';

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
		});
	}

	return new MultiLogController(document, {
		formatter: createFormatter(),
		lineCount: params.lineCount ?? Constants.monitor.defaultLineCount,
		value: binding.value,
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
		lineCount: params.lineCount ?? Constants.monitor.defaultLineCount,
		maxValue: ('max' in params ? params.max : null) ?? 100,
		minValue: ('min' in params ? params.min : null) ?? 0,
		value: binding.value,
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
	model: {
		accept: (value, _params) => (typeof value === 'number' ? value : null),
		defaultBufferSize: (params) => (shouldShowGraph(params) ? 64 : 1),
		reader: (_args) => numberFromUnknown,
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
