var sketch = new SushiSketch(
	document.getElementById('sushiSketch')
);
var sketchParams = sketch.getParameters();

var pane = new Tweakpane({
	container: document.getElementById('tp')
});

var folder1 = pane.addFolder('Appearance');
folder1.addSelector(sketchParams, 'neta', {
	values: [
		'hotate',
		'maguro',
		'salmon'
	]
}).on('change', function() {
	sketch.refreshNeta();
});

var folder2 = pane.addFolder('Physics');
folder2.addSlider(sketchParams, 'gravity', {
	min: 0.1,
	max: 1.0
});
folder2.addSlider(sketchParams, 'airResistance', {
	min: 0.01,
	max: 0.1
});
folder2.addSlider(sketchParams, 'restitution', {
	min: 0.0,
	max: 0.9
});
folder2.addSeparator();
folder2.addGraph(sketchParams, 'netaAlt', {
	count: 140,
	min: 0,
	max: 100
});
folder2.addSeparator();
folder2.addButton('Pop!').on('click', function() {
	sketch.pop();
});

setInterval(function() {
	sketch.pop();
}, 4000);
