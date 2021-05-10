import {Pane} from 'tweakpane';

import {selectContainer} from '../util';

export function initGettingStarted() {
	const markerToFnMap: {
		[key: string]: (container: HTMLElement) => void;
	} = {
		hello: (container) => {
			new Pane({
				container: container,
			});
		},
	};
	Object.keys(markerToFnMap).forEach((marker) => {
		const initFn = markerToFnMap[marker];
		const container = selectContainer(marker);
		initFn(container);
	});
}
