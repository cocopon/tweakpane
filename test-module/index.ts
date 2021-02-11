import {JSDOM} from 'jsdom';

// Import the default module
import Tweakpane from 'tweakpane';

const PARAMS = {
	foo: 1,
};

// Creating a pane
const pane = new Tweakpane({
	document: (new JSDOM('')).window.document,
});

// Add an input
pane.addInput(PARAMS, 'foo', {
	max: 1,
	min: 0,
	step: 1,
});

console.log(pane);
