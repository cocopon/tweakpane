import {Pane} from 'tweakpane';

import {selectContainer, wave} from '../util';

export function initMisc() {
	const IMEX_PARAMS = {
		color: '#00ffd6',
		name: 'exported json',
		size: 10,
	};
	const IMEX_LOG = {
		log: '',
	};

	const markerToFnMap: {
		[key: string]: (container: HTMLElement) => void;
	} = {
		event: (container) => {
			const consoleElem = selectContainer('eventconsole');
			if (!consoleElem) {
				return;
			}

			const PARAMS = {
				log: '',
				value: 0,
			};

			const consolePane = new Pane({
				container: consoleElem,
			});
			consolePane.addBinding(PARAMS, 'log', {
				bufferSize: 10,
				interval: 0,
				label: 'console',
				readonly: true,
				rows: 5,
			});

			const pane = new Pane({
				container: container,
			});
			pane
				.addBinding(PARAMS, 'value', {
					max: 100,
					min: 0,
				})
				.on('change', (ev) => {
					PARAMS.log = ev.value.toFixed(2);
					consolePane.refresh();
					if (ev.last) {
						PARAMS.log = '(last)';
						consolePane.refresh();
					}
				});
		},

		globalevent: (container) => {
			const consoleElem = selectContainer('globaleventconsole');
			if (!consoleElem) {
				return;
			}

			const PARAMS = {
				boolean: true,
				color: '#ff0055',
				number: 0,
				point2d: {x: 0, y: 0},
				string: 'text',

				log: '',
			};

			const consolePane = new Pane({
				container: consoleElem,
			});
			consolePane.addBinding(PARAMS, 'log', {
				bufferSize: 10,
				interval: 0,
				label: 'console',
				readonly: true,
				rows: 5,
			});

			const pane = new Pane({
				container: container,
			});
			pane.addBinding(PARAMS, 'boolean');
			pane.addBinding(PARAMS, 'color');
			const f = pane.addFolder({
				title: 'Folder',
			});
			f.addBinding(PARAMS, 'number', {
				max: 100,
				min: 0,
			});
			f.addBinding(PARAMS, 'point2d');
			f.addBinding(PARAMS, 'string');
			pane.on('change', (ev) => {
				const v =
					typeof ev.value === 'number'
						? ev.value.toFixed(2)
						: JSON.stringify(ev.value);
				PARAMS.log = `changed: ${v}`;
				consolePane.refresh();
			});
		},

		export: (container) => {
			const consoleElem = selectContainer('exportconsole');
			if (!consoleElem) {
				return;
			}

			const consolePane = new Pane({
				container: consoleElem,
			});
			consolePane.addBinding(IMEX_LOG, 'log', {
				label: 'state',
				multiline: true,
				readonly: true,
				rows: 5,
			});

			const pane = new Pane({
				container: container,
				title: 'Values',
			});
			pane.addBinding(IMEX_PARAMS, 'name');
			pane.addBinding(IMEX_PARAMS, 'size', {
				max: 100,
				min: 0,
			});
			pane.addBinding(IMEX_PARAMS, 'color');

			const updateStateLog = () => {
				IMEX_LOG.log = JSON.stringify(pane.exportState(), null, 2);
			};

			pane.on('change', updateStateLog);
			updateStateLog();
		},

		import: (container) => {
			const consoleElem = selectContainer('importconsole');
			if (!consoleElem) {
				return;
			}

			const consolePane = new Pane({
				container: consoleElem,
			});
			consolePane.addBinding(IMEX_LOG, 'log', {
				label: 'state',
				multiline: true,
				readonly: true,
				rows: 5,
			});

			const PARAMS = {
				color: '#ff0055',
				log: '',
				name: 'Pane',
				size: 50,
			};
			const pane = new Pane({
				container: container,
			});
			const b = pane.addButton({
				label: 'state',
				title: 'Import',
			});
			const f = pane.addFolder({title: 'Values'});
			f.addBinding(PARAMS, 'name');
			f.addBinding(PARAMS, 'size');
			f.addBinding(PARAMS, 'color');

			b.on('click', () => {
				f.importState(JSON.parse(IMEX_LOG.log));
			});
		},

		label: (container) => {
			const PARAMS = {
				initSpd: 0,
				size: 30,
			};
			const pane = new Pane({
				container: container,
			});
			pane.addBinding(PARAMS, 'initSpd', {
				label: 'Initial speed',
			});
			pane.addBinding(PARAMS, 'size', {
				label: 'Force field\nradius',
			});
		},

		insert: (container) => {
			const pane = new Pane({
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
			const pane = new Pane({
				container: container,
			});

			const f = pane.addFolder({title: 'Advanced'});
			f.addBinding(PARAMS, 'seed');

			pane
				.addButton({
					index: 0,
					label: 'advanced',
					title: 'Toggle',
				})
				.on('click', () => {
					f.hidden = !f.hidden;
				});
		},

		disabled: (container) => {
			let wavet = 0;
			const PARAMS = {
				input: 1,
				monitor: 0,
			};
			setInterval(() => {
				PARAMS.monitor = wave(wavet);
				wavet += 1;
			}, 200);

			const pane = new Pane({
				container: container,
			});

			pane.addBlade({view: 'separator'});
			const i = pane.addBinding(PARAMS, 'input', {
				disabled: true,
			});
			const m = pane.addBinding(PARAMS, 'monitor', {
				disabled: true,
				readonly: true,
			});
			const btn = pane.addButton({
				disabled: true,
				title: 'Button',
			});
			pane
				.addButton({
					index: 0,
					label: 'disabled',
					title: 'Toggle',
				})
				.on('click', () => {
					i.disabled = !i.disabled;
					m.disabled = !m.disabled;
					btn.disabled = !btn.disabled;
				});
		},
	};
	Object.keys(markerToFnMap).forEach((marker) => {
		const initFn = markerToFnMap[marker];
		const container = selectContainer(marker);
		initFn(container);
	});
}
