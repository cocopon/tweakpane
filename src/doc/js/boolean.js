(function() {
	var params = {
		debug: true
	};
	var pane = new Tweakpane({
		foldable: false,
		container: document.getElementById('example')
	});
	pane.addControl(params, 'debug');
})();

(function() {
	var params = {
		debug: false,
		'(value)': ''
	};
	var pane = new Tweakpane({
		foldable: false,
		container: document.getElementById('selectorExample')
	});
	pane.addSelector(params, 'debug', {
		values: ['Enabled', 'Disabled']
	}).on('change', function(value) {
		params['(value)'] = String(value);
	});
	pane.addMonitor(params, '(value)');
})();
