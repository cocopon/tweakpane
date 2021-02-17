import {ClassName} from '../../misc/class-name';
import {Color} from '../../model/color';
import {Value} from '../../model/value';
import {View, ViewConfig} from '../view';
import {ColorSwatchView} from './color-swatch';
import {TextView} from './text';
import {ValueView} from './value';

interface Config extends ViewConfig {
	swatchView: ColorSwatchView;
	textView: TextView<Color>;
}

const className = ClassName('cswtxt');

/**
 * @hidden
 */
export class ColorSwatchTextView extends View implements ValueView<Color> {
	public readonly textView: TextView<Color>;
	private readonly swatchView_: ColorSwatchView;

	constructor(document: Document, config: Config) {
		super(document, config);

		this.element.classList.add(className());

		const swatchElem = document.createElement('div');
		swatchElem.classList.add(className('s'));
		this.swatchView_ = config.swatchView;
		swatchElem.appendChild(this.swatchView_.element);
		this.element.appendChild(swatchElem);

		const textElem = document.createElement('div');
		textElem.classList.add(className('t'));
		this.textView = config.textView;
		textElem.appendChild(this.textView.element);
		this.element.appendChild(textElem);
	}

	get value(): Value<Color> {
		return this.textView.value;
	}

	public update(): void {
		this.swatchView_.update();
		this.textView.update();
	}
}
