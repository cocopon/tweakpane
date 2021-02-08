import {MultiLogMonitorController} from '../../controller/monitor/multi-log';
import {SingleLogMonitorController} from '../../controller/monitor/single-log';
import * as BooleanConverter from '../../converter/boolean';
import {BooleanFormatter} from '../../formatter/boolean';
import {Constants} from '../../misc/constants';
import {TypeUtil} from '../../misc/type-util';
import {ViewModel} from '../../model/view-model';
import {MonitorBindingPlugin} from '../monitor-binding';

/**
 * @hidden
 */
export const BooleanMonitorPlugin: MonitorBindingPlugin<boolean, boolean> = {
	model: {
		accept: (value, _params) => (typeof value === 'boolean' ? value : null),
		defaultTotalCount: (_params) => 1,
		reader: (_args) => BooleanConverter.fromMixed,
	},
	controller: (args) => {
		if (args.binding.value.totalCount === 1) {
			return new SingleLogMonitorController(args.document, {
				viewModel: new ViewModel(),
				formatter: new BooleanFormatter(),
				value: args.binding.value,
			});
		}

		return new MultiLogMonitorController(args.document, {
			viewModel: new ViewModel(),
			formatter: new BooleanFormatter(),
			lineCount: TypeUtil.getOrDefault(
				args.params.lineCount,
				Constants.monitor.defaultLineCount,
			),
			value: args.binding.value,
		});
	},
};
