import {MonitorParams} from '../../../api/types';
import {Constants} from '../../../misc/constants';
import {ValueController} from '../../common/controller/value';
import {Formatter} from '../../common/converter/formatter';
import {
	createNumberFormatter,
	numberFromUnknown,
} from '../../common/converter/number';
import {Buffer, BufferedValue} from '../../common/model/buffered-value';
import {MonitorBindingPlugin} from '../../monitor-binding';
import {MultiLogController} from '../common/controller/multi-log';
import {SingleLogMonitorController} from '../common/controller/single-log';
import {GraphLogController} from './controller/graph-log';

function createFormatter(): Formatter<number> {
	// TODO: formatter precision
	return createNumberFormatter(2);
}

function createTextMonitor({
	document,
	params,
	value,
}: {
	document: Document;
	params: MonitorParams;
	value: BufferedValue<number>;
}): ValueController<Buffer<number>> {
	if (value.rawValue.length === 1) {
		return new SingleLogMonitorController(document, {
			formatter: createFormatter(),
			value: value,
		});
	}

	return new MultiLogController(document, {
		formatter: createFormatter(),
		lineCount: params.lineCount ?? Constants.monitor.defaultLineCount,
		value: value,
	});
}

function createGraphMonitor({
	document,
	params,
	value,
}: {
	document: Document;
	params: MonitorParams;
	value: BufferedValue<number>;
}): ValueController<Buffer<number>> {
	return new GraphLogController(document, {
		formatter: createFormatter(),
		lineCount: params.lineCount ?? Constants.monitor.defaultLineCount,
		maxValue: ('max' in params ? params.max : null) ?? 100,
		minValue: ('min' in params ? params.min : null) ?? 0,
		value: value,
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
