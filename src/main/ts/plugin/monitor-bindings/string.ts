import {MultiLogController} from '../../controller/value/multi-log';
import {SingleLogMonitorController} from '../../controller/value/single-log';
import {StringFormatter} from '../../formatter/string';
import {Constants} from '../../misc/constants';
import {ViewModel} from '../../model/view-model';
import {RawMonitorBindingPlugin} from '../monitor-binding';

/**
 * @hidden
 */
export const StringMonitorPlugin: RawMonitorBindingPlugin<string> = {
	id: 'monitor-string',
	model: {
		accept: (value, _params) => (typeof value === 'string' ? value : null),
	},
	controller: (args) => {
		const value = args.binding.value;
		const multiline =
			value.rawValue.length > 1 ||
			('multiline' in args.params && args.params.multiline);
		if (multiline) {
			return new MultiLogController(args.document, {
				formatter: new StringFormatter(),
				lineCount: args.params.lineCount ?? Constants.monitor.defaultLineCount,
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
