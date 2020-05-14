import {Formatter} from '../../formatter/formatter';
import {ClassName} from '../../misc/class-name';
import * as DisposingUtil from '../../misc/disposing-util';
import {PaneError} from '../../misc/pane-error';
import {MonitorValue} from '../../model/monitor-value';
import {View} from '../view';
import {MonitorView} from './monitor';

interface Config<T> {
	formatter: Formatter<T>;
	value: MonitorValue<T>;
}

const className = ClassName('mll', 'monitor');

/**
 * @hidden
 */
export class MultiLogMonitorView<T> extends View implements MonitorView<T> {
	public readonly value: MonitorValue<T>;
	private formatter_: Formatter<T>;
	private textareaElem_: HTMLTextAreaElement | null;

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

		this.disposable.emitter.on('dispose', () => {
			this.textareaElem_ = DisposingUtil.disposeElement(this.textareaElem_);
		});
	}

	public update(): void {
		const elem = this.textareaElem_;
		if (!elem) {
			throw PaneError.alreadyDisposed();
		}

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
