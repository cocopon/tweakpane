// @flow

import ClassName from '../../misc/class-name';
import MonitorValue from '../../model/monitor-value';
import View from '../view';

import type {Formatter} from '../../formatter/formatter';
import type {MonitorView} from './monitor';

type Config<T> = {
	formatter: Formatter<T>,
	value: MonitorValue<T>,
};

const className = ClassName('sgl', 'monitor');

export default class SingleLogMonitorView<T> extends View implements MonitorView<T> {
	formatter_: Formatter<T>;
	value_: MonitorValue<T>;

	inputElem_: HTMLInputElement;

	constructor(document: Document, config: Config<T>) {
		super(document);

		(this: any).onValueUpdate_ = this.onValueUpdate_.bind(this);

		this.formatter_ = config.formatter;

		this.element.classList.add(className());

		const inputElem = document.createElement('input');
		inputElem.classList.add(className('i'));
		inputElem.readOnly = true;
		inputElem.type = 'text';
		this.element.appendChild(inputElem);
		this.inputElem_ = inputElem;

		config.value.emitter.on('update', this.onValueUpdate_);
		this.value_ = config.value;

		this.update();
	}

	get value(): MonitorValue<T> {
		return this.value_;
	}

	update(): void {
		const values = this.value_.rawValues;

		this.inputElem_.value = (values.length > 0) ?
			this.formatter_.format(values[values.length - 1]) :
			'';
	}

	onValueUpdate_(): void {
		this.update();
	}
}
