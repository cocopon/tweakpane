import {Pane} from 'tweakpane';

import * as PlaceholderPlugin from '../placeholder-plugin';
import {selectContainer, wave} from '../util';

export function initQuickTour() {
	const markerToFnMap: {
		[key: string]: (container: HTMLElement) => void;
	} = {
		blades: (container) => {
			const pane = new Pane({
				container: container,
			});
			pane.registerPlugin(PlaceholderPlugin);
			pane.addBlade({
				title: 'blade',
				view: 'placeholder',
			});
			pane.addBlade({
				title: 'blade',
				view: 'placeholder',
			});
			pane.addBlade({
				lineCount: 3,
				title: 'blade',
				view: 'placeholder',
			});
		},
		inputs: (container) => {
			const PARAMS = {
				factor: 123,
				title: 'hello',
				color: '#0f0',
			};
			const pane = new Pane({
				container: container,
			});
			pane.addInput(PARAMS, 'factor');
			pane.addInput(PARAMS, 'title');
			pane.addInput(PARAMS, 'color');
		},
		inputparams: (container) => {
			const PARAMS = {
				percentage: 50,
				theme: 'dark',
			};
			const pane = new Pane({
				container: container,
			});
			pane.addInput(PARAMS, 'percentage', {
				min: 0,
				max: 100,
				step: 10,
			});
			pane.addInput(PARAMS, 'theme', {
				options: {
					Dark: 'dark',
					Light: 'light',
				},
			});
		},
		folders: (container) => {
			const PARAMS = {
				factor: 123,
				text: 'hello',
				size: 16,
			};
			const pane = new Pane({
				container: container,
			});
			pane.addInput(PARAMS, 'factor');
			const f = pane.addFolder({
				title: 'Title',
				expanded: true,
			});
			f.addInput(PARAMS, 'text');
			f.addInput(PARAMS, 'size', {
				min: 8,
				max: 100,
				step: 1,
			});
		},
		title: (container) => {
			const PARAMS = {
				factor: 123,
				text: 'hello',
				size: 16,
			};
			const pane = new Pane({
				container: container,
				title: 'Parameters',
			});
			pane.addInput(PARAMS, 'factor');
			const f = pane.addFolder({
				title: 'Title',
				expanded: true,
			});
			f.addInput(PARAMS, 'text');
			f.addInput(PARAMS, 'size', {
				min: 8,
				max: 100,
				step: 1,
			});
		},
		events: (container) => {
			const consoleElem = selectContainer('eventsconsole');
			if (!consoleElem) {
				return;
			}

			const PARAMS = {
				log: '',
				size: 16,
			};

			const consolePane = new Pane({
				container: consoleElem,
			});
			consolePane.addMonitor(PARAMS, 'log', {
				bufferSize: 100,
				interval: 0,
				label: 'console',
				lineCount: 5,
			});

			const pane = new Pane({
				container: container,
			});
			pane
				.addInput(PARAMS, 'size', {
					min: 8,
					max: 100,
					step: 1,
				})
				.on('change', (ev) => {
					PARAMS.log = `change: ${ev.value}`;
					consolePane.refresh();
				});
		},
		preset: (container) => {
			const consoleElem = selectContainer('presetconsole');
			if (!consoleElem) {
				return;
			}

			const PARAMS = {
				factor: 50,
				title: 'hello',
				color: '#0f0',
				log: '',
			};

			const consolePane = new Pane({
				container: consoleElem,
			});
			consolePane.addMonitor(PARAMS, 'log', {
				interval: 0,
				label: 'preset',
				lineCount: 5,
				multiline: true,
			});

			const pane = new Pane({
				container: container,
			});
			pane.addInput(PARAMS, 'factor', {
				min: 0,
				max: 100,
				step: 1,
			});
			pane.addInput(PARAMS, 'title');
			pane.addInput(PARAMS, 'color');
			pane.addSeparator();
			pane
				.addButton({
					title: 'Export',
				})
				.on('click', () => {
					const preset = pane.exportPreset();
					PARAMS.log = JSON.stringify(preset, undefined, 2);
					consolePane.refresh();
				});
		},
		monitors: (container) => {
			const PARAMS = {
				signal: 0,
			};

			let t = 0;
			setInterval(() => {
				PARAMS.signal = wave(t);
				t += 1;
			}, 50);

			const pane = new Pane({
				container: container,
			});
			pane.addMonitor(PARAMS, 'signal', {
				view: 'graph',
				min: -1,
				max: +1,
			});
		},
	};
	Object.keys(markerToFnMap).forEach((marker) => {
		const initFn = markerToFnMap[marker];
		const container = selectContainer(marker);
		initFn(container);
	});
}
