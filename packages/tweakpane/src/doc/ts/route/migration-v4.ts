import {Pane} from 'tweakpane';

import {selectContainer} from '../util';

export function initMigrationV4() {
	const PRESET_PARAMS = {
		color: '#ff0055',
		size: 16,
		text: 'text',
	};

	const markerToFnMap: {
		[key: string]: (container: HTMLElement) => void;
	} = {
		preset: (container) => {
			const consoleElem = selectContainer('presetconsole');
			if (!consoleElem) {
				return;
			}

			const LOG = {
				log: '',
			};
			const pane = new Pane({
				container: container,
			});
			pane.addBinding(PRESET_PARAMS, 'color');
			pane.addBinding(PRESET_PARAMS, 'size');
			pane.addBinding(PRESET_PARAMS, 'text');

			const consolePane = new Pane({
				container: consoleElem,
			});
			consolePane.addBinding(LOG, 'log', {
				interval: 0,
				label: 'preset',
				multiline: true,
				readonly: true,
				rows: 7,
			});

			const updateLog = () => {
				LOG.log = JSON.stringify(PRESET_PARAMS, undefined, '  ');
				consolePane.refresh();
			};

			pane.on('change', () => {
				updateLog();
			});
			updateLog();
		},
		state: (container) => {
			const consoleElem = selectContainer('stateconsole');
			if (!consoleElem) {
				return;
			}

			const LOG = {
				log: '',
			};
			const pane = new Pane({
				container: container,
			});
			pane.addBinding(PRESET_PARAMS, 'color');
			pane.addBinding(PRESET_PARAMS, 'size');
			pane.addBinding(PRESET_PARAMS, 'text');

			const consolePane = new Pane({
				container: consoleElem,
			});
			consolePane.addBinding(LOG, 'log', {
				interval: 0,
				label: 'state',
				multiline: true,
				readonly: true,
				rows: 7,
			});

			const updateLog = () => {
				LOG.log = JSON.stringify(pane.exportState(), undefined, '  ');
				consolePane.refresh();
			};

			pane.on('change', () => {
				updateLog();
			});
			updateLog();
		},
		tag: (container) => {
			const consoleElem = selectContainer('tagconsole');
			if (!consoleElem) {
				return;
			}

			const PARAMS = {speed: 0.5};
			const pane = new Pane({
				container: container,
			});
			pane.addBinding(PARAMS, 'speed', {
				tag: 'speed2',
			});

			const LOG = {
				log: '',
			};
			const consolePane = new Pane({
				container: consoleElem,
			});
			consolePane.addBinding(LOG, 'log', {
				interval: 0,
				label: 'state',
				multiline: true,
				readonly: true,
				rows: 7,
			});

			const updateLog = () => {
				LOG.log = JSON.stringify(
					pane.children[0].exportState(),
					undefined,
					'  ',
				);
				consolePane.refresh();
			};

			pane.on('change', () => {
				updateLog();
			});
			updateLog();
		},
	};
	Object.keys(markerToFnMap).forEach((marker) => {
		const initFn = markerToFnMap[marker];
		const container = selectContainer(marker);
		initFn(container);
	});
}
