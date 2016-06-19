function prettifyJson(json) {
	return JSON.stringify(json)
		.replace(/\{/g, '{\n  ')
		.replace(/,/g, ',\n  ')
		.replace(/\}/g, '\n}');
}

function showJson(json) {
	var jsonString = prettifyJson(json);
	document.getElementById('exportArea').textContent = jsonString;
	document.getElementById('importArea').textContent = jsonString;
}

(function() {
	var params = {
		color: '#f80',
		size: 10,
		speed: 1.0
	};
	var pane = new Tweakpane({
		foldable: false,
		container: document.getElementById('exportExample')
	});
	pane.add(params, 'color');
	pane.add(params, 'size', {min: 1, max: 100});
	pane.add(params, 'speed', {min: 0.0, max: 1.0});

	pane.on('change', function() {
		showJson(pane.getJson());
	});

	showJson(pane.getJson());
})();

(function() {
	var params = {
		color: '#08f',
		size: 20,
		speed: 0.5
	};
	var pane = new Tweakpane({
		foldable: false,
		container: document.getElementById('importExample')
	});
	pane.addButton('Import').on('click', function() {
		var json = JSON.parse(document.getElementById('importArea').textContent);
		pane.setJson(json);
	});
	pane.addSeparator();
	pane.add(params, 'color');
	pane.add(params, 'size', {min: 1, max: 100});
	pane.add(params, 'speed', {min: 0.0, max: 1.0});
})();

(function() {
	var params1 = {
		speed: 0.3
	};
	var params2 = {
		speed: 0.7
	};
	var pane = new Tweakpane({
		foldable: false,
		container: document.getElementById('idExample')
	});
	pane.add(params1, 'speed', {
		id: 'target1_speed',
		min: 0.0,
		max: 1.0
	});
	pane.add(params2, 'speed', {
		id: 'target2_speed',
		min: 0.0,
		max: 1.0
	});

	pane.on('change', function() {
		document.getElementById('idArea').textContent = prettifyJson(pane.getJson());
	});
	document.getElementById('idArea').textContent = prettifyJson(pane.getJson());
})();
