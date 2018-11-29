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

const className = ClassName('mll', 'monitor');

export default class MultiLogMonitorView<T> extends View implements MonitorView<T> {
	+value: MonitorValue<T>;
	formatter_: Formatter<T>;
	textareaElem_: HTMLTextAreaElement;

	constructor(document: Document, config: Config<T>) {
		super(document);

		(this: any).onValueUpdate_ = this.onValueUpdate_.bind(this);

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

	update(): void {
		const elem = this.textareaElem_;
		const shouldScroll = (elem.scrollTop === (elem.scrollHeight - elem.clientHeight));

		elem.textContent = this.value.rawValues.map((value) => {
			return this.formatter_.format(value);
		}).join('\n');

		if (shouldScroll) {
			elem.scrollTop = elem.scrollHeight;
		}
	}

	onValueUpdate_(): void {
		this.update();
	}
}
