import Tweakpane from 'tweakpane';

import {selectContainer} from '../util';

export function initPlugin() {
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
	};
	Object.keys(markerToFnMap).forEach((marker) => {
		const initFn = markerToFnMap[marker];
		const container = selectContainer(marker);
		initFn(container);
	});
}
