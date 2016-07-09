import ClassName from '../misc/class_name';
import View      from './view';

class ButtonView extends View {
	constructor(title) {
		super();

		const elem = this.getElement();
		elem.classList.add(
			ClassName.get(ButtonView.BLOCK_CLASS)
		);

		const buttonElem = document.createElement('button');
		buttonElem.textContent = title;
		buttonElem.classList.add(
			ClassName.get(ButtonView.BLOCK_CLASS, 'button')
		);
		buttonElem.addEventListener(
			'click',
			this.onButtonElementClick_.bind(this)
		);
		elem.appendChild(buttonElem);
		this.titleElem_ = buttonElem;
	}

	onButtonElementClick_() {
		this.getEmitter().notifyObservers(
			ButtonView.EVENT_CLICK,
			[this]
		);
	}
}

ButtonView.BLOCK_CLASS = 'btv';
ButtonView.EVENT_CLICK = 'click';

export default ButtonView;
