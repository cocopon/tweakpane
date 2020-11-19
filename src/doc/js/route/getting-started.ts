import * as Util from '../util';

declare let Tweakpane: any;

export const GettingStartedRoute = {
	pathname: /^(\/tweakpane)?\/getting-started\.html$/,

	init: () => {
		const markerToFnMap: {
			[key: string]: (container: HTMLElement | null) => void;
		} = {
			first: (container) => {
				const PARAMS = {speed: 0.5};
				const pane = new Tweakpane({
					container: container,
				});

				const updatePreset = () => {
					const elem = document.querySelector('*[data-first]');
					if (elem) {
						const preset = pane.exportPreset();
						elem.textContent =
							'PARAMS = ' + JSON.stringify(preset, null, 2) + ';';
					}
				};

				pane.addInput(PARAMS, 'speed').on('change', updatePreset);
				updatePreset();
			},
		};
		Object.keys(markerToFnMap).forEach((marker) => {
			const initFn = markerToFnMap[marker];
			const container = Util.selectContainer(marker);
			initFn(container);
		});
	},
};
