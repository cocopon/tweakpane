import {Pane} from 'tweakpane';

import {selectContainer} from '../util';

export function initInputBindings() {
	const markerToFnMap: {
		[key: string]: (container: HTMLElement) => void;
	} = {
		input: (container) => {
			const PARAMS = {
				b: true,
				c: '#ff0055',
				n: 50,
				v2: {x: 12, y: 34},
				v3: {x: 12, y: 34, z: 56},
				s: 'string',
				theme: 'Dark',
			};
			const pane = new Pane({
				container: container,
			});
			const nf = pane.addFolder({
				title: 'Number',
			});
			nf.addBinding(PARAMS, 'n', {
				label: 'text',
			});
			nf.addBinding(PARAMS, 'n', {
				label: 'slider',
				max: 100,
				min: 0,
			});
			nf.addBinding(PARAMS, 'n', {
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
			sf.addBinding(PARAMS, 's', {
				label: 'text',
			});
			sf.addBinding(PARAMS, 'theme', {
				label: 'list',
				options: {
					dark: 'Dark',
					light: 'Light',
				},
			});
			const bf = pane.addFolder({
				title: 'Boolean',
			});
			bf.addBinding(PARAMS, 'b', {
				label: 'checkbox',
			});
			const mf = pane.addFolder({
				title: 'Misc',
			});
			mf.addBinding(PARAMS, 'c', {
				label: 'color',
			});
			mf.addBinding(PARAMS, 'v2', {
				label: '2d',
			});
			mf.addBinding(PARAMS, 'v3', {
				label: '3d',
			});
		},
		numbertext: (container) => {
			const PARAMS = {value: 50};
			const pane = new Pane({
				container: container,
			});
			pane.addBinding(PARAMS, 'value', {
				label: 'text',
			});
		},
		slider: (container) => {
			const PARAMS = {value: 50};
			const pane = new Pane({
				container: container,
			});
			pane.addBinding(PARAMS, 'value', {
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
			const pane = new Pane({
				container: container,
			});
			pane.addBinding(PARAMS, 'speed', {
				step: 0.1,
			});
			pane.addBinding(PARAMS, 'count', {
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
			const consolePane = new Pane({
				container: consoleElem,
			});
			consolePane.addBinding(log, 'json', {
				interval: 0,
				label: 'PARAMS',
				multiline: true,
				readonly: true,
			});

			const updateLog = () => {
				log.json = JSON.stringify(PARAMS, undefined, 2);
				consolePane.refresh();
			};

			const pane = new Pane({
				container: container,
			});
			pane
				.addBinding(PARAMS, 'quality', {
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
		numberformatter: (container) => {
			const PARAMS = {value: 0};
			const pane = new Pane({
				container: container,
			});
			pane.addBinding(PARAMS, 'value', {
				format: (v) => v.toFixed(6),
				label: 'k',
			});
		},
		stringtext: (container) => {
			const PARAMS = {value: 'hello, world'};
			const pane = new Pane({
				container: container,
			});
			pane.addBinding(PARAMS, 'value', {
				label: 'message',
			});
		},
		stringlist: (container) => {
			const PARAMS = {theme: ''};

			const consoleElem = selectContainer('stringlist', true);
			const log = {
				json: '',
			};
			const consolePane = new Pane({
				container: consoleElem,
			});
			consolePane.addBinding(log, 'json', {
				interval: 0,
				label: 'PARAMS',
				multiline: true,
				readonly: true,
			});

			const updateLog = () => {
				log.json = JSON.stringify(PARAMS, undefined, 2);
				consolePane.refresh();
			};

			const pane = new Pane({
				container: container,
			});
			pane
				.addBinding(PARAMS, 'theme', {
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
			const pane = new Pane({
				container: container,
			});
			pane.addBinding(PARAMS, 'value', {
				label: 'hidden',
			});
		},
		objectcolor: (container) => {
			const PARAMS = {
				background: {r: 255, g: 0, b: 84},
				tint: {r: 0, g: 255, b: 214, a: 0.5},
			};
			const pane = new Pane({
				container: container,
			});
			pane.addBinding(PARAMS, 'background');
			pane.addBinding(PARAMS, 'tint');
		},
		floatcolor: (container) => {
			const PARAMS = {
				overlay: {r: 1, g: 0, b: 0.33},
			};
			const pane = new Pane({
				container: container,
			});
			pane.addBinding(PARAMS, 'overlay', {
				color: {type: 'float'},
			});
		},
		stringcolor: (container) => {
			const PARAMS = {
				primary: '#f05',
				secondary: 'rgb(0, 255, 214)',
			};
			const pane = new Pane({
				container: container,
			});
			pane.addBinding(PARAMS, 'primary');
			pane.addBinding(PARAMS, 'secondary');
		},
		numbercolor: (container) => {
			const PARAMS = {
				background: 0xff0055,
				tint: 0x00ffd644,
			};
			const pane = new Pane({
				container: container,
			});
			pane.addBinding(PARAMS, 'background', {
				view: 'color',
			});
			pane.addBinding(PARAMS, 'tint', {
				color: {
					alpha: true,
				},
			});
		},
		inputstring: (container) => {
			const PARAMS = {
				hex: '#0088ff',
			};
			const pane = new Pane({
				container: container,
			});
			pane.addBinding(PARAMS, 'hex', {
				view: 'text',
			});
		},
		colorinline: (container) => {
			const PARAMS = {
				key: '#ff0055ff',
			};
			const pane = new Pane({
				container: container,
			});
			pane.addBinding(PARAMS, 'key', {
				expanded: true,
				picker: 'inline',
			});
		},
		point2d: (container) => {
			const PARAMS = {value: {x: 50, y: 25}};
			const pane = new Pane({
				container: container,
			});
			pane.addBinding(PARAMS, 'value', {
				label: 'offset',
			});
		},
		point2dparams: (container) => {
			const PARAMS = {value: {x: 20, y: 30}};
			const pane = new Pane({
				container: container,
			});
			pane.addBinding(PARAMS, 'value', {
				label: 'offset',
				x: {step: 20},
				y: {min: 0, max: 100},
			});
		},
		point2dinvertedy: (container) => {
			const PARAMS = {value: {x: 50, y: 50}};
			const pane = new Pane({
				container: container,
			});
			pane.addBinding(PARAMS, 'value', {
				label: 'offset',
				y: {inverted: true},
			});
		},
		point2dinline: (container) => {
			const PARAMS = {value: {x: 50, y: 25}};
			const pane = new Pane({
				container: container,
			});
			pane.addBinding(PARAMS, 'value', {
				expanded: true,
				label: 'offset',
				picker: 'inline',
			});
		},
		point3d: (container) => {
			const PARAMS = {
				camera: {x: 0, y: 20, z: -10},
				source: {x: 0, y: 0, z: 0},
			};
			const pane = new Pane({
				container: container,
			});
			pane.addBinding(PARAMS, 'source');
			pane.addBinding(PARAMS, 'camera', {
				y: {step: 10},
				z: {max: 0},
			});
		},
		point4d: (container) => {
			const PARAMS = {
				color: {x: 0, y: 0, z: 0, w: 1},
			};
			const pane = new Pane({
				container: container,
			});
			const copt = {min: 0, max: 1};
			pane.addBinding(PARAMS, 'color', {
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
