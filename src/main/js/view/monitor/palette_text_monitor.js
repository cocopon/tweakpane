const ColorFormatter   = require('../../formatter/color_formatter');
const ClassName        = require('../../misc/class_name');
const CompositeMonitor = require('./composite_monitor');
const PaletteMonitor   = require('./palette_monitor');
const TextMonitor      = require('./text_monitor');

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
