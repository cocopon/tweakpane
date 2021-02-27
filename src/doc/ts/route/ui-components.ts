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
			f.addButton({
				title: 'Button',
			});
			const sf = f.addFolder({
				title: 'Subfolder',
			});
			sf.addButton({
				title: 'Button',
			});
			sf.addButton({
				title: 'Button',
			});
			f.addSeparator();
			f.addButton({
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

		button: (container) => {
			const PARAMS = {count: '0'};
			const pane = new Tweakpane({
				container: container,
			});
			pane
				.addButton({
					title: 'Increment',
				})
				.on('click', () => {
					PARAMS.count = String(parseInt(PARAMS.count, 10) + 1);
					pane.refresh();
				});
			pane.addSeparator();
			pane.addMonitor(PARAMS, 'count', {
				interval: 0,
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
