/* global Tweakpane */
var observable = {
  x: 0,
};

setInterval(function() {
  var progress = (Date.now() % 1000) / 1000;
  observable.x = Math.sin(progress * 2 * Math.PI);
}, 100);

var pane = new Tweakpane();
var folder = pane.addFolder('Graph');
folder.addGraph(observable, 'x', {
  label: 'sin',
  count: 50,
  min: -1.0,
  max: 1.0
});
