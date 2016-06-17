var dummy = {
	'TODO': 0
};
var pane = Tweakpane({
	foldable: false,
	container: document.getElementsByClassName('hero_paneContainer').item(0)
});

pane.add(dummy, 'TODO', {
	min: 0,
	max: 100,
});
