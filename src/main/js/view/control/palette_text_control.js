import ColorFormatter   from '../../formatter/color_formatter';
import ClassName        from '../../misc/class_name';
import CompositeControl from './composite_control';
import PaletteControl   from './palette_control';
import TextControl      from './text_control';

class PaletteTextControl extends CompositeControl {
	constructor(property) {
		super(property);

		this.getElement().classList.add(
			ClassName.get(PaletteTextControl.BLOCK_CLASS)
		);

		const prop = this.getProperty();
		const paletteControl = new PaletteControl(prop);
		paletteControl.getElement().classList.add(
			ClassName.get(
				PaletteControl.BLOCK_CLASS,
				null,
				PaletteTextControl.MODIFIER_CLASS
			)
		);
		this.addSubview(paletteControl);

		const textControl = new TextControl(prop);
		textControl.setFormatter(new ColorFormatter());
		textControl.getElement().classList.add(
			ClassName.get(
				TextControl.BLOCK_CLASS,
				null,
				PaletteTextControl.MODIFIER_CLASS
			)
		);
		this.addSubview(textControl);
	}
}

PaletteTextControl.BLOCK_CLASS = 'ptc';
PaletteTextControl.MODIFIER_CLASS = 'pt';

module.exports = PaletteTextControl;
