// @flow

import * as Util from '../util';

declare var Tweakpane: any;

export default {
	pathname: /^(\/tweakpane)?\/misc.html$/,
	init() {
		const IMEX_PARAMS = {
			color: '#ff8000',
			name: 'export',
			size: 10,
		};

		const markerToFnMap = {
			misc(container) {
				const PARAMS = {value: 0};
				const pane = new Tweakpane({
					container,
					title: 'Global title',
				});
				pane.addInput(PARAMS, 'value', {
					label: 'custom label',
				});
				const f = pane.addFolder({
					title: 'Folder',
				});
				f.addButton({
					title: 'Button1',
				});
				f.addButton({
					title: 'Button2',
				});
				f.addSeparator();
				f.addButton({
					title: 'Button3',
				});
			},
			folder(container) {
				const PARAMS = {
					acceleration: 0,
					randomness: 0,
					speed: 0,
				};
				const pane = new Tweakpane({
					container,
				});
				const f1 = pane.addFolder({
					title: 'Basic',
				});
				f1.addInput(PARAMS, 'speed');
				const f2 = pane.addFolder({
					expanded: false,
					title: 'Advanced',
				});
				f2.addInput(PARAMS, 'acceleration');
				f2.addInput(PARAMS, 'randomness');
			},
			button(container) {
				const PARAMS = {count: 0};
				const pane = new Tweakpane({
					container,
				});
				pane.addButton({
					title: 'Increment',
				}).on('click', () => {
					PARAMS.count += 1;
				});
				pane.addSeparator();
				pane.addMonitor(PARAMS, 'count');
			},
			separator(container) {
				const pane = new Tweakpane({
					container,
				});
				pane.addButton({
					title: 'Previous',
				});
				pane.addButton({
					title: 'Next',
				});
				pane.addSeparator();
				pane.addButton({
					title: 'Reset',
				});
			},
			event(container) {
				const PARAMS = {
					log: '',
					value: 0,
				};
				const pane = new Tweakpane({
					container,
				});
				let m = null;
				pane.addInput(PARAMS, 'value', {
					max: 100,
					min: 0,
				}).on('change', (value) => {
					PARAMS.log = value.toFixed(2);
					if (m) {
						m.refresh();
					}
				});
				pane.addSeparator();
				m = pane.addMonitor(PARAMS, 'log', {
					count: 10,
					interval: 0,
					label: '(log)',
				});
			},
			globalEvent(container) {
				const PARAMS = {
					log: '',
					number: 0,
					string: 'text',
				};
				const pane = new Tweakpane({
					container,
				});
				pane.addInput(PARAMS, 'number', {
					max: 100,
					min: 0,
				});
				pane.addInput(PARAMS, 'string');
				pane.addSeparator();
				const m = pane.addMonitor(PARAMS, 'log', {
					count: 10,
					interval: 0,
					label: '(log)',
				});
				pane.on('change', (value) => {
					const v = (typeof value === 'number') ?
						value.toFixed(2) :
						value;
					PARAMS.log = `changed: ${v}`;
					m.refresh();
				});
			},
			export(container) {
				const pane = new Tweakpane({
					container,
				});
				pane.addInput(IMEX_PARAMS, 'name');
				pane.addInput(IMEX_PARAMS, 'size', {
					max: 100,
					min: 0,
				});
				pane.addInput(IMEX_PARAMS, 'color');

				const updatePreset = () => {
					const preset = pane.exportPreset();

					const elems = Array.prototype.slice.call(
						document.querySelectorAll('*[data-imex]'),
					);
					elems.forEach((elem) => {
						if (elem) {
							elem.textContent = JSON.stringify(preset, null, 2);
						}
					});
				};

				pane.on('change', updatePreset);
				updatePreset();
			},
			import(container) {
				const PARAMS = {
					color: '#0080ff',
					name: 'import',
					size: 50,
				};
				const pane = new Tweakpane({
					container,
				});
				pane.addButton({
					title: 'Import',
				}).on('click', () => {
					pane.importPreset(IMEX_PARAMS);
				});
				pane.addSeparator();
				pane.addInput(PARAMS, 'name');
				pane.addInput(PARAMS, 'size');
				pane.addInput(PARAMS, 'color');
			},
			presetKey(container) {
				const PARAMS1 = {speed: 1 / 3};
				const PARAMS2 = {speed: 2 / 3};
				const pane = new Tweakpane({
					container,
				});
				pane.addInput(PARAMS1, 'speed', {
					max: 1,
					min: 0,
				});
				pane.addInput(PARAMS2, 'speed', {
					max: 1,
					min: 0,
					presetKey: 'speed2',
				});

				const updatePreset = () => {
					const elem = document.querySelector('*[data-presetKey]');
					if (elem) {
						const preset = pane.exportPreset();
						elem.textContent = JSON.stringify(preset, null, 2);
					}
				};

				pane.on('change', updatePreset);
				updatePreset();
			},
			rootTitle(container) {
				const PARAMS = {
					bounce: 0.5,
					gravity: 0.01,
					speed: 0.1,
				};
				const pane = new Tweakpane({
					container,
					title: 'Parameters',
				});
				pane.addInput(PARAMS, 'speed', {
					max: 1,
					min: 0,
				});
				const f = pane.addFolder({
					title: 'Advanced',
				});
				f.addInput(PARAMS, 'gravity', {
					max: 1,
					min: 0,
				});
				f.addInput(PARAMS, 'bounce', {
					max: 1,
					min: 0,
				});
			},
			label(container) {
				const PARAMS = {initSpd: 0};
				const pane = new Tweakpane({
					container,
				});
				pane.addInput(PARAMS, 'initSpd', {
					label: 'Initial speed',
				});
			},
		};
		Object.keys(markerToFnMap).forEach((marker) => {
			const initFn = markerToFnMap[marker];
			const container = Util.selectContainer(marker);
			initFn(container);
		});
	},
};
