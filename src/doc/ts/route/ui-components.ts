import Tweakpane from 'tweakpane';

import {selectContainer} from '../util';

export function initUiComponents() {
	const markerToFnMap: {
		[key: string]: (container: HTMLElement) => void;
	} = {
		header: (container) => {
			const pane = new Tweakpane({
				container: container,
			});
			const f = pane.addFolder({
				title: 'Folder',
			});
			f.addButton({
				title: 'Button',
			});
			f.addSeparator();
			f.addButton({
				label: 'label',
				title: 'Button',
			});
			const sf = f.addFolder({
				title: 'Subfolder',
			});
			sf.addButton({
				title: 'Button',
			});
		},

		folder: (container) => {
			const PARAMS = {
				acceleration: 0,
				randomness: 0,
				speed: 0,
			};
			const pane = new Tweakpane({
				container: container,
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

		panetitle: (container) => {
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

		button: (container) => {
			const PARAMS = {count: '0'};

			const consoleElem = selectContainer('button', true);
			const consolePane = new Tweakpane({
				container: consoleElem,
			});
			consolePane.addMonitor(PARAMS, 'count', {
				interval: 0,
			});

			const pane = new Tweakpane({
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

		separator: (container) => {
			const pane = new Tweakpane({
				container: container,
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
	};
	Object.keys(markerToFnMap).forEach((marker) => {
		const initFn = markerToFnMap[marker];
		const container = selectContainer(marker);
		initFn(container);
	});
}
