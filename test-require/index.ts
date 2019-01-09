import {JSDOM} from 'jsdom';
import Tweakpane from 'tweakpane';

const PARAMS = {
	foo: 1,
};
const pane = new Tweakpane({
	document: (new JSDOM('')).window.document,
});
pane.addInput(PARAMS, 'foo', {
	max: 1,
	min: 0,
	step: 1,
});
console.log(pane);
