import {Formatter} from '../../../common/converter/formatter';
import {Buffer, BufferedValue} from '../../../common/model/buffered-value';
import {ClassName} from '../../../common/view/class-name';
import {ValueView} from '../../../common/view/value';

interface Config<T> {
	formatter: Formatter<T>;
	lineCount: number;
	value: BufferedValue<T>;
}

const className = ClassName('mll');

/**
 * @hidden
 */
export class MultiLogView<T> implements ValueView<Buffer<T>> {
	public readonly element: HTMLElement;
	public readonly value: BufferedValue<T>;
	private formatter_: Formatter<T>;
	private textareaElem_: HTMLTextAreaElement;

	constructor(doc: Document, config: Config<T>) {
		this.onValueUpdate_ = this.onValueUpdate_.bind(this);

		this.formatter_ = config.formatter;

		this.element = doc.createElement('div');
		this.element.classList.add(className());

		const textareaElem = doc.createElement('textarea');
		textareaElem.classList.add(className('i'));
		textareaElem.style.height = `calc(var(--unit-size) * ${config.lineCount})`;
		textareaElem.readOnly = true;
		this.element.appendChild(textareaElem);
		this.textareaElem_ = textareaElem;

		config.value.emitter.on('change', this.onValueUpdate_);
		this.value = config.value;

		this.update();
	}

	public update(): void {
		const elem = this.textareaElem_;
		const shouldScroll =
			elem.scrollTop === elem.scrollHeight - elem.clientHeight;

		const lines: string[] = [];
		this.value.rawValue.forEach((value) => {
			if (value !== undefined) {
				lines.push(this.formatter_(value));
			}
		});
		elem.textContent = lines.join('\n');

		if (shouldScroll) {
			elem.scrollTop = elem.scrollHeight;
		}
	}

	private onValueUpdate_(): void {
		this.update();
	}
}
