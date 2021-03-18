import Tweakpane from 'tweakpane';

import {selectContainer} from '../util';

export function initPlugins() {
	const markerToFnMap: {
		[key: string]: (container: HTMLElement) => void;
	} = {
		interval: (container) => {
			const params = {
				log: '',
				size1: {min: 16, max: 48},
				size2: {min: 16, max: 48},
			};

			const consolePane = new Tweakpane({
				container: selectContainer('interval', true),
			});
			consolePane.addMonitor(params, 'log', {
				interval: 0,
				label: 'value',
				lineCount: 4,
				multiline: true,
			});

			const pane = new Tweakpane({
				container: container,
			});

			pane.addInput(params, 'size1');
			pane.addInput(params, 'size2', {
				min: 0,
				max: 100,
				step: 1,
			});
			pane.on('change', (ev) => {
				params.log = JSON.stringify(ev.value, undefined, 2);
				consolePane.refresh();
			});
		},

		camerakit: (container) => {
			const params = {
				flen: 55,
				fnum: 1.8,
				iso: 100,
			};
			const pane = new Tweakpane({
				container: container,
			});
			pane.addInput(params, 'flen', {
				plugin: 'camerakit',
				view: 'ring',
				series: 0,
			} as any);
			pane.addInput(params, 'fnum', {
				plugin: 'camerakit',
				view: 'ring',
				series: 1,
				unit: {
					ticks: 10,
					pixels: 40,
					value: 0.2,
				},
				wide: true,
				min: 1.4,
				step: 0.02,
			} as any);
			pane.addInput(params, 'flen', {
				plugin: 'camerakit',
				view: 'ring',
				series: 2,
			} as any);
			pane.addInput(params, 'iso', {
				plugin: 'camerakit',
				view: 'wheel',
				amount: 10,
				min: 100,
				step: 100,
			} as any);
		},
	};
	Object.keys(markerToFnMap).forEach((marker) => {
		const initFn = markerToFnMap[marker];
		const container = selectContainer(marker);
		initFn(container);
	});
}
