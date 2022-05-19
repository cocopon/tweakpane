import {Controller} from '../../common/controller/controller';
import {Formatter} from '../../common/converter/formatter';
import {
	createNumberFormatter,
	numberFromUnknown,
} from '../../common/converter/number';
import {ValueMap} from '../../common/model/value-map';
import {BaseMonitorParams} from '../../common/params';
import {
	ParamsParser,
	ParamsParsers,
	parseParams,
} from '../../common/params-parsers';
import {View} from '../../common/view/view';
import {Constants} from '../../misc/constants';
import {isEmpty} from '../../misc/type-util';
import {MultiLogController} from '../common/controller/multi-log';
import {SingleLogController} from '../common/controller/single-log';
import {MonitorBindingPlugin} from '../plugin';
import {GraphLogController} from './controller/graph-log';

export interface NumberMonitorParams extends BaseMonitorParams {
	format?: Formatter<number>;
	lineCount?: number;
	max?: number;
	min?: number;
}

function createFormatter(params: NumberMonitorParams): Formatter<number> {
	return 'format' in params && !isEmpty(params.format)
		? params.format
		: createNumberFormatter(2);
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
		lineCount: args.params.lineCount ?? Constants.monitor.defaultLineCount,
		value: args.value,
		viewProps: args.viewProps,
	});
}

function createGraphMonitor(
	args: Parameters<
		MonitorBindingPlugin<number, NumberMonitorParams>['controller']
	>[0],
): Controller<View> {
	return new GraphLogController(args.document, {
		formatter: createFormatter(args.params),
		lineCount: args.params.lineCount ?? Constants.monitor.defaultLineCount,
		props: ValueMap.fromObject({
			maxValue: ('max' in args.params ? args.params.max : null) ?? 100,
			minValue: ('min' in args.params ? args.params.min : null) ?? 0,
		}),
		value: args.value,
		viewProps: args.viewProps,
	});
}

function shouldShowGraph(params: NumberMonitorParams): boolean {
	return 'view' in params && params.view === 'graph';
}

/**
 * @hidden
 */
export const NumberMonitorPlugin: MonitorBindingPlugin<
	number,
	NumberMonitorParams
> = {
	id: 'monitor-number',
	type: 'monitor',
	accept: (value, params) => {
		if (typeof value !== 'number') {
			return null;
		}
		const p = ParamsParsers;
		const result = parseParams<NumberMonitorParams>(params, {
			format: p.optional.function as ParamsParser<Formatter<number>>,
			lineCount: p.optional.number,
			max: p.optional.number,
			min: p.optional.number,
			view: p.optional.string,
		});
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
};
