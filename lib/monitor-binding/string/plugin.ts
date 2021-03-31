import {formatString, stringFromUnknown} from '../../common/converter/string';
import {Constants} from '../../misc/constants';
import {MultiLogController} from '../common/controller/multi-log';
import {SingleLogMonitorController} from '../common/controller/single-log';
import {MonitorBindingPlugin} from '../plugin';

/**
 * @hidden
 */
export const StringMonitorPlugin: MonitorBindingPlugin<string> = {
	id: 'monitor-string',
	accept: (value, _params) => (typeof value === 'string' ? value : null),
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

		return new SingleLogMonitorController(args.document, {
			formatter: formatString,
			value: value,
			viewProps: args.viewProps,
		});
	},
};
