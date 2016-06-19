(function() {
	var params = {
		debug: true
	};
	var pane = new Tweakpane({
		foldable: false,
		container: document.getElementById('example')
	});
	pane.add(params, 'debug');
})();

(function() {
	var params = {
		debug: false,
		'(value)': ''
	};
	var pane = new Tweakpane({
		foldable: false,
		container: document.getElementById('listExample')
	});
	pane.add(params, 'debug', {
		list: ['Enabled', 'Disabled']
	}).on('change', function(value) {
		params['(value)'] = String(value);
	});
	pane.monitor(params, '(value)');
})();
