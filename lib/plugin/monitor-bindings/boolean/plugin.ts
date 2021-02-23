import {Constants} from '../../../misc/constants';
import {
	BooleanFormatter,
	boolFromUnknown,
} from '../../common/converter/boolean';
import {MonitorBindingPlugin} from '../../monitor-binding';
import {MultiLogController} from '../common/controller/multi-log';
import {SingleLogMonitorController} from '../common/controller/single-log';

/**
 * @hidden
 */
export const BooleanMonitorPlugin: MonitorBindingPlugin<boolean> = {
	id: 'monitor-bool',
	binding: {
		accept: (value, _params) => (typeof value === 'boolean' ? value : null),
		reader: (_args) => boolFromUnknown,
	},
	controller: (args) => {
		if (args.binding.value.rawValue.length === 1) {
			return new SingleLogMonitorController(args.document, {
				formatter: BooleanFormatter,
				value: args.binding.value,
			});
		}

		return new MultiLogController(args.document, {
			formatter: BooleanFormatter,
			lineCount: args.params.lineCount ?? Constants.monitor.defaultLineCount,
			value: args.binding.value,
		});
	},
};
