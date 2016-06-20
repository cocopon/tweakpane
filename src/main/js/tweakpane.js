const Core = require('./core');

const Tweakpane = (opt_options) => {
	return new Core(opt_options);
};

window.Tweakpane = Tweakpane;

module.exports = Tweakpane;
