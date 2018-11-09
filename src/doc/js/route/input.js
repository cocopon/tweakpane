// @flow

import * as Util from '../util';

declare var Tweakpane: any;

export default {
	pathname: /^(\/tweakpane)?\/input.html$/,
	init() {
		const markerToFnMap = {
			input(container) {
				const PARAMS = {
					b: true,
					c: '#ff8800',
					n: 50,
					s: 'string',
				};
				const pane = new Tweakpane({
					container,
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
				const cf = pane.addFolder({
					title: 'Color',
				});
				cf.addInput(PARAMS, 'c', {
					label: 'text',
				});
			},
			numberText(container) {
				const PARAMS = {value: 50};
				const pane = new Tweakpane({
					container,
				});
				pane.addInput(PARAMS, 'value', {
					label: 'text',
				});
			},
			slider(container) {
				const PARAMS = {value: 50};
				const pane = new Tweakpane({
					container,
				});
				pane.addInput(PARAMS, 'value', {
					label: 'slider',
					max: 100,
					min: 0,
				});
			},
			step(container) {
				const PARAMS = {
					speed: 0.5,
					count: 10,
				};
				const pane = new Tweakpane({
					container,
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
			numberList(container) {
				const PARAMS = {value: 50};
				const pane = new Tweakpane({
					container,
				});
				pane.addInput(PARAMS, 'value', {
					label: 'quality',
					options: {
						low: 0,
						medium: 50,
						high: 100,
					},
				});
				pane.addSeparator();
				pane.addMonitor(PARAMS, 'value', {
					label: '(actual)',
				});
			},
			stringText(container) {
				const PARAMS = {value: 'hello, world'};
				const pane = new Tweakpane({
					container,
				});
				pane.addInput(PARAMS, 'value', {
					label: 'message',
				});
			},
			stringList(container) {
				const PARAMS = {value: ''};
				const pane = new Tweakpane({
					container,
				});
				pane.addInput(PARAMS, 'value', {
					label: 'theme',
					options: {
						none: '',
						dark: 'path/to/dark.json',
						light: 'path/to/Light.json',
					},
				});
				pane.addSeparator();
				pane.addMonitor(PARAMS, 'value', {
					label: '(actual)',
				});
			},
			checkbox(container) {
				const PARAMS = {value: true};
				const pane = new Tweakpane({
					container,
				});
				pane.addInput(PARAMS, 'value', {
					label: 'hidden',
				});
			},
			color(container) {
				const PARAMS = {value: '#ff8800'};
				const pane = new Tweakpane({
					container,
				});
				pane.addInput(PARAMS, 'value', {
					label: 'color',
				});
			},
		};
		Object.keys(markerToFnMap).forEach((marker) => {
			const initFn = markerToFnMap[marker];
			const container = Util.selectContainer(marker);
			initFn(container);
		});
	},
};
