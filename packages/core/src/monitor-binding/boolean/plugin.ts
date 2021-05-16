import {
	BooleanFormatter,
	boolFromUnknown,
} from '../../common/converter/boolean';
import {BaseMonitorParams} from '../../common/params';
import {ParamsParsers, parseParams} from '../../common/params-parsers';
import {Constants} from '../../misc/constants';
import {MultiLogController} from '../common/controller/multi-log';
import {SingleLogController} from '../common/controller/single-log';
import {MonitorBindingPlugin} from '../plugin';

export interface BooleanMonitorParams extends BaseMonitorParams {
	lineCount?: number;
}

/**
 * @hidden
 */
export const BooleanMonitorPlugin: MonitorBindingPlugin<
	boolean,
	BooleanMonitorParams
> = {
	id: 'monitor-bool',
	type: 'monitor',
	accept: (value, params) => {
		if (typeof value !== 'boolean') {
			return null;
		}
		const p = ParamsParsers;
		const result = parseParams<BooleanMonitorParams>(params, {
			lineCount: p.optional.number,
		});
		return result
			? {
					initialValue: value,
					params: result,
			  }
			: null;
	},
	binding: {
		reader: (_args) => boolFromUnknown,
	},
	controller: (args) => {
		if (args.value.rawValue.length === 1) {
			return new SingleLogController(args.document, {
				formatter: BooleanFormatter,
				value: args.value,
				viewProps: args.viewProps,
			});
		}

		return new MultiLogController(args.document, {
			formatter: BooleanFormatter,
			lineCount: args.params.lineCount ?? Constants.monitor.defaultLineCount,
			value: args.value,
			viewProps: args.viewProps,
		});
	},
};
