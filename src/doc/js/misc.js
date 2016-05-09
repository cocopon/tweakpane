(function() {
	var params = {
		initSpeed: 0.38
	};
	var pane = Tweakpane({
		foldable: false,
		container: document.getElementById('labelExample')
	});
	pane.add(params, 'initSpeed', {
		label: 'Initial speed',
		min: 0.0,
		max: 1.0
	});
})();
