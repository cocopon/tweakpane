import {Pane} from 'tweakpane';

import {selectContainer, wave} from '../util';

export function initMonitorBindings() {
	const SHARED_PARAMS = {
		positive: false,
		time: '',
		wave: 0,
	};

	const updateTime = () => {
		const matches = String(new Date()).match(/\d{2}:\d{2}:\d{2}/);
		SHARED_PARAMS.time = (matches && matches[0]) || '';
	};
	setInterval(updateTime, 1000);
	updateTime();

	let wavet = 0;
	setInterval(() => {
		SHARED_PARAMS.wave = wave(wavet);
		SHARED_PARAMS.positive = SHARED_PARAMS.wave >= 0;
		wavet += 1;
	}, 50);

	const markerToFnMap: {
		[key: string]: (container: HTMLElement) => void;
	} = {
		monitor: (container) => {
			const pane = new Pane({
				container: container,
			});
			const nf = pane.addFolder({
				title: 'Number',
			});
			nf.addMonitor(SHARED_PARAMS, 'wave', {
				label: 'text',
			});
			nf.addMonitor(SHARED_PARAMS, 'wave', {
				bufferSize: 10,
				label: 'multiline',
			});
			nf.addMonitor(SHARED_PARAMS, 'wave', {
				label: 'graph',
				max: +1,
				min: -1,
				view: 'graph',
			});
			const bf = pane.addFolder({
				title: 'Boolean',
			});
			bf.addMonitor(SHARED_PARAMS, 'positive', {
				label: 'positive',
			});
		},
		multiline: (container) => {
			const PARAMS = {params: ''};
			const pane = new Pane({
				container: container,
			});
			pane
				.addMonitor(PARAMS, 'params', {
					lineCount: 5,
					multiline: true,
				})
				.on('update', () => {
					PARAMS.params = JSON.stringify(SHARED_PARAMS, null, 2);
				});
		},

		buffersize: (container) => {
			const pane = new Pane({
				container: container,
			});
			pane.addMonitor(SHARED_PARAMS, 'wave', {
				bufferSize: 10,
			});
		},

		interval: (container) => {
			const pane = new Pane({
				container: container,
			});
			pane.addMonitor(SHARED_PARAMS, 'time', {
				interval: 1000,
			});
		},

		graph: (container) => {
			const pane = new Pane({
				container: container,
			});
			pane.addMonitor(SHARED_PARAMS, 'wave', {
				max: +1,
				min: -1,
				view: 'graph',
			});
		},
	};
	Object.keys(markerToFnMap).forEach((marker) => {
		const initFn = markerToFnMap[marker];
		const container = selectContainer(marker);
		initFn(container);
	});
}
