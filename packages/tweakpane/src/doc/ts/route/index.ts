import {
	Color,
	colorFromString,
	colorToFunctionalRgbaString,
	mapRange,
} from '@tweakpane/core';
import {Pane} from 'tweakpane';

import {Sketch} from '../sketch';
import {Environment} from '../sketch';
import {selectContainer} from '../util';

const COLORS = {
	dark: 'hsl(200deg, 5%, 16%)',
	light: 'hsl(200deg, 7%, 90%)',
};

export function initIndex() {
	const ENV: Environment = {
		amp: {x: 0.1, y: 0.5},
		color: 'hsl(0deg, 0, 0)',
		freq: {
			x: 17,
			y: 6.3,
		},
		maxSize: 5,
		range: 0,
		spacing: 24,
		speed: 0.02,
		title: 'Tweakpane',
	};

	const PRESETS: {[key: string]: Environment} = {
		atmos: {
			amp: {x: 0.1, y: 0.53},
			color: '#cacbcd',
			freq: {x: 45, y: 16},
			maxSize: 128,
			range: 0.77,
			spacing: 24,
			speed: 0.02,
			title: 'Tweakpane',
		},
		bubble: {
			amp: {x: 0.3, y: 0.51},
			color: '#f2f2f2',
			freq: {x: 64, y: 32},
			maxSize: 128,
			range: 0.5,
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

	const updateBg = () => {
		const headerElem: HTMLElement | null =
			document.querySelector('.pageHeader');
		if (!headerElem) {
			return;
		}

		const [h, s, l] = colorFromString(ENV.color).getComponents('hsl');
		const bg = new Color([h + 30, s, l < 50 ? l - 4 : l + 5], 'hsl');
		headerElem.style.backgroundColor = colorToFunctionalRgbaString(bg);
	};

	const markerToFnMap: {
		[key: string]: (container: HTMLElement) => void;
	} = {
		index: (container) => {
			const pane = new Pane({
				container: container,
				title: 'Parameters',
			});
			pane.addInput(ENV, 'color').on('change', updateBg);
			pane.addInput(ENV, 'title').on('change', (ev) => {
				const titleElem = document.querySelector('.pageHeader_title');
				if (titleElem) {
					titleElem.textContent = ev.value;
				}
			});
			const tab = pane.addTab({
				pages: [{title: 'Layout'}, {title: 'Presets'}],
			});
			const p0 = tab.pages[0];
			p0.addInput(ENV, 'spacing', {
				max: 48,
				min: 24,
			});
			p0.addInput(ENV, 'range', {
				max: 1,
				min: 0,
			});
			p0.addInput(ENV, 'maxSize', {
				max: 128,
				min: 5,
			});
			p0.addInput(ENV, 'freq', {
				x: {max: 64, min: 0},
				y: {max: 32, min: 0},
			});
			p0.addInput(ENV, 'amp', {
				x: {max: 0.3, min: 0},
				y: {max: 1, min: 0},
			});

			const p1 = tab.pages[1];
			p1.addInput(HIDDEN_PARAMS, 'presetId', {
				label: 'preset',
				options: {
					'Import...': '',

					Atmos: 'atmos',
					Bubble: 'bubble',
					Cloud: 'cloud',
				},
			}).on('change', (ev) => {
				const preset = PRESETS[ev.value];
				if (preset) {
					HIDDEN_PARAMS.presetId = '';
					pane.importPreset(preset as any);
				}
			});
			p1.addMonitor(HIDDEN_PARAMS, 'presetJson', {
				label: 'data',
				lineCount: 4,
				multiline: true,
			});

			pane.on('change', () => {
				sketch.reset();
				HIDDEN_PARAMS.presetJson = JSON.stringify(pane.exportPreset(), null, 2);
			});

			pane.on('fold', () => {
				sketch.resize();

				setTimeout(() => {
					sketch.resize();
				}, 200);
			});

			let t = -0.2;
			const timerId = setInterval(() => {
				t = Math.min(t + 0.02, 1);
				if (t >= 1) {
					clearInterval(timerId);
				}

				const tz = Math.max(t, 0);
				const et = tz < 0.5 ? 2 * tz * tz : 1 - 2 * (1 - tz) * (1 - tz);
				ENV.range = mapRange(et, 0, 1, 0, 0.8);
				ENV.maxSize = mapRange(et, 0, 1, 5, 70);
				pane.refresh();
			}, 1000 / 30);

			const mm = window.matchMedia('(prefers-color-scheme: dark)');
			const applyScheme = () => {
				ENV.color = mm.matches ? COLORS.dark : COLORS.light;
				sketch.resize();
				pane.refresh();
			};
			mm.addEventListener('change', applyScheme);
			applyScheme();
		},
	};
	Object.keys(markerToFnMap).forEach((marker) => {
		const initFn = markerToFnMap[marker];
		const container = selectContainer(marker);
		initFn(container);
	});
}
