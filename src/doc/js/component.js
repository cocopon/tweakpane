var params = {
	range: 10,
	power: 0.5,
	color: '#ff0000',
	size: 30
};

(function() {
	var pane = Tweakpane({
		foldable: false,
		container: document.getElementById('folderExample1')
	});

	var folder1 = pane.addFolder('Interaction');
	folder1.add(params, 'power');
	folder1.add(params, 'range');

	var folder2 = pane.addFolder('Appearance');
	folder2.add(params, 'color')
	folder2.add(params, 'size');
})();

(function() {
	var pane = Tweakpane({
		foldable: false,
		container: document.getElementById('folderExample2')
	});

	var folder1 = pane.addFolder('Interaction');
	folder1.add(params, 'power');
	folder1.add(params, 'range');
	folder1.close();

	var folder2 = pane.addFolder('Appearance');
	folder2.add(params, 'color')
	folder2.add(params, 'size');
})();

(function() {
	var params = {
		count: 0,
		'(log)': ''
	};
	var pane = Tweakpane({
		foldable: false,
		container: document.getElementById('buttonExample')
	});
	pane.addButton('Fire').on('click', function() {
		params['(log)'] = 'clicked: ' + String(++params.count);
	});
	pane.monitor(params, '(log)', {
		count: 10
	});
})();

(function() {
	var pane = Tweakpane({
		foldable: false,
		container: document.getElementById('separatorExample')
	});
	pane.addButton('Action');
	pane.addSeparator();
	pane.addButton('Import');
	pane.addButton('Export');
})();
