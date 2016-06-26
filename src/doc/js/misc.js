(function() {
	var params = {
		initSpeed: 0.38
	};
	var pane = new Tweakpane({
		foldable: false,
		container: document.getElementById('labelExample')
	});
	pane.slider(params, 'initSpeed', {
		label: 'Initial speed',
		min: 0.0,
		max: 1.0
	});
})();
