import {formatString, stringFromUnknown} from '../../common/converter/string';
import {BaseMonitorParams} from '../../common/params';
import {ParamsParsers, parseParams} from '../../common/params-parsers';
import {Constants} from '../../misc/constants';
import {MultiLogController} from '../common/controller/multi-log';
import {SingleLogController} from '../common/controller/single-log';
import {MonitorBindingPlugin} from '../plugin';

export interface StringMonitorParams extends BaseMonitorParams {
	lineCount?: number;
	multiline?: boolean;
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
			lineCount: p.optional.number,
			multiline: p.optional.boolean,
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
		const multiline =
			value.rawValue.length > 1 ||
			('multiline' in args.params && args.params.multiline);
		if (multiline) {
			return new MultiLogController(args.document, {
				formatter: formatString,
				lineCount: args.params.lineCount ?? Constants.monitor.defaultLineCount,
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
