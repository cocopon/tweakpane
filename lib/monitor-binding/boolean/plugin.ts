import {
	BooleanFormatter,
	boolFromUnknown,
} from '../../common/converter/boolean';
import {Constants} from '../../misc/constants';
import {MultiLogController} from '../common/controller/multi-log';
import {SingleLogMonitorController} from '../common/controller/single-log';
import {MonitorBindingPlugin} from '../plugin';

/**
 * @hidden
 */
export const BooleanMonitorPlugin: MonitorBindingPlugin<boolean> = {
	id: 'monitor-bool',
	accept: (value, _params) => (typeof value === 'boolean' ? value : null),
	binding: {
		reader: (_args) => boolFromUnknown,
	},
	controller: (args) => {
		if (args.value.rawValue.length === 1) {
			return new SingleLogMonitorController(args.document, {
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
