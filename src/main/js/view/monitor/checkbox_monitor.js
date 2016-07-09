import ClassName from '../../misc/class_name';
import Monitor   from './monitor';

class CheckboxMonitor extends Monitor {
	constructor(property) {
		super(property);

		const elem = this.getElement();
		elem.classList.add(
			ClassName.get(CheckboxMonitor.BLOCK_CLASS)
		);

		const labelElem = document.createElement('label');
		labelElem.classList.add(
			ClassName.get(CheckboxMonitor.BLOCK_CLASS, 'hitArea')
		);
		elem.appendChild(labelElem);

		const inputElem = document.createElement('input');
		inputElem.classList.add(
			ClassName.get(CheckboxMonitor.BLOCK_CLASS, 'input')
		);
		inputElem.disabled = true;
		inputElem.type = 'checkbox';
		labelElem.appendChild(inputElem);
		this.inputElem_ = inputElem;

		const outerElem = document.createElement('div');
		outerElem.classList.add(
			ClassName.get(CheckboxMonitor.BLOCK_CLASS, 'outer')
		);
		labelElem.appendChild(outerElem);

		const innerElem = document.createElement('div');
		innerElem.classList.add(
			ClassName.get(CheckboxMonitor.BLOCK_CLASS, 'inner')
		);
		outerElem.appendChild(innerElem);

		this.applyModel_();
	}

	applyModel_() {
		super.applyModel_();

		this.inputElem_.checked = this.getProperty().getModel().getValue();
	}
}

CheckboxMonitor.BLOCK_CLASS = 'cbm';

export default CheckboxMonitor;
