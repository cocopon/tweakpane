import {Formatter} from '../../formatter/formatter';
import {ClassName} from '../../misc/class-name';
import * as DisposingUtil from '../../misc/disposing-util';
import {PaneError} from '../../misc/pane-error';
import {Value} from '../../model/value';
import {View, ViewConfig} from '../view';
import {ValueView} from './value';

interface Config<T> extends ViewConfig {
	formatter: Formatter<T>;
	value: Value<T>;
}

const className = ClassName('txt');

/**
 * @hidden
 */
export class TextView<T> extends View implements ValueView<T> {
	public readonly value: Value<T>;
	private formatter_: Formatter<T>;
	private inputElem_: HTMLInputElement | null;

	constructor(document: Document, config: Config<T>) {
		super(document, config);

		this.onValueChange_ = this.onValueChange_.bind(this);

		this.formatter_ = config.formatter;

		this.element.classList.add(className());

		const inputElem = document.createElement('input');
		inputElem.classList.add(className('i'));
		inputElem.type = 'text';
		this.element.appendChild(inputElem);
		this.inputElem_ = inputElem;

		config.value.emitter.on('change', this.onValueChange_);
		this.value = config.value;

		this.update();

		config.model.emitter.on('dispose', () => {
			this.inputElem_ = DisposingUtil.disposeElement(this.inputElem_);
		});
	}

	get inputElement(): HTMLInputElement {
		if (!this.inputElem_) {
			throw PaneError.alreadyDisposed();
		}
		return this.inputElem_;
	}

	public update(): void {
		if (!this.inputElem_) {
			throw PaneError.alreadyDisposed();
		}
		this.inputElem_.value = this.formatter_.format(this.value.rawValue);
	}

	private onValueChange_(): void {
		this.update();
	}
}
