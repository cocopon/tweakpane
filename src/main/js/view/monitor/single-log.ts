// @flow

import ClassName from '../../misc/class-name';
import MonitorValue from '../../model/monitor-value';
import View from '../view';

import {Formatter} from '../../formatter/formatter';
import {MonitorView} from './monitor';

interface Config<T> {
	formatter: Formatter<T>;
	value: MonitorValue<T>;
}

const className = ClassName('sgl', 'monitor');

export default class SingleLogMonitorView<T> extends View
	implements MonitorView<T> {
	public readonly value: MonitorValue<T>;
	private formatter_: Formatter<T>;
	private inputElem_: HTMLInputElement;

	constructor(document: Document, config: Config<T>) {
		super(document);

		this.onValueUpdate_ = this.onValueUpdate_.bind(this);

		this.formatter_ = config.formatter;

		this.element.classList.add(className());

		const inputElem = document.createElement('input');
		inputElem.classList.add(className('i'));
		inputElem.readOnly = true;
		inputElem.type = 'text';
		this.element.appendChild(inputElem);
		this.inputElem_ = inputElem;

		config.value.emitter.on('update', this.onValueUpdate_);
		this.value = config.value;

		this.update();
	}

	public update(): void {
		const values = this.value.rawValues;

		this.inputElem_.value =
			values.length > 0
				? this.formatter_.format(values[values.length - 1])
				: '';
	}

	private onValueUpdate_(): void {
		this.update();
	}
}
