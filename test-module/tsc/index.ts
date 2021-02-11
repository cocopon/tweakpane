import {JSDOM} from 'jsdom';
// Import default module
import Tweakpane from 'tweakpane';

const PARAMS = {
	foo: 1,
};

// Create pane
const doc = new JSDOM('').window.document;
const pane = new Tweakpane({
	document: doc,
});

// Add input
const input = pane.addInput(PARAMS, 'foo', {
	max: 1,
	min: 0,
	step: 1,
});
console.log(input);
