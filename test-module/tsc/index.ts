import {JSDOM} from 'jsdom';
// Import default module
import Tweakpane from 'tweakpane';
import {
	TpChangeEvent,
	TpUpdateEvent,
} from 'tweakpane/dist/types/plugin/common/event/tp-event';

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
	.on('change', (ev: TpChangeEvent<number>) => {
		console.log(ev);
	});
pane.addInput(PARAMS, 'xy').on('change', (ev: TpChangeEvent<V2dObj>) => {
	console.log(ev);
});

// Add monitor
pane
	.addMonitor(PARAMS, 'num', {
		interval: 0,
	})
	.on('update', (ev: TpUpdateEvent<number>) => {
		console.log(ev);
	});
pane
	.addMonitor(PARAMS, 'text', {
		interval: 0,
	})
	.on('update', (ev: TpUpdateEvent<string>) => {
		console.log(ev);
	});

// Add folder
const f1 = pane.addFolder({
	title: 'folder',
});
f1.addInput(PARAMS, 'num').on('change', (ev: TpChangeEvent<number>) => {
	console.log(ev);
});
f1.addInput(PARAMS, 'xy').on('change', (ev: TpChangeEvent<V2dObj>) => {
	console.log(ev);
});
f1.addMonitor(PARAMS, 'num', {interval: 0}).on(
	'update',
	(ev: TpChangeEvent<number>) => {
		console.log(ev);
	},
);
f1.addMonitor(PARAMS, 'text', {interval: 0}).on(
	'update',
	(ev: TpChangeEvent<string>) => {
		console.log(ev);
	},
);

console.log(pane);
