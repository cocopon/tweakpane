(function() {
	var params = {
		keyColor: '#00ff00'
	};

	var pane = new Tweakpane({
		foldable: false,
		container: document.getElementById('colorExample')
	});
	pane.add(params, 'keyColor');
})();
