import ListConstraint from '../../constraint/list_constraint';
import ClassName      from '../../misc/class_name';
import Control        from './control';

class ListControl extends Control {
	constructor(property) {
		super(property);

		const elem = this.getElement();
		elem.classList.add(
			ClassName.get(ListControl.BLOCK_CLASS)
		);

		const arrowElem = document.createElement('div');
		arrowElem.classList.add(
			ClassName.get(ListControl.BLOCK_CLASS, 'arrow')
		);
		elem.appendChild(arrowElem);

		const selectElem = document.createElement('select');
		selectElem.classList.add(
			ClassName.get(ListControl.BLOCK_CLASS, 'select')
		);
		elem.appendChild(selectElem);
		selectElem.addEventListener(
			'change',
			this.onSelectElementChange_.bind(this)
		);
		this.selectElem_ = selectElem;

		this.applyModel_();
	}

	applyModel_() {
		super.applyModel_();

		if (this.selectElem_ === undefined) {
			return;
		}

		while (this.selectElem_.hasChildNodes()) {
			this.selectElem_.removeChild(this.selectElem_.lastChild);
		}

		const model = this.getProperty().getModel();
		const constraint = model.findConstraintByClass(ListConstraint);
		const items = constraint.getItems() || [];
		items.forEach((item) => {
			const optionElem = document.createElement('option');
			optionElem.value = item.value;
			optionElem.textContent = item.name;
			this.selectElem_.appendChild(optionElem);
		});

		this.selectElem_.value = model.getValue();
	}

	onSelectElementChange_() {
		this.getEmitter().notifyObservers(
			Control.EVENT_CHANGE,
			[this.selectElem_.value]
		);
	}
}

ListControl.BLOCK_CLASS = 'lsc';

module.exports = ListControl;
