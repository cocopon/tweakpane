import ClassName from '../../misc/class_name';
import Control   from './control';

class CheckboxControl extends Control {
	constructor(property) {
		super(property);

		const elem = this.getElement();
		elem.classList.add(
			ClassName.get(CheckboxControl.BLOCK_CLASS)
		);

		const labelElem = document.createElement('label');
		labelElem.classList.add(
			ClassName.get(CheckboxControl.BLOCK_CLASS, 'hitArea')
		);
		elem.appendChild(labelElem);

		const inputElem = document.createElement('input');
		inputElem.classList.add(
			ClassName.get(CheckboxControl.BLOCK_CLASS, 'input')
		);
		inputElem.type = 'checkbox';
		labelElem.appendChild(inputElem);
		inputElem.addEventListener(
			'change',
			this.onInputElementChange_.bind(this)
		);
		this.inputElem_ = inputElem;

		const outerElem = document.createElement('div');
		outerElem.classList.add(
			ClassName.get(CheckboxControl.BLOCK_CLASS, 'outer')
		);
		labelElem.appendChild(outerElem);

		const innerElem = document.createElement('div');
		innerElem.classList.add(
			ClassName.get(CheckboxControl.BLOCK_CLASS, 'inner')
		);
		outerElem.appendChild(innerElem);

		this.applyModel_();
	}

	applyModel_() {
		super.applyModel_();

		const model = this.getProperty().getModel();
		this.inputElem_.checked = model.getValue();
	}

	onInputElementChange_() {
		this.getEmitter().notifyObservers(
			Control.EVENT_CHANGE,
			[this.inputElem_.checked]
		);
	}
}

CheckboxControl.BLOCK_CLASS = 'cbc';

module.exports = CheckboxControl;

