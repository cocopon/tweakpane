const ClassName = require('../misc/class_name');
const View      = require('./view');

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

	getContainerElement_() {
		return this.containerElem_;
	}

	onButtonElementClick_() {
		this.getEmitter().notifyObservers(
			ButtonView.EVENT_CLICK,
			[this]
		);
	}
}

ButtonView.BLOCK_CLASS = 'bv';
ButtonView.EVENT_CLICK = 'click';

module.exports = ButtonView;
