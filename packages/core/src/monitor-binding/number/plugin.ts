import {MonitorBindingController} from '../../blade/binding/controller/monitor-binding.js';
import {NumberMonitorParams} from '../../blade/common/api/params.js';
import {Formatter} from '../../common/converter/formatter.js';
import {
	createNumberFormatter,
	numberFromUnknown,
} from '../../common/converter/number.js';
import {MicroParser, parseRecord} from '../../common/micro-parsers.js';
import {ValueMap} from '../../common/model/value-map.js';
import {Constants} from '../../misc/constants.js';
import {isEmpty} from '../../misc/type-util.js';
import {createPlugin} from '../../plugin/plugin.js';
import {MultiLogController} from '../common/controller/multi-log.js';
import {SingleLogController} from '../common/controller/single-log.js';
import {MonitorBindingPlugin} from '../plugin.js';
import {GraphLogMonitorBindingApi} from './api/graph-log.js';
import {GraphLogController} from './controller/graph-log.js';

function createFormatter(params: NumberMonitorParams): Formatter<number> {
	return !isEmpty(params.format) ? params.format : createNumberFormatter(2);
}

function createTextMonitor(
	args: Parameters<
		MonitorBindingPlugin<number, NumberMonitorParams>['controller']
	>[0],
) {
	if (args.value.rawValue.length === 1) {
		return new SingleLogController(args.document, {
			formatter: createFormatter(args.params),
			value: args.value,
			viewProps: args.viewProps,
		});
	}

	return new MultiLogController(args.document, {
		formatter: createFormatter(args.params),
		rows: args.params.rows ?? Constants.monitor.defaultRows,
		value: args.value,
		viewProps: args.viewProps,
	});
}

function createGraphMonitor(
	args: Parameters<
		MonitorBindingPlugin<number, NumberMonitorParams>['controller']
	>[0],
) {
	return new GraphLogController(args.document, {
		formatter: createFormatter(args.params),
		rows: args.params.rows ?? Constants.monitor.defaultRows,
		props: ValueMap.fromObject({
			max: args.params.max ?? 100,
			min: args.params.min ?? 0,
		}),
		value: args.value,
		viewProps: args.viewProps,
	});
}

function shouldShowGraph(params: NumberMonitorParams): boolean {
	return params.view === 'graph';
}

/**
 * @hidden
 */
export const NumberMonitorPlugin: MonitorBindingPlugin<
	number,
	NumberMonitorParams
> = createPlugin({
	id: 'monitor-number',
	type: 'monitor',
	accept: (value, params) => {
		if (typeof value !== 'number') {
			return null;
		}
		const result = parseRecord<NumberMonitorParams>(params, (p) => ({
			format: p.optional.function as MicroParser<Formatter<number>>,
			max: p.optional.number,
			min: p.optional.number,
			readonly: p.required.constant(true),
			rows: p.optional.number,
			view: p.optional.string,
		}));
		return result
			? {
					initialValue: value,
					params: result,
			  }
			: null;
	},
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
	api: (args) => {
		if (args.controller.valueController instanceof GraphLogController) {
			return new GraphLogMonitorBindingApi(
				args.controller as MonitorBindingController<number, GraphLogController>,
			);
		}
		return null;
	},
});
