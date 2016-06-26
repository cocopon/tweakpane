(function() {
	var params = {
		debug: true
	};
	var pane = new Tweakpane({
		foldable: false,
		container: document.getElementById('example')
	});
	pane.checkbox(params, 'debug');
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
	pane.selector(params, 'debug', {
		values: ['Enabled', 'Disabled']
	}).on('change', function(value) {
		params['(value)'] = String(value);
	});
	pane.monitor(params, '(value)');
})();
