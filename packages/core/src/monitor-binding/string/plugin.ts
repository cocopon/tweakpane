import {StringMonitorParams} from '../../blade/common/api/params.js';
import {
	formatString,
	stringFromUnknown,
} from '../../common/converter/string.js';
import {parseRecord} from '../../common/micro-parsers.js';
import {Constants} from '../../misc/constants.js';
import {createPlugin} from '../../plugin/plugin.js';
import {MultiLogController} from '../common/controller/multi-log.js';
import {SingleLogController} from '../common/controller/single-log.js';
import {MonitorBindingPlugin} from '../plugin.js';

/**
 * @hidden
 */
export const StringMonitorPlugin: MonitorBindingPlugin<
	string,
	StringMonitorParams
> = createPlugin({
	id: 'monitor-string',
	type: 'monitor',
	accept: (value, params) => {
		if (typeof value !== 'string') {
			return null;
		}
		const result = parseRecord<StringMonitorParams>(params, (p) => ({
			multiline: p.optional.boolean,
			readonly: p.required.constant(true),
			rows: p.optional.number,
		}));
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
});
