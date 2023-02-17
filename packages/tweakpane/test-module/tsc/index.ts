/* eslint-disable no-console */

import {TpChangeEvent} from '@tweakpane/core';
import {JSDOM} from 'jsdom';
import {Pane} from 'tweakpane';

interface V2dObj {
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
const pane = new Pane({
	document: doc,
});

// Add input
pane
	.addBinding(PARAMS, 'num', {
		max: 1,
		min: 0,
		step: 1,
	})
	.on('change', (ev: TpChangeEvent<number>) => {
		console.log(ev);
	});
pane.addBinding(PARAMS, 'xy').on('change', (ev: TpChangeEvent<V2dObj>) => {
	console.log(ev);
});

// Add monitor
pane
	.addBinding(PARAMS, 'num', {
		interval: 0,
		readonly: true,
	})
	.on('change', (ev: TpChangeEvent<number>) => {
		console.log(ev);
	});
pane
	.addBinding(PARAMS, 'text', {
		interval: 0,
		readonly: true,
	})
	.on('change', (ev: TpChangeEvent<string>) => {
		console.log(ev);
	});

// Add folder
const f1 = pane.addFolder({
	title: 'folder',
});
f1.addBinding(PARAMS, 'num').on('change', (ev: TpChangeEvent<number>) => {
	console.log(ev);
});
f1.addBinding(PARAMS, 'xy').on('change', (ev: TpChangeEvent<V2dObj>) => {
	console.log(ev);
});
f1.addBinding(PARAMS, 'num', {
	interval: 0,
	readonly: true,
}).on('change', (ev: TpChangeEvent<number>) => {
	console.log(ev);
});
f1.addBinding(PARAMS, 'text', {
	interval: 0,
	readonly: true,
}).on('change', (ev: TpChangeEvent<string>) => {
	console.log(ev);
});

console.log(pane);
