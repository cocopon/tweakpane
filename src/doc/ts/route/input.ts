import Tweakpane from 'tweakpane';

import {selectContainer} from '../util';

export function initInput() {
	const markerToFnMap: {
		[key: string]: (container: HTMLElement) => void;
	} = {
		input: (container) => {
			const PARAMS = {
				b: true,
				c: '#ff8800',
				n: 50,
				v2: {x: 12, y: 34},
				v3: {x: 12, y: 34, z: 56},
				s: 'string',
			};
			const pane = new Tweakpane({
				container: container,
			});
			const nf = pane.addFolder({
				title: 'Number',
			});
			nf.addInput(PARAMS, 'n', {
				label: 'text',
			});
			nf.addInput(PARAMS, 'n', {
				label: 'slider',
				max: 100,
				min: 0,
			});
			nf.addInput(PARAMS, 'n', {
				label: 'list',
				options: {
					low: 0,
					medium: 50,
					high: 100,
				},
			});
			const sf = pane.addFolder({
				title: 'String',
			});
			sf.addInput(PARAMS, 's', {
				label: 'text',
			});
			sf.addInput(PARAMS, 's', {
				label: 'list',
				options: {
					dark: 'Dark',
					light: 'Light',
				},
			});
			const bf = pane.addFolder({
				title: 'Boolean',
			});
			bf.addInput(PARAMS, 'b', {
				label: 'checkbox',
			});
			const mf = pane.addFolder({
				title: 'Misc',
			});
			mf.addInput(PARAMS, 'c', {
				label: 'color',
			});
			mf.addInput(PARAMS, 'v2', {
				label: '2d',
			});
			mf.addInput(PARAMS, 'v3', {
				label: '3d',
			});
		},
		numbertext: (container) => {
			const PARAMS = {value: 50};
			const pane = new Tweakpane({
				container: container,
			});
			pane.addInput(PARAMS, 'value', {
				label: 'text',
			});
		},
		slider: (container) => {
			const PARAMS = {value: 50};
			const pane = new Tweakpane({
				container: container,
			});
			pane.addInput(PARAMS, 'value', {
				label: 'slider',
				max: 100,
				min: 0,
			});
		},
		step: (container) => {
			const PARAMS = {
				speed: 0.5,
				count: 10,
			};
			const pane = new Tweakpane({
				container: container,
			});
			pane.addInput(PARAMS, 'speed', {
				step: 0.1,
			});
			pane.addInput(PARAMS, 'count', {
				label: 'count',
				max: 100,
				min: 0,
				step: 10,
			});
		},
		numberlist: (container) => {
			const PARAMS = {
				quality: 0,
			};

			const consoleElem = selectContainer('numberlist', true);
			const log = {
				json: '',
			};
			const consolePane = new Tweakpane({
				container: consoleElem,
			});
			consolePane.addMonitor(log, 'json', {
				interval: 0,
				label: 'PARAMS',
				multiline: true,
			});

			const updateLog = () => {
				log.json = JSON.stringify(PARAMS, undefined, 2);
				consolePane.refresh();
			};

			const pane = new Tweakpane({
				container: container,
			});
			pane
				.addInput(PARAMS, 'quality', {
					options: {
						low: 0,
						medium: 50,
						high: 100,
					},
				})
				.on('change', () => {
					updateLog();
				});
			updateLog();
		},
		stringtext: (container) => {
			const PARAMS = {value: 'hello, world'};
			const pane = new Tweakpane({
				container: container,
			});
			pane.addInput(PARAMS, 'value', {
				label: 'message',
			});
		},
		stringlist: (container) => {
			const PARAMS = {theme: ''};

			const consoleElem = selectContainer('stringlist', true);
			const log = {
				json: '',
			};
			const consolePane = new Tweakpane({
				container: consoleElem,
			});
			consolePane.addMonitor(log, 'json', {
				interval: 0,
				label: 'PARAMS',
				multiline: true,
			});

			const updateLog = () => {
				log.json = JSON.stringify(PARAMS, undefined, 2);
				consolePane.refresh();
			};

			const pane = new Tweakpane({
				container: container,
			});
			pane
				.addInput(PARAMS, 'theme', {
					options: {
						none: '',
						dark: 'dark-theme.json',
						light: 'light-theme.json',
					},
				})
				.on('change', () => {
					updateLog();
				});
			updateLog();
		},
		checkbox: (container) => {
			const PARAMS = {value: true};
			const pane = new Tweakpane({
				container: container,
			});
			pane.addInput(PARAMS, 'value', {
				label: 'hidden',
			});
		},
		objectcolor: (container) => {
			const PARAMS = {
				background: {r: 255, g: 127, b: 0},
				tint: {r: 255, g: 255, b: 0, a: 0.5},
			};
			const pane = new Tweakpane({
				container: container,
			});
			pane.addInput(PARAMS, 'background');
			pane.addInput(PARAMS, 'tint');
		},
		stringcolor: (container) => {
			const PARAMS = {
				primary: '#8df',
				secondary: 'rgb(255, 136, 221)',
			};
			const pane = new Tweakpane({
				container: container,
			});
			pane.addInput(PARAMS, 'primary');
			pane.addInput(PARAMS, 'secondary');
		},
		numbercolor: (container) => {
			const PARAMS = {
				background: 0x0088ff,
				tint: 0x00ff0044,
			};
			const pane = new Tweakpane({
				container: container,
			});
			pane.addInput(PARAMS, 'background', {
				input: 'color',
			});
			pane.addInput(PARAMS, 'tint', {
				input: 'color.rgba',
			});
		},
		inputstring: (container) => {
			const PARAMS = {
				hex: '#0088ff',
			};
			const pane = new Tweakpane({
				container: container,
			});
			pane.addInput(PARAMS, 'hex', {
				input: 'string',
			});
		},
		point2d: (container) => {
			const PARAMS = {value: {x: 50, y: 25}};
			const pane = new Tweakpane({
				container: container,
			});
			pane.addInput(PARAMS, 'value', {
				label: 'offset',
			});
		},
		point2dparams: (container) => {
			const PARAMS = {value: {x: 20, y: 30}};
			const pane = new Tweakpane({
				container: container,
			});
			pane.addInput(PARAMS, 'value', {
				label: 'offset',
				x: {step: 20},
				y: {min: 0, max: 100},
			});
		},
		point2dinvertedy: (container) => {
			const PARAMS = {value: {x: 50, y: 50}};
			const pane = new Tweakpane({
				container: container,
			});
			pane.addInput(PARAMS, 'value', {
				label: 'offset',
				y: {inverted: true},
			});
		},
		point3d: (container) => {
			const PARAMS = {
				camera: {x: 0, y: 20, z: -10},
				source: {x: 0, y: 0, z: 0},
			};
			const pane = new Tweakpane({
				container: container,
			});
			pane.addInput(PARAMS, 'source');
			pane.addInput(PARAMS, 'camera', {
				y: {step: 10},
				z: {max: 0},
			});
		},
		point4d: (container) => {
			const PARAMS = {
				color: {x: 0, y: 0, z: 0, w: 1},
			};
			const pane = new Tweakpane({
				container: container,
			});
			const copt = {min: 0, max: 1};
			pane.addInput(PARAMS, 'color', {
				x: copt,
				y: copt,
				z: copt,
				w: copt,
			});
		},
	};
	Object.keys(markerToFnMap).forEach((marker) => {
		const initFn = markerToFnMap[marker];
		const container = selectContainer(marker);
		initFn(container);
	});
}
