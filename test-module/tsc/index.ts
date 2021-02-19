import {JSDOM} from 'jsdom';
// Import default module
import Tweakpane from 'tweakpane';

const PARAMS = {
	num: 1,
	p2d: {x: 0, y: 0},
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
pane.addInput(PARAMS, 'p2d').on('change', (value: {x: number; y: number}) => {
	console.log(value);
});

console.log(pane);
