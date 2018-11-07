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
	value_: MonitorValue<T>;
	view_: SingleLogMonitorView<T>;

	constructor(document: Document, config: Config<T>) {
		this.value_ = config.value;

		this.view_ = new SingleLogMonitorView(document, {
			formatter: config.formatter,
			value: this.value_,
		});
	}

	get value(): MonitorValue<T> {
		return this.value_;
	}

	get view(): SingleLogMonitorView<T> {
		return this.view_;
	}
}
