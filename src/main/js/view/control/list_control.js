const ListConstraint = require('../../constraint/list_constraint');
const ClassName      = require('../../misc/class_name');
const Control        = require('./control');

class ListControl extends Control {
	constructor(model) {
		super(model);

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

		const constraint = this.model_.findConstraintByClass(ListConstraint);
		const items = constraint.getItems() || [];
		items.forEach((item) => {
			const optionElem = document.createElement('option');
			optionElem.value = item.value;
			optionElem.textContent = item.name;
			this.selectElem_.appendChild(optionElem);
		});

		this.selectElem_.value = this.model_.getValue();
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
