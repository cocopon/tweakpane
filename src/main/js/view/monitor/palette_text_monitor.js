import ColorFormatter   from '../../formatter/color_formatter';
import ClassName        from '../../misc/class_name';
import CompositeMonitor from './composite_monitor';
import PaletteMonitor   from './palette_monitor';
import TextMonitor      from './text_monitor';

class PaletteTextMonitor extends CompositeMonitor {
	constructor(property) {
		super(property);

		this.getElement().classList.add(
			ClassName.get(PaletteTextMonitor.BLOCK_CLASS)
		);

		const paletteMonitor = new PaletteMonitor(property);
		paletteMonitor.getElement().classList.add(
			ClassName.get(
				PaletteMonitor.BLOCK_CLASS,
				null,
				PaletteTextMonitor.MODIFIER_CLASS
			)
		);
		this.addSubview(paletteMonitor);

		const textMonitor = new TextMonitor(property);
		textMonitor.setFormatter(new ColorFormatter());
		textMonitor.getElement().classList.add(
			ClassName.get(
				TextMonitor.BLOCK_CLASS,
				null,
				PaletteTextMonitor.MODIFIER_CLASS
			)
		);
		this.addSubview(textMonitor);
	}
}

PaletteTextMonitor.BLOCK_CLASS = 'ptm';
PaletteTextMonitor.MODIFIER_CLASS = 'pt';

module.exports = PaletteTextMonitor;
