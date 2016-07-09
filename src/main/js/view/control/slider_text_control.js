import ClassName            from '../../misc/class_name';
import CompositeControl     from './composite_control';
import SliderControl        from './slider_control';
import NumberTextControl    from './number_text_control';
import TextControl          from './text_control';

class SliderTextControl extends CompositeControl {
	constructor(property) {
		super(property);

		this.getElement().classList.add(
			ClassName.get(SliderTextControl.BLOCK_CLASS)
		);

		const prop = this.getProperty();
		const sliderControl = new SliderControl(prop);
		sliderControl.getElement().classList.add(
			ClassName.get(
				SliderControl.BLOCK_CLASS,
				null,
				SliderTextControl.MODIFIER_CLASS
			)
		);
		this.addSubview(sliderControl);

		const textControl = new NumberTextControl(prop);
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

export default SliderTextControl;
