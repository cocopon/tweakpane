// @flow

import Sketch from '../sketch';
import * as Util from '../util';

import type {Environment} from '../sketch';

declare var Tweakpane: any;

export default {
	pathname: '/',
	init() {
		const ENV: Environment = {
			color: '#e4e4e7',
			maxSize: 64,
			range: 0.8,
			spacing: 24,
			speed: 0.02,
			title: 'Tweakpane',
			xamp: 0.1,
			xfreq: 2 * Math.PI * 2,
			yamp: 0.5,
			yfreq: 2 * Math.PI,
		};

		const PRESETS: {[string]: Environment} = {
			atmos: {
				color: '#e4e4e7',
				maxSize: 128,
				range: 0.7934782608695652,
				spacing: 24,
				speed: 0.02,
				title: 'Tweakpane',
				xamp: 0.10434782608695652,
				xfreq: 45,
				yamp: 0.53,
				yfreq: 16,
			},
			bubble: {
				color: '#ffffff',
				maxSize: 128,
				range: 0.65,
				spacing: 48,
				speed: 0.02,
				title: 'Tweakpane',
				xamp: 0.3,
				xfreq: 64,
				yamp: 0.51,
				yfreq: 32,
			},
			cloud: {
				color: '#e4e4e7',
				maxSize: 105,
				range: 0.63,
				spacing: 48,
				speed: 0.02,
				title: 'Tweakpane',
				xamp: 0.07,
				xfreq: 22.25,
				yamp: 0,
				yfreq: 0,
			},
		};

		const HIDDEN_PARAMS = {
			presetId: '',
			presetJson: '',
		};

		const sketchElem = document.querySelector('.common-pageHeader_sketchContainer');
		if (!sketchElem) {
			return;
		}
		const sketch = new Sketch(sketchElem, ENV);

		const markerToFnMap = {
			index(container) {
				const pane = new Tweakpane({
					container,
					title: 'Tweakpane',
				});
				pane.addInput(ENV, 'title').on('change', (value: string) => {
					const titleElem = document.querySelector('.common-pageHeader_title');
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

				const xf = pane.addFolder({
					expanded: false,
					title: 'X',
				});
				xf.addInput(ENV, 'xfreq', {
					max: 64,
					min: 0,
				});
				xf.addInput(ENV, 'xamp', {
					max: 0.3,
					min: 0,
				});

				const yf = pane.addFolder({
					expanded: false,
					title: 'Y',
				});
				yf.addInput(ENV, 'yfreq', {
					max: 32,
					min: 0,
				});
				yf.addInput(ENV, 'yamp', {
					max: 1,
					min: 0,
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
						pane.exportPreset(), null, 2,
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
