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
				rows: 3,
				title: 'blade',
				view: 'placeholder',
			});
		},
		inputs: (container) => {
			const PARAMS = {
				factor: 123,
				title: 'hello',
				color: '#ff0055',
			};
			const pane = new Pane({
				container: container,
			});
			pane.addBinding(PARAMS, 'factor');
			pane.addBinding(PARAMS, 'title');
			pane.addBinding(PARAMS, 'color');
		},
		inputparams: (container) => {
			const PARAMS = {
				percentage: 50,
				theme: 'dark',
			};
			const pane = new Pane({
				container: container,
			});
			pane.addBinding(PARAMS, 'percentage', {
				min: 0,
				max: 100,
				step: 10,
			});
			pane.addBinding(PARAMS, 'theme', {
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
			pane.addBinding(PARAMS, 'factor');
			const f = pane.addFolder({
				title: 'Title',
				expanded: true,
			});
			f.addBinding(PARAMS, 'text');
			f.addBinding(PARAMS, 'size', {
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
			pane.addBinding(PARAMS, 'factor');
			const f = pane.addFolder({
				title: 'Title',
				expanded: true,
			});
			f.addBinding(PARAMS, 'text');
			f.addBinding(PARAMS, 'size', {
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
			consolePane.addBinding(PARAMS, 'log', {
				bufferSize: 100,
				interval: 0,
				label: 'console',
				readonly: true,
				rows: 5,
			});

			const pane = new Pane({
				container: container,
			});
			pane
				.addBinding(PARAMS, 'size', {
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
				color: '#ff0055',
				log: '',
			};

			const consolePane = new Pane({
				container: consoleElem,
			});
			consolePane.addBinding(PARAMS, 'log', {
				interval: 0,
				label: 'preset',
				multiline: true,
				readonly: true,
				rows: 5,
			});

			const pane = new Pane({
				container: container,
			});
			pane.addBinding(PARAMS, 'factor', {
				min: 0,
				max: 100,
				step: 1,
			});
			pane.addBinding(PARAMS, 'title');
			pane.addBinding(PARAMS, 'color');
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
			pane.addBinding(PARAMS, 'signal', {
				min: -1,
				max: +1,
				readonly: true,
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
