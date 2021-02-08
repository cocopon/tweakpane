import {MultiLogMonitorController} from '../../controller/monitor/multi-log';
import {SingleLogMonitorController} from '../../controller/monitor/single-log';
import * as StringConverter from '../../converter/string';
import {StringFormatter} from '../../formatter/string';
import {Constants} from '../../misc/constants';
import {TypeUtil} from '../../misc/type-util';
import {ViewModel} from '../../model/view-model';
import {MonitorBindingPlugin} from '../monitor-binding';

/**
 * @hidden
 */
export const StringMonitorPlugin: MonitorBindingPlugin<string, string> = {
	model: {
		accept: (value, _params) => (typeof value === 'string' ? value : null),
		defaultBufferSize: (_params) => 1,
		reader: (_args) => StringConverter.fromMixed,
	},
	controller: (args) => {
		const value = args.binding.value;
		const multiline =
			value.bufferSize > 1 ||
			('multiline' in args.params && args.params.multiline);
		if (multiline) {
			return new MultiLogMonitorController(args.document, {
				formatter: new StringFormatter(),
				lineCount: TypeUtil.getOrDefault(
					args.params.lineCount,
					Constants.monitor.defaultLineCount,
				),
				value: value,
				viewModel: new ViewModel(),
			});
		}

		return new SingleLogMonitorController(args.document, {
			formatter: new StringFormatter(),
			value: value,
			viewModel: new ViewModel(),
		});
	},
};
