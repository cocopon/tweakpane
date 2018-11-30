// @flow

import MonitorValue from '../../model/monitor-value';
import MultiLogMonitorView from '../../view/monitor/multi-log';

import type {Formatter} from '../../formatter/formatter';
import type {MonitorController} from './monitor';

type Config<T> = {
	formatter: Formatter<T>,
	value: MonitorValue<T>,
};

export default class MultiLogMonitorController<T>
	implements MonitorController<T> {
	+value: MonitorValue<T>;
	+view: MultiLogMonitorView<T>;

	constructor(document: Document, config: Config<T>) {
		this.value = config.value;

		this.view = new MultiLogMonitorView(document, {
			formatter: config.formatter,
			value: this.value,
		});
	}
}
