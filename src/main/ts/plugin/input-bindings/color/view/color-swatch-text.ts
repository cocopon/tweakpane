import {Color} from '../../../common/model/color';
import {Value} from '../../../common/model/value';
import {ClassName} from '../../../common/view/class-name';
import {ValueView} from '../../../common/view/value';
import {View, ViewConfig} from '../../../common/view/view';
import {TextView} from '../../common/view/text';
import {ColorSwatchView} from './color-swatch';

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
