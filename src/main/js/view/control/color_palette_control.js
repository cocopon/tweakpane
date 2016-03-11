const ClassName = require('../../misc/class_name');
const Control   = require('./control');

class ColorPaletteControl extends Control {
	constructor(model) {
		super(model);

		this.addClass(ClassName.get(ColorPaletteControl.BLOCK_CLASS));

		const outerElem = document.createElement('div');
		outerElem.className = ClassName.get(ColorPaletteControl.BLOCK_CLASS, 'outer');
		this.elem_.appendChild(outerElem);

		const innerElem = document.createElement('div');
		innerElem.className = ClassName.get(ColorPaletteControl.BLOCK_CLASS, 'inner');
		outerElem.appendChild(innerElem);
		this.innerElem_ = innerElem;
	}

	applyModel_() {
		super.applyModel_();

		if (this.innerElem_ !== undefined) {
			this.innerElem_.style.backgroundColor = this.getModel().getValue();
		}
	}
}

ColorPaletteControl.BLOCK_CLASS = 'cpc';

module.exports = ColorPaletteControl;
