import {Sketch} from '../sketch';
import {Environment} from '../sketch';
import * as Util from '../util';

declare let Tweakpane: any;

export const IndexRoute = {
	pathname: /^(\/tweakpane)?\/$/,

	init: () => {
		const ENV: Environment = {
			amp: {x: 0.1, y: 0.5},
			color: '#e4e4e7',
			freq: {
				x: 12.57,
				y: 6.28,
			},
			maxSize: 64,
			range: 0.8,
			spacing: 24,
			speed: 0.02,
			title: 'Tweakpane',
		};

		const PRESETS: {[key: string]: Environment} = {
			atmos: {
				amp: {x: 0.1, y: 0.53},
				color: '#e4e4e7',
				freq: {x: 45, y: 16},
				maxSize: 128,
				range: 0.79,
				spacing: 24,
				speed: 0.02,
				title: 'Tweakpane',
			},
			bubble: {
				amp: {x: 0.3, y: 0.51},
				color: '#ffffff',
				freq: {x: 64, y: 32},
				maxSize: 128,
				range: 0.65,
				spacing: 48,
				speed: 0.02,
				title: 'Tweakpane',
			},
			cloud: {
				amp: {x: 0.07, y: 0},
				color: '#e4e4e7',
				freq: {x: 22.25, y: 0},
				maxSize: 105,
				range: 0.63,
				spacing: 48,
				speed: 0.02,
				title: 'Tweakpane',
			},
		};

		const HIDDEN_PARAMS = {
			presetId: '',
			presetJson: '',
		};

		const sketchElem = document.querySelector('.pageHeader_sketchContainer');
		if (!sketchElem) {
			return;
		}
		const sketch = new Sketch(sketchElem, ENV);

		const markerToFnMap: {
			[key: string]: (container: HTMLElement) => void;
		} = {
			index: (container) => {
				const pane = new Tweakpane({
					container: container,
					title: 'Tweakpane',
				});
				pane.addInput(ENV, 'title').on('change', (value: string) => {
					const titleElem = document.querySelector('.pageHeader_title');
					if (titleElem) {
						titleElem.textContent = value;
					}
				});
				pane.addInput(ENV, 'color');
				pane.addSeparator();
				pane.addInput(ENV, 'spacing', {
					max: 48,
					min: 24,
				});
				pane.addInput(ENV, 'range', {
					max: 1,
					min: 0,
				});
				pane.addInput(ENV, 'maxSize', {
					max: 128,
					min: 5,
				});
				pane.addInput(ENV, 'freq', {
					x: {max: 64, min: 0},
					y: {max: 32, min: 0},
				});
				pane.addInput(ENV, 'amp', {
					x: {max: 0.3, min: 0},
					y: {max: 1, min: 0},
				});

				const pf = pane.addFolder({
					expanded: false,
					title: 'Preset',
				});
				pf.addInput(HIDDEN_PARAMS, 'presetId', {
					label: 'preset',
					options: {
						'Import...': '',

						Atmos: 'atmos',
						Bubble: 'bubble',
						Cloud: 'cloud',
					},
				}).on('change', (value: string) => {
					const preset = PRESETS[value];
					if (preset) {
						HIDDEN_PARAMS.presetId = '';
						pane.importPreset(preset);
					}
				});
				pf.addMonitor(HIDDEN_PARAMS, 'presetJson', {
					label: 'data',
					multiline: true,
				});

				pane.on('change', () => {
					sketch.reset();
					HIDDEN_PARAMS.presetJson = JSON.stringify(
						pane.exportPreset(),
						null,
						2,
					);
				});

				pane.on('fold', () => {
					sketch.resize();

					setTimeout(() => {
						sketch.resize();
					}, 200);
				});
			},
		};
		Object.keys(markerToFnMap).forEach((marker) => {
			const initFn = markerToFnMap[marker];
			const container = Util.selectContainer(marker);
			initFn(container);
		});

		sketch.resize();
	},
};
