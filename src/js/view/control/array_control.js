const ArrayModel = require('../../model/array_model');
const Control = require('./control');

class ArrayControl extends Control {
	constructor(target, propName) {
		super(target, propName);
	}

	createElement_() {
		super.createElement_();

		const elem = this.getElement();

		const selectElem = document.createElement('select');
		elem.appendChild(selectElem);
		selectElem.addEventListener('change', this.onSelectElementChange_.bind(this));
		this.selectElem_ = selectElem;

		const inputElem = document.createElement('input');
		inputElem.type = 'checkbox';
		elem.appendChild(inputElem);
		this.inputElem_ = inputElem;
	}

	instanciateModel_() {
		return new ArrayModel();
	}

	applyModel_() {
		super.applyModel_();

		while (this.selectElem_.hasChildNodes()) {
			this.selectElem_.removeChild(this.selectElem_.lastChild);
		}
		this.model_.getItems().forEach((item) => {
			const optionElem = document.createElement('option');
			optionElem.value = item;
			optionElem.textContent = item;
			this.selectElem_.appendChild(optionElem);
		});

		this.inputElem_.checked = this.model_.getValue();
	}

	onSelectElementChange_() {
		console.log(this.selectElem_);
		// this.model_.setValue(this.inputElem_.checked);
	}
}

module.exports = ArrayControl;
