(function () {
	'use strict';

	function isAmd() {
		return typeof window['define'] === 'function' && window['define'].amd;
	}

	var Tweakpane = require('./tweakpane');

	if (isAmd()) {
		window['define']('tweakpane', function() {
			return Tweakpane;
		});
	}
	else {
		window.Tweakpane = Tweakpane;
	}
})();
