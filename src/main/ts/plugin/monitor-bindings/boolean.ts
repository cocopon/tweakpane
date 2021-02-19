import {MultiLogController} from '../../controller/value/multi-log';
import {SingleLogMonitorController} from '../../controller/value/single-log';
import {BooleanFormatter} from '../../formatter/boolean';
import {Constants} from '../../misc/constants';
import {ViewModel} from '../../model/view-model';
import {RawMonitorBindingPlugin} from '../monitor-binding';

/**
 * @hidden
 */
export const BooleanMonitorPlugin: RawMonitorBindingPlugin<boolean> = {
	id: 'monitor-bool',
	model: {
		accept: (value, _params) => (typeof value === 'boolean' ? value : null),
	},
	controller: (args) => {
		if (args.binding.value.rawValue.length === 1) {
			return new SingleLogMonitorController(args.document, {
				viewModel: new ViewModel(),
				formatter: new BooleanFormatter(),
				value: args.binding.value,
			});
		}

		return new MultiLogController(args.document, {
			viewModel: new ViewModel(),
			formatter: new BooleanFormatter(),
			lineCount: args.params.lineCount ?? Constants.monitor.defaultLineCount,
			value: args.binding.value,
		});
	},
};
