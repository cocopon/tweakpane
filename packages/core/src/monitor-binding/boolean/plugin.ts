import {BooleanMonitorParams} from '../../blade/common/api/params.js';
import {
	BooleanFormatter,
	boolFromUnknown,
} from '../../common/converter/boolean.js';
import {parseRecord} from '../../common/micro-parsers.js';
import {Constants} from '../../misc/constants.js';
import {createPlugin} from '../../plugin/plugin.js';
import {MultiLogController} from '../common/controller/multi-log.js';
import {SingleLogController} from '../common/controller/single-log.js';
import {MonitorBindingPlugin} from '../plugin.js';

/**
 * @hidden
 */
export const BooleanMonitorPlugin: MonitorBindingPlugin<
	boolean,
	BooleanMonitorParams
> = createPlugin({
	id: 'monitor-bool',
	type: 'monitor',
	accept: (value, params) => {
		if (typeof value !== 'boolean') {
			return null;
		}
		const result = parseRecord<BooleanMonitorParams>(params, (p) => ({
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
			rows: args.params.rows ?? Constants.monitor.defaultRows,
			value: args.value,
			viewProps: args.viewProps,
		});
	},
});
