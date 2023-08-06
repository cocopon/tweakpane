import {ClassName} from '../../../common/view/class-name.js';
import {View} from '../../../common/view/view.js';
import {NumberTextView} from './number-text.js';
import {SliderView} from './slider.js';

/**
 * @hidden
 */
interface Config {
	sliderView: SliderView;
	textView: NumberTextView;
}

const cn = ClassName('sldtxt');

/**
 * @hidden
 */
export class SliderTextView implements View {
	public readonly element: HTMLElement;
	private readonly sliderView_: SliderView;
	private readonly textView_: NumberTextView;

	constructor(doc: Document, config: Config) {
		this.element = doc.createElement('div');
		this.element.classList.add(cn());

		const sliderElem = doc.createElement('div');
		sliderElem.classList.add(cn('s'));
		this.sliderView_ = config.sliderView;
		sliderElem.appendChild(this.sliderView_.element);
		this.element.appendChild(sliderElem);

		const textElem = doc.createElement('div');
		textElem.classList.add(cn('t'));
		this.textView_ = config.textView;
		textElem.appendChild(this.textView_.element);
		this.element.appendChild(textElem);
	}
}
