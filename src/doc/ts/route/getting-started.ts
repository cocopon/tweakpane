import {selectContainer} from '../util';

declare let Tweakpane: any;

export const GettingStartedRoute = {
	pathname: /^(\/tweakpane)?\/getting-started\.html$/,

	init: () => {
		const markerToFnMap: {
			[key: string]: (container: HTMLElement) => void;
		} = {
			hello: (container) => {
				new Tweakpane({
					container: container,
				});
			},
		};
		Object.keys(markerToFnMap).forEach((marker) => {
			const initFn = markerToFnMap[marker];
			const container = selectContainer(marker);
			initFn(container);
		});
	},
};
