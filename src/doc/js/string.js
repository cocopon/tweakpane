(function() {
	var params = {
		name: 'cocopon',
	};
	var pane = new Tweakpane({
		foldable: false,
		container: document.getElementById('stringExample')
	});
	pane.addControl(params, 'name');
})();

(function() {
	var params = {
		direction: 'left',
		'(value)': ''
	};
	var pane = new Tweakpane({
		foldable: false,
		container: document.getElementById('listExample')
	});
	pane.addSelector(params, 'direction', {
		values: [
			'left',
			'up',
			'right',
			'down'
		]
	}).on('change', function(value) {
		params['(value)'] = value;
	});
	pane.addMonitor(params, '(value)');
})();

(function() {
	var params = {
		vimKey: 'H',
		'(value)': ''
	};
	var pane = new Tweakpane({
		foldable: false,
		container: document.getElementById('namedListExample')
	});
	pane.addSelector(params, 'vimKey', {
		values: {
			left:  'H',
			up:    'K',
			right: 'L',
			down:  'J'
		}
	}).on('change', function(value) {
		params['(value)'] = value;
	});
	pane.addMonitor(params, '(value)');
})();
