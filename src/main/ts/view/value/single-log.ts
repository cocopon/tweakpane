import {Formatter} from '../../formatter/formatter';
import {ClassName} from '../../misc/class-name';
import * as DisposingUtil from '../../misc/disposing-util';
import {PaneError} from '../../misc/pane-error';
import {Buffer, BufferedValue} from '../../model/buffered-value';
import {View, ViewConfig} from '../view';
import {ValueView} from './value';

interface Config<T> extends ViewConfig {
	formatter: Formatter<T>;
	value: BufferedValue<T>;
}

const className = ClassName('sgl', 'monitor');

/**
 * @hidden
 */
export class SingleLogView<T> extends View implements ValueView<Buffer<T>> {
	public readonly value: BufferedValue<T>;
	private formatter_: Formatter<T>;
	private inputElem_: HTMLInputElement | null;

	constructor(document: Document, config: Config<T>) {
		super(document, config);

		this.onValueUpdate_ = this.onValueUpdate_.bind(this);

		this.formatter_ = config.formatter;

		this.element.classList.add(className());

		const inputElem = document.createElement('input');
		inputElem.classList.add(className('i'));
		inputElem.readOnly = true;
		inputElem.type = 'text';
		this.element.appendChild(inputElem);
		this.inputElem_ = inputElem;

		config.value.emitter.on('change', this.onValueUpdate_);
		this.value = config.value;

		this.update();

		config.model.emitter.on('dispose', () => {
			this.inputElem_ = DisposingUtil.disposeElement(this.inputElem_);
		});
	}

	public update(): void {
		if (!this.inputElem_) {
			throw PaneError.alreadyDisposed();
		}

		const values = this.value.rawValue;
		const lastValue = values[values.length - 1];
		this.inputElem_.value =
			lastValue !== undefined ? this.formatter_.format(lastValue) : '';
	}

	private onValueUpdate_(): void {
		this.update();
	}
}
