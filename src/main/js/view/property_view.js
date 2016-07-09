import ClassName from '../misc/class_name';
import View      from './view';

class PropertyView extends View {
	constructor(property) {
		super();

		const elem = this.getElement();
		elem.classList.add(
			ClassName.get(PropertyView.BLOCK_CLASS)
		);

		const labelElem = document.createElement('div');
		labelElem.classList.add(
			ClassName.get(PropertyView.BLOCK_CLASS, 'label')
		);
		elem.appendChild(labelElem);
		this.labelElem_ = labelElem;

		const containerElem = document.createElement('div');
		containerElem.classList.add(
			ClassName.get(PropertyView.BLOCK_CLASS, 'container')
		);
		elem.appendChild(containerElem);
		this.containerElem_ = containerElem;

		this.prop_ = property;
		this.applyProperty_();
	}

	getProperty() {
		return this.prop_;
	}

	getContainerElement_() {
		return this.containerElem_;
	}

	applyProperty_() {
		this.labelElem_.textContent = this.prop_.getLabel();
	}
}

PropertyView.BLOCK_CLASS = 'prv';

export default PropertyView;
