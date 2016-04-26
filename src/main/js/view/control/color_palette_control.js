const ColorDisplay = require('../../display/color_display');
const ClassName      = require('../../misc/class_name');
const Control        = require('./control');

class ColorPaletteControl extends Control {
	constructor(model) {
		super(model);

		this.getElement().classList.add(
			ClassName.get(ColorPaletteControl.BLOCK_CLASS)
		);

		const outerElem = document.createElement('div');
		outerElem.classList.add(
			ClassName.get(ColorPaletteControl.BLOCK_CLASS, 'outer')
		);
		this.elem_.appendChild(outerElem);

		const innerElem = document.createElement('div');
		innerElem.classList.add(
			ClassName.get(ColorPaletteControl.BLOCK_CLASS, 'inner')
		);
		outerElem.appendChild(innerElem);
		this.innerElem_ = innerElem;

		this.applyModel_();
	}

	applyModel_() {
		super.applyModel_();

		if (this.innerElem_ !== undefined) {
			const color = (new ColorDisplay()).display(
				this.getModel().getValue()
			);
			this.innerElem_.style.backgroundColor = color;
		}
	}
}

ColorPaletteControl.BLOCK_CLASS = 'cpc';

module.exports = ColorPaletteControl;
