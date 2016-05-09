var params = {
	easing: 2,
	color: '#00ff00',
	rotationAmount: 'str',
	speed: true,
	softness: 'foo',
	toothCount: false,
	shapeFactor: 4,
	param1: 2,
	param2: 'str'
};
var pane = Tweakpane();
pane.add(params, 'easing', {min: 0, max: 10});
pane.add(params, 'color');
pane.monitor(params, 'param1', {
	label: 'Very long long label'
});
pane.add(params, 'param2');
var fol1 = pane.addFolder('Motion');
fol1.add(params, 'rotationAmount');
fol1.add(params, 'speed');
var fol2 = pane.addFolder('Appearance');
fol2.add(params, 'softness', {
	list: ['foo', 'bar', 'baz']
});
fol2.add(params, 'toothCount');
fol2.add(params, 'shapeFactor');

var t = 0;
setInterval(function() {
	params.param1 = Math.sin(t * 2 * Math.PI) * 10;
	t = (t + 0.01) % 1.0;
}, 1000 / 30);
