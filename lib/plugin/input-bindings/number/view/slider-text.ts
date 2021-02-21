import {Value} from '../../../common/model/value';
import {ClassName} from '../../../common/view/class-name';
import {ValueView} from '../../../common/view/value';
import {View, ViewConfig} from '../../../common/view/view';
import {TextView} from '../../common/view/text';
import {SliderView} from './slider';

interface Config extends ViewConfig {
	sliderView: SliderView;
	textView: TextView<number>;
}

const className = ClassName('sldtxt');

/**
 * @hidden
 */
export class SliderTextView extends View implements ValueView<number> {
	private sliderView_: SliderView;
	private textView_: TextView<number>;

	constructor(document: Document, config: Config) {
		super(document, config);

		this.element.classList.add(className());

		const sliderElem = document.createElement('div');
		sliderElem.classList.add(className('s'));
		this.sliderView_ = config.sliderView;
		sliderElem.appendChild(this.sliderView_.element);
		this.element.appendChild(sliderElem);

		const textElem = document.createElement('div');
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
