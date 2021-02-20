import * as ColorConverter from '../../../common/converter/color';
import {disposeElement} from '../../../common/disposing-util';
import {Color} from '../../../common/model/color';
import {Value} from '../../../common/model/value';
import {PaneError} from '../../../common/pane-error';
import {ClassName} from '../../../common/view/class-name';
import {ValueView} from '../../../common/view/value';
import {View, ViewConfig} from '../../../common/view/view';
import {ColorPickerView} from './color-picker';

interface Config extends ViewConfig {
	pickerView: ColorPickerView;
	value: Value<Color>;
}

const className = ClassName('csw');

/**
 * @hidden
 */
export class ColorSwatchView extends View implements ValueView<Color> {
	public readonly value: Value<Color>;
	private pickerView_: ColorPickerView;
	private buttonElem_: HTMLButtonElement | null;
	private swatchElem_: HTMLDivElement | null;

	constructor(document: Document, config: Config) {
		super(document, config);
		if (this.element === null) {
			throw PaneError.alreadyDisposed();
		}

		this.onValueChange_ = this.onValueChange_.bind(this);

		config.value.emitter.on('change', this.onValueChange_);
		this.value = config.value;

		this.element.classList.add(className());

		const swatchElem = document.createElement('div');
		swatchElem.classList.add(className('sw'));
		this.element.appendChild(swatchElem);
		this.swatchElem_ = swatchElem;

		const buttonElem = document.createElement('button');
		buttonElem.classList.add(className('b'));
		this.element.appendChild(buttonElem);
		this.buttonElem_ = buttonElem;

		const pickerElem = document.createElement('div');
		pickerElem.classList.add(className('p'));
		this.pickerView_ = config.pickerView;
		pickerElem.appendChild(this.pickerView_.element);
		this.element.appendChild(pickerElem);

		this.update();

		config.model.emitter.on('dispose', () => {
			this.buttonElem_ = disposeElement(this.buttonElem_);
			this.swatchElem_ = disposeElement(this.swatchElem_);
		});
	}

	get buttonElement(): HTMLButtonElement {
		if (this.buttonElem_ === null) {
			throw PaneError.alreadyDisposed();
		}
		return this.buttonElem_;
	}

	public update(): void {
		if (!this.swatchElem_) {
			throw PaneError.alreadyDisposed();
		}

		const value = this.value.rawValue;
		this.swatchElem_.style.backgroundColor = ColorConverter.toHexRgbaString(
			value,
		);
	}

	private onValueChange_(): void {
		this.update();
	}
}
