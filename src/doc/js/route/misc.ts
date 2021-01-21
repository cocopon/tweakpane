import * as Util from '../util';

declare let Tweakpane: any;

export const MiscRoute = {
	pathname: /^(\/tweakpane)?\/misc\.html$/,

	init: () => {
		const IMEX_PARAMS = {
			color: '#ff8000',
			name: 'export',
			size: 10,
		};
		const IMEX_LOG = {
			log: '',
		};

		const markerToFnMap: {
			[key: string]: (container: HTMLElement | null) => void;
		} = {
			misc: (container) => {
				const PARAMS = {value: 0};
				const pane = new Tweakpane({
					container: container,
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

			event: (container) => {
				const PARAMS = {
					log: '',
					value: 0,
				};
				const pane = new Tweakpane({
					container: container,
				});
				let m: any = null;
				pane
					.addInput(PARAMS, 'value', {
						max: 100,
						min: 0,
					})
					.on('change', (value: number) => {
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

			globalEvent: (container) => {
				const PARAMS = {
					boolean: true,
					color: '#0080ff',
					number: 0,
					string: 'text',

					log: '',
				};
				const pane = new Tweakpane({
					container: container,
				});
				pane.addInput(PARAMS, 'boolean');
				pane.addInput(PARAMS, 'color');
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
				pane.on('change', (value: number | string) => {
					const v = typeof value === 'number' ? value.toFixed(2) : value;
					PARAMS.log = `changed: ${v}`;
					m.refresh();
				});
			},

			export: (container) => {
				const pane = new Tweakpane({
					container: container,
				});
				pane.addInput(IMEX_PARAMS, 'name');
				pane.addInput(IMEX_PARAMS, 'size', {
					max: 100,
					min: 0,
				});
				pane.addInput(IMEX_PARAMS, 'color');
				pane.addSeparator();
				pane.addMonitor(IMEX_LOG, 'log', {
					label: '(preset)',
					multiline: true,
				});

				const updatePreset = () => {
					const preset = pane.exportPreset();
					IMEX_LOG.log = JSON.stringify(preset, null, 2);
				};

				pane.on('change', updatePreset);
				updatePreset();
			},

			import: (container) => {
				const PARAMS = {
					color: '#0080ff',
					log: '',
					name: 'import',
					size: 50,
				};
				const pane = new Tweakpane({
					container: container,
				});
				pane.addMonitor(IMEX_LOG, 'log', {
					label: '(preset)',
					multiline: true,
				});
				pane
					.addButton({
						title: 'Import',
					})
					.on('click', () => {
						pane.importPreset(IMEX_PARAMS);
					});
				pane.addSeparator();
				pane.addInput(PARAMS, 'name');
				pane.addInput(PARAMS, 'size');
				pane.addInput(PARAMS, 'color');
			},

			presetKey: (container) => {
				const PARAMS = {
					foo: {speed: 1 / 3},
					bar: {speed: 2 / 3},
					preset: '',
				};
				const pane = new Tweakpane({
					container: container,
				});
				pane.addInput(PARAMS.foo, 'speed', {
					max: 1,
					min: 0,
				});
				pane.addInput(PARAMS.bar, 'speed', {
					max: 1,
					min: 0,
					presetKey: 'speed2',
				});
				pane.addSeparator();
				const m = pane.addMonitor(PARAMS, 'preset', {
					interval: 0,
					label: '(preset)',
					multiline: true,
				});

				const updatePreset = () => {
					const preset = pane.exportPreset();
					PARAMS.preset = JSON.stringify(preset, null, 2);
					m.refresh();
				};

				pane.on('change', updatePreset);
				updatePreset();
			},

			rootTitle: (container) => {
				const PARAMS = {
					bounce: 0.5,
					gravity: 0.01,
					speed: 0.1,
				};
				const pane = new Tweakpane({
					container: container,
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

			label: (container) => {
				const PARAMS = {
					initSpd: 0,
					size: 30,
				};
				const pane = new Tweakpane({
					container: container,
				});
				pane.addInput(PARAMS, 'initSpd', {
					label: 'Initial speed',
				});
				pane.addInput(PARAMS, 'size', {
					label: 'Force field\nradius',
				});
			},

			insert: (container) => {
				const pane = new Tweakpane({
					container: container,
				});
				pane.addButton({title: 'Run'});
				pane.addButton({title: 'Stop'});
				pane.addButton({title: '**Reset**', index: 1});
			},

			hidden: (container) => {
				const PARAMS = {
					seed: 0.1,
				};
				const pane = new Tweakpane({
					container: container,
				});

				const f = pane.addFolder({title: 'Advanced'});
				f.addInput(PARAMS, 'seed');

				pane
					.addButton({
						index: 0,
						title: 'Toggle',
					})
					.on('click', () => {
						f.hidden = !f.hidden;
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
