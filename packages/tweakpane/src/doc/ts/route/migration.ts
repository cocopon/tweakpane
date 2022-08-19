import * as Dat from 'dat.gui';
import {Pane} from 'tweakpane';

import {selectContainer, wave} from '../util';

export function initMigration() {
	const SHARED_PARAMS = {
		active: true,
		alert: () => {
			alert('Button pressed!');
		},
		color: '#ff0055',
		level: 0,
		name: 'Sketch',
		size: 16,
		wave: 0,
		weight: 400,
	};

	let wavet = 0;
	setInterval(() => {
		SHARED_PARAMS.wave = wave(wavet);
		wavet += 1;
	}, 50);

	const markerToFnMap: {
		[key: string]: (container: HTMLElement) => void;
	} = {
		dat: (container) => {
			const gui = new Dat.GUI({
				autoPlace: false,
			});
			container.appendChild(gui.domElement);

			gui.remember(SHARED_PARAMS);
			((f) => {
				f.add(SHARED_PARAMS, 'size').min(10).max(100).step(1);
				f.add(SHARED_PARAMS, 'weight', {Normal: 400, Bold: 700});
				f.add(SHARED_PARAMS, 'name');
				f.add(SHARED_PARAMS, 'active');
				f.addColor(SHARED_PARAMS, 'color');
				f.add(SHARED_PARAMS, 'alert');
				f.open();
			})(gui.addFolder('dat.GUI'));
		},
		tp: (container) => {
			const pane = new Pane({
				container: container,
				title: 'Tweakpane',
			});
			pane.addInput(SHARED_PARAMS, 'size', {min: 10, max: 100, step: 1});
			pane.addInput(SHARED_PARAMS, 'weight', {
				options: {Normal: 400, Bold: 700},
			});
			pane.addSeparator();
			pane.addInput(SHARED_PARAMS, 'name');
			pane.addInput(SHARED_PARAMS, 'active');
			pane.addInput(SHARED_PARAMS, 'color');
			pane.addButton({title: 'Alert'}).on('click', SHARED_PARAMS.alert);
			const tab = pane.addTab({
				pages: [{title: 'Basic'}, {title: 'Advanced'}],
			});
			((t) => {
				t.addInput({offset: {x: 0, y: 0}}, 'offset');
			})(tab.pages[0]);
			((t) => {
				t.addInput({point3d: {x: 0, y: 0, z: 0}}, 'point3d');
				t.addInput({point4d: {w: 0, x: 0, y: 0, z: 0}}, 'point4d');
			})(tab.pages[1]);
		},
		basicsdat: (container) => {
			const gui = new Dat.GUI({
				autoPlace: false,
			});
			container.appendChild(gui.domElement);
			gui.add(SHARED_PARAMS, 'level');
			gui.add(SHARED_PARAMS, 'name');
			gui.add(SHARED_PARAMS, 'active');
		},
		basicstp: (container) => {
			const pane = new Pane({
				container: container,
				title: 'Parameters',
			});
			pane.addInput(SHARED_PARAMS, 'level');
			pane.addInput(SHARED_PARAMS, 'name');
			pane.addInput(SHARED_PARAMS, 'active');
		},
		constraintsdat: (container) => {
			const gui = new Dat.GUI({
				autoPlace: false,
			});
			container.appendChild(gui.domElement);
			gui.add(SHARED_PARAMS, 'size').min(10).max(100).step(1);
			gui.add(SHARED_PARAMS, 'weight', {
				Normal: 400,
				Bold: 700,
			});
		},
		constraintstp: (container) => {
			const pane = new Pane({
				container: container,
				title: 'Parameters',
			});
			pane.addInput(SHARED_PARAMS, 'size', {
				min: 10,
				max: 100,
				step: 1,
			});
			pane.addInput(SHARED_PARAMS, 'weight', {
				options: {
					Normal: 400,
					Bold: 700,
				},
			});
		},
		colordat: (container) => {
			const gui = new Dat.GUI({
				autoPlace: false,
			});
			container.appendChild(gui.domElement);
			gui.addColor(SHARED_PARAMS, 'color');
		},
		colortp: (container) => {
			const pane = new Pane({
				container: container,
				title: 'Parameters',
			});
			pane.addInput(SHARED_PARAMS, 'color');
		},
		foldersdat: (container) => {
			const gui = new Dat.GUI({
				autoPlace: false,
			});
			container.appendChild(gui.domElement);
			gui.add(SHARED_PARAMS, 'name');
			((f) => {
				f.add(SHARED_PARAMS, 'size').min(10).max(100).step(1);
				f.add(SHARED_PARAMS, 'weight', {Normal: 400, Bold: 700});
				f.open();
			})(gui.addFolder('Font'));
		},
		folderstp: (container) => {
			const pane = new Pane({
				container: container,
				title: 'Parameters',
			});
			pane.addInput(SHARED_PARAMS, 'name');
			((f) => {
				f.addInput(SHARED_PARAMS, 'size', {min: 10, max: 100, step: 1});
				f.addInput(SHARED_PARAMS, 'weight', {
					options: {Normal: 400, Bold: 700},
				});
			})(pane.addFolder({title: 'Font'}));
		},
		buttonsdat: (container) => {
			const gui = new Dat.GUI({
				autoPlace: false,
			});
			container.appendChild(gui.domElement);
			gui.add(SHARED_PARAMS, 'alert');
		},
		buttonstp: (container) => {
			const pane = new Pane({
				container: container,
				title: 'Parameters',
			});
			pane.addButton({title: 'Alert'}).on('click', SHARED_PARAMS.alert);
		},
		eventsdat: (container) => {
			const consoleElem = selectContainer('eventsdatconsole');
			if (!consoleElem) {
				return;
			}

			const CONSOLE = {log: ''};
			const consolePane = new Pane({
				container: consoleElem,
			});
			consolePane.addMonitor(CONSOLE, 'log', {
				bufferSize: 10,
				interval: 0,
				label: 'console',
				lineCount: 5,
			});

			const gui = new Dat.GUI({
				autoPlace: false,
			});
			container.appendChild(gui.domElement);
			gui
				.add(SHARED_PARAMS, 'size')
				.min(10)
				.max(100)
				.step(1)
				.onChange((v) => {
					CONSOLE.log = `${v}`;
					consolePane.refresh();
				})
				.onFinishChange((v) => {
					CONSOLE.log = `${v} (last)`;
					consolePane.refresh();
				});
		},
		eventstp: (container) => {
			const consoleElem = selectContainer('eventstpconsole');
			if (!consoleElem) {
				return;
			}

			const CONSOLE = {log: ''};
			const consolePane = new Pane({
				container: consoleElem,
			});
			consolePane.addMonitor(CONSOLE, 'log', {
				bufferSize: 10,
				interval: 0,
				label: 'console',
				lineCount: 5,
			});

			const pane = new Pane({
				container: container,
				title: 'Parameters',
			});
			pane
				.addInput(SHARED_PARAMS, 'size', {
					min: 10,
					max: 100,
					step: 1,
				})
				.on('change', (ev) => {
					if (ev.last) {
						CONSOLE.log = `${ev.value} (last)`;
					} else {
						CONSOLE.log = `${ev.value}`;
					}
					consolePane.refresh();
				});
		},
		monitordat: (container) => {
			const gui = new Dat.GUI({
				autoPlace: false,
			});
			container.appendChild(gui.domElement);
			gui
				.add(SHARED_PARAMS, 'wave')
				.min(-1)
				.max(+1)
				.listen();
		},
		monitortp: (container) => {
			const pane = new Pane({
				container: container,
				title: 'Parameters',
			});
			pane.addMonitor(SHARED_PARAMS, 'wave', {
				max: +1,
				min: -1,
				view: 'graph',
			});
		},
		refreshdat: (container) => {
			const gui = new Dat.GUI({
				autoPlace: false,
			});
			container.appendChild(gui.domElement);
			gui
				.add(SHARED_PARAMS, 'wave')
				.min(-1)
				.max(+1);

			setInterval(() => {
				gui.__controllers.forEach((c) => {
					c.updateDisplay();
				});
			}, 1000);
		},
		refreshtp: (container) => {
			const pane = new Pane({
				container: container,
				title: 'Parameters',
			});
			pane.addInput(SHARED_PARAMS, 'wave', {
				max: +1,
				min: -1,
			});

			setInterval(() => {
				pane.refresh();
			}, 1000);
		},
	};
	Object.keys(markerToFnMap).forEach((marker) => {
		const initFn = markerToFnMap[marker];
		const container = selectContainer(marker);
		initFn(container);
	});
}
