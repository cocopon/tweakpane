// @flow

import MonitorValue from '../../model/monitor-value';
import SingleLogMonitorView from '../../view/monitor/single-log';

import type {Formatter} from '../../formatter/formatter';
import type {MonitorController} from './monitor';

type Config<T> = {
	formatter: Formatter<T>,
	value: MonitorValue<T>,
};

export default class SingleLogMonitorController<T> implements MonitorController<T> {
	+value: MonitorValue<T>;
	+view: SingleLogMonitorView<T>;

	constructor(document: Document, config: Config<T>) {
		this.value = config.value;

		this.view = new SingleLogMonitorView(document, {
			formatter: config.formatter,
			value: this.value,
		});
	}
}
