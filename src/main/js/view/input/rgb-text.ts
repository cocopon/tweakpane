import {Formatter} from '../../formatter/formatter';
import {ClassName} from '../../misc/class-name';
import * as DisposingUtil from '../../misc/disposing-util';
import {PaneError} from '../../misc/pane-error';
import {Color} from '../../model/color';
import {InputValue} from '../../model/input-value';
import {View, ViewConfig} from '../view';
import {InputView} from './input';

interface Config extends ViewConfig {
	formatter: Formatter<number>;
	value: InputValue<Color>;
}

const className = ClassName('rgbtxt', 'input');

/**
 * @hidden
 */
export class RgbTextInputView extends View implements InputView<Color> {
	public readonly value: InputValue<Color>;
	private formatter_: Formatter<number>;
	private inputElems_:
		| [HTMLInputElement, HTMLInputElement, HTMLInputElement]
		| null;

	constructor(document: Document, config: Config) {
		super(document, config);

		this.onValueChange_ = this.onValueChange_.bind(this);

		this.formatter_ = config.formatter;

		this.element.classList.add(className());

		const labelElem = document.createElement('div');
		labelElem.classList.add(className('l'));
		labelElem.textContent = 'RGB';
		this.element.appendChild(labelElem);

		const wrapperElem = document.createElement('div');
		wrapperElem.classList.add(className('w'));
		this.element.appendChild(wrapperElem);

		const inputElems = [0, 1, 2].map(() => {
			const inputElem = document.createElement('input');
			inputElem.classList.add(className('i'));
			inputElem.type = 'text';
			return inputElem;
		});
		inputElems.forEach((elem) => {
			wrapperElem.appendChild(elem);
		});
		this.inputElems_ = [inputElems[0], inputElems[1], inputElems[2]];

		config.value.emitter.on('change', this.onValueChange_);
		this.value = config.value;

		this.update();

		config.disposable.emitter.on('dispose', () => {
			if (this.inputElems_) {
				this.inputElems_.forEach((elem) => {
					DisposingUtil.disposeElement(elem);
				});
				this.inputElems_ = null;
			}
		});
	}

	get inputElements(): [HTMLInputElement, HTMLInputElement, HTMLInputElement] {
		if (!this.inputElems_) {
			throw PaneError.alreadyDisposed();
		}
		return this.inputElems_;
	}

	public update(): void {
		const inputElems = this.inputElems_;
		if (!inputElems) {
			throw PaneError.alreadyDisposed();
		}

		const rgbComps = this.value.rawValue.getComponents('rgb');

		rgbComps.forEach((comp, index) => {
			const inputElem = inputElems[index];
			inputElem.value = this.formatter_.format(comp);
		});
	}

	private onValueChange_(): void {
		this.update();
	}
}
