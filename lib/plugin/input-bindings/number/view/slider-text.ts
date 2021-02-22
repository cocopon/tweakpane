import {Value} from '../../../common/model/value';
import {ClassName} from '../../../common/view/class-name';
import {ValueView} from '../../../common/view/value';
import {TextView} from '../../common/view/text';
import {SliderView} from './slider';

interface Config {
	sliderView: SliderView;
	textView: TextView<number>;
}

const className = ClassName('sldtxt');

/**
 * @hidden
 */
export class SliderTextView implements ValueView<number> {
	public readonly element: HTMLElement;
	private sliderView_: SliderView;
	private textView_: TextView<number>;

	constructor(doc: Document, config: Config) {
		this.element = doc.createElement('div');
		this.element.classList.add(className());

		const sliderElem = doc.createElement('div');
		sliderElem.classList.add(className('s'));
		this.sliderView_ = config.sliderView;
		sliderElem.appendChild(this.sliderView_.element);
		this.element.appendChild(sliderElem);

		const textElem = doc.createElement('div');
		textElem.classList.add(className('t'));
		this.textView_ = config.textView;
		textElem.appendChild(this.textView_.element);
		this.element.appendChild(textElem);
	}

	get value(): Value<number> {
		return this.sliderView_.value;
	}

	public update(): void {
		this.sliderView_.update();
		this.textView_.update();
	}
}
