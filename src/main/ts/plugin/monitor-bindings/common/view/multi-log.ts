import {disposeElement} from '../../../common/disposing-util';
import {Buffer, BufferedValue} from '../../../common/model/buffered-value';
import {PaneError} from '../../../common/pane-error';
import {ClassName} from '../../../common/view/class-name';
import {ValueView} from '../../../common/view/value';
import {View, ViewConfig} from '../../../common/view/view';
import {Formatter} from '../../../common/writer/formatter';

interface Config<T> extends ViewConfig {
	formatter: Formatter<T>;
	lineCount: number;
	value: BufferedValue<T>;
}

const className = ClassName('mll');

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
			this.textareaElem_ = disposeElement(this.textareaElem_);
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
