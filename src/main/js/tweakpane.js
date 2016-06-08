const CoreInterface = require('./interface/core_interface');
const Core          = require('./core');

const Tweakpane = (opt_options) => {
	const core = new Core(opt_options);
	return new CoreInterface(core);
};

window.Tweakpane = Tweakpane;

module.exports = Tweakpane;
