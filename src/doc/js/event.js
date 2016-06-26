(function() {
	var params = {
		speed: 50,
		'(log)': ''
	};
	var pane = new Tweakpane({
		foldable: false,
		container: document.getElementById('eventExample')
	});
	pane.addSlider(params, 'speed', {
		min: 0,
		max: 100
	}).on('change', function(value) {
		params['(log)'] = String(value);
	});
	pane.addMonitor(params, '(log)', {
		count: 10
	});
})();

(function() {
	var params = {
		power: 50,
		size: 50,
		'(log)': ''
	};
	var pane = new Tweakpane({
		foldable: false,
		container: document.getElementById('globalEventExample')
	});
	pane.addSlider(params, 'power', {min: 0, max: 100});
	pane.addSlider(params, 'size', {min: 0, max: 100});
	pane.on('change', function(value, prop) {
		if (prop.getId() === '(log)') {
			// Prevent infinite loop
			return;
		}
		params['(log)'] = prop.getLabel() + ': ' + String(value);
	});
	pane.addMonitor(params, '(log)', {
		count: 10
	});
})();
