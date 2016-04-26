const ColorDisplay        = require('../../display/color_display');
const ClassName           = require('../../misc/class_name');
const CompositeControl    = require('./composite_control');
const ColorPaletteControl = require('./color_palette_control');
const TextControl         = require('./text_control');

class ColorPaletteTextControl extends CompositeControl {
	constructor(model) {
		super(model);

		this.getElement().classList.add(
			ClassName.get(ColorPaletteTextControl.BLOCK_CLASS)
		);

		const paletteControl = new ColorPaletteControl(this.getModel());
		paletteControl.getElement().classList.add(
			ClassName.get(
				ColorPaletteControl.BLOCK_CLASS,
				null,
				ColorPaletteTextControl.MODIFIER_CLASS
			)
		);
		this.addSubview(paletteControl);

		const textControl = new TextControl(this.getModel());
		textControl.setDisplay(new ColorDisplay());
		textControl.getElement().classList.add(
			ClassName.get(
				TextControl.BLOCK_CLASS,
				null,
				ColorPaletteTextControl.MODIFIER_CLASS
			)
		);
		this.addSubview(textControl);
	}
}

ColorPaletteTextControl.BLOCK_CLASS = 'cptc';
ColorPaletteTextControl.MODIFIER_CLASS = 'cpt';

module.exports = ColorPaletteTextControl;
