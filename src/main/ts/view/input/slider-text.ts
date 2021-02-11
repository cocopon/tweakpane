import {ClassName} from '../../misc/class-name';
import {InputValue} from '../../model/input-value';
import {View, ViewConfig} from '../view';
import {InputView} from './input';
import {SliderInputView} from './slider';
import {TextInputView} from './text';

interface Config extends ViewConfig {
	sliderInputView: SliderInputView;
	textInputView: TextInputView<number>;
}

const className = ClassName('sldtxt', 'input');

/**
 * @hidden
 */
export class SliderTextInputView extends View implements InputView<number> {
	private sliderInputView_: SliderInputView;
	private textInputView_: TextInputView<number>;

	constructor(document: Document, config: Config) {
		super(document, config);

		this.element.classList.add(className());

		const sliderElem = document.createElement('div');
		sliderElem.classList.add(className('s'));
		this.sliderInputView_ = config.sliderInputView;
		sliderElem.appendChild(this.sliderInputView_.element);
		this.element.appendChild(sliderElem);

		const textElem = document.createElement('div');
		textElem.classList.add(className('t'));
		this.textInputView_ = config.textInputView;
		textElem.appendChild(this.textInputView_.element);
		this.element.appendChild(textElem);
	}

	get value(): InputValue<number> {
		return this.sliderInputView_.value;
	}

	public update(): void {
		this.sliderInputView_.update();
		this.textInputView_.update();
	}
}
