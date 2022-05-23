import {ClassName} from '../../../common/view/class-name';
import {View} from '../../../common/view/view';
import {NumberTextView} from './number-text';
import {SliderView} from './slider';

interface Config {
	sliderView: SliderView;
	textView: NumberTextView;
}

const className = ClassName('sldtxt');

/**
 * @hidden
 */
export class SliderTextView implements View {
	public readonly element: HTMLElement;
	private readonly sliderView_: SliderView;
	private readonly textView_: NumberTextView;

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
}
