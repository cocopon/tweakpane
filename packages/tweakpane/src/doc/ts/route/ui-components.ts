import {Pane} from 'tweakpane';

import {selectContainer} from '../util.js';

export function initUiComponents() {
	const markerToFnMap: {
		[key: string]: (container: HTMLElement) => void;
	} = {
		header: (container) => {
			const pane = new Pane({
				container: container,
				title: 'Root title',
			});
			const f = pane.addFolder({
				title: 'Folder',
			});
			f.addBinding({label: 0}, 'label');
			f.addBlade({view: 'separator'});
			f.addButton({
				title: 'Button',
			});
			const tab = pane.addTab({
				pages: [{title: 'Tab'}, {title: 'Tab'}],
			});
			tab.pages[0].addBinding({label: 0}, 'label');
			tab.pages[0].addButton({
				label: 'label',
				title: 'Button',
			});
			const sf = tab.pages[0].addFolder({
				title: 'Subfolder',
			});
			sf.addButton({
				title: 'Button',
			});
			tab.pages[1].addBinding({label: 0}, 'label');
			tab.pages[1].addBinding({label: 0}, 'label');
		},
		folder: (container) => {
			const PARAMS = {
				acceleration: 0,
				randomness: 0,
				speed: 0,
			};
			const pane = new Pane({
				container: container,
			});
			const f1 = pane.addFolder({
				title: 'Basic',
			});
			f1.addBinding(PARAMS, 'speed');
			const f2 = pane.addFolder({
				expanded: false,
				title: 'Advanced',
			});
			f2.addBinding(PARAMS, 'acceleration');
			f2.addBinding(PARAMS, 'randomness');
		},
		panetitle: (container) => {
			const PARAMS = {
				bounce: 0.5,
				gravity: 0.01,
				speed: 0.1,
			};
			const pane = new Pane({
				container: container,
				title: 'Parameters',
			});
			pane.addBinding(PARAMS, 'speed', {
				max: 1,
				min: 0,
			});
			const f = pane.addFolder({
				title: 'Advanced',
			});
			f.addBinding(PARAMS, 'gravity', {
				max: 1,
				min: 0,
			});
			f.addBinding(PARAMS, 'bounce', {
				max: 1,
				min: 0,
			});
		},
		button: (container) => {
			const PARAMS = {count: '0'};

			const consoleElem = selectContainer('button', true);
			const consolePane = new Pane({
				container: consoleElem,
			});
			consolePane.addBinding(PARAMS, 'count', {
				interval: 0,
				readonly: true,
			});

			const pane = new Pane({
				container: container,
			});
			pane
				.addButton({
					label: 'counter',
					title: 'Increment',
				})
				.on('click', () => {
					PARAMS.count = String(parseInt(PARAMS.count, 10) + 1);
					consolePane.refresh();
				});
		},
		tab: (container) => {
			const pane = new Pane({
				container: container,
			});
			const tab = pane.addTab({
				pages: [{title: 'Parameters'}, {title: 'Advanced'}],
			});
			tab.pages[0].addBinding({seed: 50}, 'seed');
			tab.pages[0].addBinding({freq: 0.5}, 'freq', {
				min: 0,
				max: 1,
			});
			tab.pages[1].addButton({
				label: 'danger!',
				title: 'Reset',
			});
		},
	};
	Object.keys(markerToFnMap).forEach((marker) => {
		const initFn = markerToFnMap[marker];
		const container = selectContainer(marker);
		initFn(container);
	});
}
