const ColorFormatter = require('../../formatter/color_formatter');
const ClassName      = require('../../misc/class_name');
const Monitor        = require('./monitor');

class PaletteMonitor extends Monitor {
	constructor(property) {
		super(property);

		this.getElement().classList.add(
			ClassName.get(PaletteMonitor.BLOCK_CLASS)
		);

		const outerElem = document.createElement('div');
		outerElem.classList.add(
			ClassName.get(PaletteMonitor.BLOCK_CLASS, 'outer')
		);
		this.elem_.appendChild(outerElem);

		const innerElem = document.createElement('div');
		innerElem.classList.add(
			ClassName.get(PaletteMonitor.BLOCK_CLASS, 'inner')
		);
		outerElem.appendChild(innerElem);
		this.innerElem_ = innerElem;

		this.applyModel_();
	}

	applyModel_() {
		super.applyModel_();

		if (this.innerElem_ !== undefined) {
			const color = (new ColorFormatter()).format(
				this.getProperty().getModel().getValue()
			);
			this.innerElem_.style.backgroundColor = color;
		}
	}
}

PaletteMonitor.BLOCK_CLASS = 'plm';

module.exports = PaletteMonitor;
