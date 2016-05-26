var sketch = new Sketch(
	document.getElementById('bgSketch')
);
var sketchParams = sketch.getParameters();
var nigiri = sketch.getNigiri();
var neta = nigiri.getNeta();

var pane = Tweakpane({
	container: document.getElementById('tp')
});

var folder1 = pane.addFolder('Appearance');
folder1.add(sketchParams, 'neta', {
	list: [
		'hotate',
		'maguro',
		'salmon'
	]
}).on('change', function() {
	sketch.refreshNeta();
});

var folder2 = pane.addFolder('Physics');
folder2.add(sketchParams, 'gravity', {
	min: 0.1,
	max: 1.0
});
folder2.add(sketchParams, 'airResistance', {
	min: 0.01,
	max: 0.1
});
folder2.add(sketchParams, 'restitution', {
	min: 0.0,
	max: 0.9
});
folder2.addSeparator();
folder2.monitor(neta, 'z', {
	label: 'netaAlt',
	count: 140,
	graph: true,
	min: 0,
	max: 100
});
folder2.addSeparator();
folder2.addButton('Pop!').on('click', function() {
	nigiri.pop();
});

setInterval(function() {
	nigiri.pop();
}, 4000);
