import {Formatter} from '../../formatter/formatter';
import {ClassName} from '../../misc/class-name';
import * as DisposingUtil from '../../misc/disposing-util';
import {PaneError} from '../../misc/pane-error';
import {Buffer, BufferedValue} from '../../model/buffered-value';
import {View, ViewConfig} from '../view';
import {ValueView} from './value';

interface Config<T> extends ViewConfig {
	formatter: Formatter<T>;
	lineCount: number;
	value: BufferedValue<T>;
}

const className = ClassName('mll', 'monitor');

/**
 * @hidden
 */
export class MultiLogView<T> extends View implements ValueView<Buffer<T>> {
	public readonly value: BufferedValue<T>;
	private formatter_: Formatter<T>;
	private textareaElem_: HTMLTextAreaElement | null;

	constructor(document: Document, config: Config<T>) {
		super(document, config);

		this.onValueUpdate_ = this.onValueUpdate_.bind(this);

		this.formatter_ = config.formatter;

		this.element.classList.add(className());

		const textareaElem = document.createElement('textarea');
		textareaElem.classList.add(className('i'));
		textareaElem.style.height = `calc(var(--unit-size) * ${config.lineCount})`;
		textareaElem.readOnly = true;
		this.element.appendChild(textareaElem);
		this.textareaElem_ = textareaElem;

		config.value.emitter.on('change', this.onValueUpdate_);
		this.value = config.value;

		this.update();

		config.model.emitter.on('dispose', () => {
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

		elem.textContent = this.value.rawValue
			.map((value) => {
				return value !== undefined ? this.formatter_.format(value) : '';
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
