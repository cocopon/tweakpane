import {Value} from '../../../common/model/value.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {ClassName} from '../../../common/view/class-name.js';
import {View} from '../../../common/view/view.js';
import {colorToHexRgbaString} from '../converter/color-string.js';
import {IntColor} from '../model/int-color.js';

interface Config {
	value: Value<IntColor>;
	viewProps: ViewProps;
}

const cn = ClassName('colsw');

/**
 * @hidden
 */
export class ColorSwatchView implements View {
	public readonly element: HTMLElement;
	public readonly value: Value<IntColor>;
	public readonly buttonElement: HTMLButtonElement;
	private readonly swatchElem_: HTMLDivElement;

	constructor(doc: Document, config: Config) {
		this.onValueChange_ = this.onValueChange_.bind(this);

		config.value.emitter.on('change', this.onValueChange_);
		this.value = config.value;

		this.element = doc.createElement('div');
		this.element.classList.add(cn());
		config.viewProps.bindClassModifiers(this.element);

		const swatchElem = doc.createElement('div');
		swatchElem.classList.add(cn('sw'));
		this.element.appendChild(swatchElem);
		this.swatchElem_ = swatchElem;

		const buttonElem = doc.createElement('button');
		buttonElem.classList.add(cn('b'));
		config.viewProps.bindDisabled(buttonElem);
		this.element.appendChild(buttonElem);
		this.buttonElement = buttonElem;

		this.update_();
	}

	private update_(): void {
		const value = this.value.rawValue;
		this.swatchElem_.style.backgroundColor = colorToHexRgbaString(value);
	}

	private onValueChange_(): void {
		this.update_();
	}
}
