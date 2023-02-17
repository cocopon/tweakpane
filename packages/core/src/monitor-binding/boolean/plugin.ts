import {
	BooleanFormatter,
	boolFromUnknown,
} from '../../common/converter/boolean';
import {BaseMonitorParams} from '../../common/params';
import {ParamsParsers, parseParams} from '../../common/params-parsers';
import {Constants} from '../../misc/constants';
import {VERSION} from '../../version';
import {MultiLogController} from '../common/controller/multi-log';
import {SingleLogController} from '../common/controller/single-log';
import {MonitorBindingPlugin} from '../plugin';

export interface BooleanMonitorParams extends BaseMonitorParams {
	/**
	 * Number of rows for visual height.
	 */
	rows?: number;
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
	core: VERSION,
	accept: (value, params) => {
		if (typeof value !== 'boolean') {
			return null;
		}
		const p = ParamsParsers;
		const result = parseParams<BooleanMonitorParams>(params, {
			readonly: p.required.constant(true),
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
};
