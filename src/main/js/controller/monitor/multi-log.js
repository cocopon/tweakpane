// @flow

import MonitorValue from '../../model/monitor-value';
import MultiLogMonitorView from '../../view/monitor/multi-log';

import type {Formatter} from '../../formatter/formatter';
import type {MonitorController} from './monitor';

type Config<T> = {
	formatter: Formatter<T>,
	value: MonitorValue<T>,
};

export default class MultiLogMonitorController<T> implements MonitorController<T> {
	value_: MonitorValue<T>;
	view_: MultiLogMonitorView<T>;

	constructor(document: Document, config: Config<T>) {
		this.value_ = config.value;

		this.view_ = new MultiLogMonitorView(document, {
			formatter: config.formatter,
			value: this.value_,
		});
	}

	get value(): MonitorValue<T> {
		return this.value_;
	}

	get view(): MultiLogMonitorView<T> {
		return this.view_;
	}
}
