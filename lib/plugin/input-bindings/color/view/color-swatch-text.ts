import {Value} from '../../../common/model/value';
import {ClassName} from '../../../common/view/class-name';
import {ValueView} from '../../../common/view/value';
import {TextView} from '../../common/view/text';
import {Color} from '../model/color';
import {ColorSwatchView} from './color-swatch';

interface Config {
	swatchView: ColorSwatchView;
	textView: TextView<Color>;
}

const className = ClassName('clswtxt');

/**
 * @hidden
 */
export class ColorSwatchTextView implements ValueView<Color> {
	public readonly element: HTMLElement;
	public readonly textView: TextView<Color>;
	private readonly swatchView_: ColorSwatchView;

	constructor(doc: Document, config: Config) {
		this.element = doc.createElement('div');
		this.element.classList.add(className());

		const swatchElem = doc.createElement('div');
		swatchElem.classList.add(className('s'));
		this.swatchView_ = config.swatchView;
		swatchElem.appendChild(this.swatchView_.element);
		this.element.appendChild(swatchElem);

		const textElem = doc.createElement('div');
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
