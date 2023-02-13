import {formatString, stringFromUnknown} from '../../common/converter/string';
import {BaseMonitorParams} from '../../common/params';
import {ParamsParsers, parseParams} from '../../common/params-parsers';
import {Constants} from '../../misc/constants';
import {MultiLogController} from '../common/controller/multi-log';
import {SingleLogController} from '../common/controller/single-log';
import {MonitorBindingPlugin} from '../plugin';

export interface StringMonitorParams extends BaseMonitorParams {
	multiline?: boolean;
	/**
	 * Number of rows for visual height.
	 */
	rows?: number;
}

/**
 * @hidden
 */
export const StringMonitorPlugin: MonitorBindingPlugin<
	string,
	StringMonitorParams
> = {
	id: 'monitor-string',
	type: 'monitor',
	accept: (value, params) => {
		if (typeof value !== 'string') {
			return null;
		}
		const p = ParamsParsers;
		const result = parseParams<StringMonitorParams>(params, {
			multiline: p.optional.boolean,
			rows: p.optional.number,
		});
		return result
			? {
					initialValue: value,
					params: result,
			  }
			: null;
	},
	binding: {
		reader: (_args) => stringFromUnknown,
	},
	controller: (args) => {
		const value = args.value;
		const multiline = value.rawValue.length > 1 || args.params.multiline;
		if (multiline) {
			return new MultiLogController(args.document, {
				formatter: formatString,
				rows: args.params.rows ?? Constants.monitor.defaultRows,
				value: value,
				viewProps: args.viewProps,
			});
		}

		return new SingleLogController(args.document, {
			formatter: formatString,
			value: value,
			viewProps: args.viewProps,
		});
	},
};
