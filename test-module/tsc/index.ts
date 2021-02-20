import {JSDOM} from 'jsdom';
// Import default module
import Tweakpane from 'tweakpane';

interface Vector2 {
	x: number;
	y: number;
}

const PARAMS = {
	num: 1,
	text: 'foobar',
	xy: {x: 0, y: 0},
};

// Create pane
const doc = new JSDOM('').window.document;
const pane = new Tweakpane({
	document: doc,
});

// Add input
pane
	.addInput(PARAMS, 'num', {
		max: 1,
		min: 0,
		step: 1,
	})
	.on('change', (value: number) => {
		console.log(value);
	});
pane.addInput(PARAMS, 'xy').on('change', (value: Vector2) => {
	console.log(value);
});

// Add monitor
pane
	.addMonitor(PARAMS, 'num', {
		interval: 0,
	})
	.on('update', (value: number) => {
		console.log(value);
	});
pane
	.addMonitor(PARAMS, 'text', {
		interval: 0,
	})
	.on('update', (value: string) => {
		console.log(value);
	});

// Add folder
const f1 = pane.addFolder({
	title: 'folder',
});
f1.addInput(PARAMS, 'num').on('change', (value: number) => {
	console.log(value);
});
f1.addInput(PARAMS, 'xy').on('change', (value: Vector2) => {
	console.log(value);
});
f1.addMonitor(PARAMS, 'num', {interval: 0}).on('update', (value: number) => {
	console.log(value);
});
f1.addMonitor(PARAMS, 'text', {interval: 0}).on('update', (value: string) => {
	console.log(value);
});

console.log(pane);
