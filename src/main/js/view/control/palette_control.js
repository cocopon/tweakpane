const ColorFormatter = require('../../formatter/color_formatter');
const ClassName      = require('../../misc/class_name');
const Control        = require('./control');

class PaletteControl extends Control {
	constructor(property) {
		super(property);

		this.getElement().classList.add(
			ClassName.get(PaletteControl.BLOCK_CLASS)
		);

		const outerElem = document.createElement('div');
		outerElem.classList.add(
			ClassName.get(PaletteControl.BLOCK_CLASS, 'outer')
		);
		this.elem_.appendChild(outerElem);

		const innerElem = document.createElement('div');
		innerElem.classList.add(
			ClassName.get(PaletteControl.BLOCK_CLASS, 'inner')
		);
		outerElem.appendChild(innerElem);
		this.innerElem_ = innerElem;

		this.applyModel_();
	}

	applyModel_() {
		super.applyModel_();

		if (this.innerElem_ !== undefined) {
			const model = this.getProperty().getModel();
			const color = (new ColorFormatter()).format(
				model.getValue()
			);
			this.innerElem_.style.backgroundColor = color;
		}
	}
}

PaletteControl.BLOCK_CLASS = 'plc';

module.exports = PaletteControl;
