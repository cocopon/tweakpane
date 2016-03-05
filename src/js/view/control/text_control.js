const Control = require('./control');

class TextControl extends Control {
	createElement_() {
		super.createElement_();

		this.addClass('textControl');

		const inputElem = document.createElement('input');
		inputElem.className += 'textControl_input';
		inputElem.type = 'text';
		this.getElement().appendChild(inputElem);
		inputElem.addEventListener(
			'change',
			this.onInputElementChange_.bind(this)
		);
		this.inputElem_ = inputElem;
	}

	applyModel_() {
		super.applyModel_();

		this.inputElem_.value = String(this.getModel().getValue());
	}

	onInputElementChange_() {
		this.getEmitter().notifyObservers(
			Control.EVENT_CHANGE,
			[this.inputElem_.value]
		);
	}
}

module.exports = TextControl;
