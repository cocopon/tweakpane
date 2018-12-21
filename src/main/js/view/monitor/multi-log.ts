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

const className = ClassName('mll', 'monitor');

export default class MultiLogMonitorView<T> extends View
	implements MonitorView<T> {
	public readonly value: MonitorValue<T>;
	private formatter_: Formatter<T>;
	private textareaElem_: HTMLTextAreaElement;

	constructor(document: Document, config: Config<T>) {
		super(document);

		this.onValueUpdate_ = this.onValueUpdate_.bind(this);

		this.formatter_ = config.formatter;

		this.element.classList.add(className());

		const textareaElem = document.createElement('textarea');
		textareaElem.classList.add(className('i'));
		textareaElem.readOnly = true;
		this.element.appendChild(textareaElem);
		this.textareaElem_ = textareaElem;

		config.value.emitter.on('update', this.onValueUpdate_);
		this.value = config.value;

		this.update();
	}

	public update(): void {
		const elem = this.textareaElem_;
		const shouldScroll =
			elem.scrollTop === elem.scrollHeight - elem.clientHeight;

		elem.textContent = this.value.rawValues
			.map((value) => {
				return this.formatter_.format(value);
			})
			.join('\n');

		if (shouldScroll) {
			elem.scrollTop = elem.scrollHeight;
		}
	}

	private onValueUpdate_(): void {
		this.update();
	}
}
