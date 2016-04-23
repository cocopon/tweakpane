const ClassName         = require('../../misc/class_name');
const CompositeControl  = require('./composite_control');
const SliderControl     = require('./slider_control');
const NumberTextControl = require('./number_text_control');
const TextControl       = require('./text_control');

class SliderTextControl extends CompositeControl {
	constructor(model) {
		super(model);

		this.getElement().classList.add(
			ClassName.get(SliderTextControl.BLOCK_CLASS)
		);

		const sliderControl = new SliderControl(this.getModel());
		sliderControl.getElement().classList.add(
			ClassName.get(
				SliderControl.BLOCK_CLASS,
				null,
				SliderTextControl.MODIFIER_CLASS
			)
		);
		this.addSubview(sliderControl);

		const textControl = new NumberTextControl(this.getModel());
		textControl.getElement().classList.add(
			ClassName.get(
				TextControl.BLOCK_CLASS,
				null,
				SliderTextControl.MODIFIER_CLASS
			)
		);
		this.addSubview(textControl);
	}
}

SliderTextControl.BLOCK_CLASS = 'stc';
SliderTextControl.MODIFIER_CLASS = 'st';

module.exports = SliderTextControl;
