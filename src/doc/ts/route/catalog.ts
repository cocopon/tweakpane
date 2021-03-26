import Tweakpane from 'tweakpane';

import {selectContainer, wave} from '../util';

export function initCatalog() {
	const disabled = location.search.includes('disabled');

	const markerToFnMap: {
		[key: string]: (container: HTMLElement) => void;
	} = {
		numberinput: (container) => {
			const params = {
				number: 0,
			};
			const pane = new Tweakpane({
				container: container,
				title: 'Number',
			});
			pane.addInput(params, 'number', {
				disabled: disabled,
				label: 'text',
			});
			pane.addInput(params, 'number', {
				disabled: disabled,
				label: 'slider',
				min: -100,
				max: 100,
			});
			pane.addInput(params, 'number', {
				disabled: disabled,
				label: 'list',
				options: {
					option: 0,
				},
			});
		},
		stringinput: (container) => {
			const params = {
				string: 'text',
			};
			const pane = new Tweakpane({
				container: container,
				title: 'String',
			});
			pane.addInput(params, 'string', {
				disabled: disabled,
				label: 'text',
			});
			pane.addInput(params, 'string', {
				disabled: disabled,
				label: 'list',
				options: {
					option: 'text',
				},
			});
		},
		boolinput: (container) => {
			const params = {
				bool: true,
			};
			const pane = new Tweakpane({
				container: container,
				title: 'Boolean',
			});
			pane.addInput(params, 'bool', {
				disabled: disabled,
				label: 'checkbox',
			});
		},
		colorinput: (container) => {
			const params = {
				color: '#f00',
			};
			const pane = new Tweakpane({
				container: container,
				title: 'Color',
			});
			pane.addInput(params, 'color', {
				disabled: disabled,
				label: 'picker',
			});
		},
		pointinput: (container) => {
			const params = {
				p2d: {x: 0, y: 0},
				p3d: {x: 0, y: 0, z: 0},
				p4d: {x: 0, y: 0, z: 0, w: 0},
			};
			const pane = new Tweakpane({
				container: container,
				title: 'Point',
			});
			pane.addInput(params, 'p2d', {
				disabled: disabled,
				label: 'picker',
			});
			pane.addInput(params, 'p3d', {
				disabled: disabled,
				label: 'text',
			});
			pane.addInput(params, 'p4d', {
				disabled: disabled,
				label: 'text',
			});
		},
		numbermonitor: (container) => {
			const params = {
				number: 0,
			};
			let wavet = 0;
			setInterval(() => {
				params.number = wave(wavet);
				wavet += 1;
			}, 50);

			const pane = new Tweakpane({
				container: container,
				title: 'Number',
			});
			pane.addMonitor(params, 'number', {
				disabled: disabled,
				label: 'text',
			});
			pane.addMonitor(params, 'number', {
				bufferSize: 10,
				disabled: disabled,
				label: 'multiline',
			});
			pane.addMonitor(params, 'number', {
				disabled: disabled,
				label: 'graph',
				max: +1,
				min: -1,
				view: 'graph',
			});
		},
		stringmonitor: (container) => {
			const params = {
				string: new Date().toISOString(),
			};
			setInterval(() => {
				params.string = new Date().toISOString();
			}, 1000);

			const pane = new Tweakpane({
				container: container,
				title: 'String',
			});
			pane.addMonitor(params, 'string', {
				disabled: disabled,
				interval: 1000,
				label: 'text',
			});
			pane.addMonitor(params, 'string', {
				bufferSize: 10,
				disabled: disabled,
				interval: 1000,
				label: 'multiline',
			});
		},
		boolmonitor: (container) => {
			const params = {
				bool: true,
			};
			setInterval(() => {
				params.bool = !params.bool;
			}, 1000);

			const pane = new Tweakpane({
				container: container,
				title: 'Boolean',
			});
			pane.addMonitor(params, 'bool', {
				disabled: disabled,
				interval: 1000,
				label: 'text',
			});
			pane.addMonitor(params, 'bool', {
				bufferSize: 10,
				disabled: disabled,
				interval: 1000,
				label: 'multiline',
			});
		},
		folder: (container) => {
			const pane = new Tweakpane({
				container: container,
				title: 'Folder',
			});
			pane.addInput({param: 0}, 'param', {disabled: disabled});
			const f = pane.addFolder({
				title: 'Folder',
			});
			f.addInput({param: 0}, 'param', {disabled: disabled});
			const sf = f.addFolder({
				title: 'Subfolder',
			});
			sf.addInput({param: 0}, 'param', {disabled: disabled});
		},
		button: (container) => {
			const pane = new Tweakpane({
				container: container,
				title: 'Button',
			});
			pane.addButton({
				disabled: disabled,
				title: 'Button',
			});
			pane.addButton({
				disabled: disabled,
				label: 'label',
				title: 'Button',
			});
		},
		separator: (container) => {
			const pane = new Tweakpane({
				container: container,
				title: 'Separator',
			});
			pane.addInput({param: 0}, 'param', {disabled: disabled});
			pane.addSeparator();
			pane.addInput({param: 0}, 'param', {disabled: disabled});
		},
	};
	Object.keys(markerToFnMap).forEach((marker) => {
		const initFn = markerToFnMap[marker];
		const container = selectContainer(marker);
		initFn(container);
	});
}
